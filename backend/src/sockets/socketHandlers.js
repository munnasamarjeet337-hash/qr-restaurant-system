import { db } from '../models/db.js';

export const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join room handler (kitchen, reception, table_N)
    socket.on('join_room', (data) => {
      let room = '';
      if (typeof data === 'string') {
        room = data;
      } else if (data && data.room) {
        room = data.room;
      } else if (data && data.tableNumber) {
        room = `table_${data.tableNumber}`;
      }

      if (room) {
        socket.join(room);
        console.log(`[Socket] Client ${socket.id} joined room: ${room}`);
        socket.emit('joined_room', { room, success: true });
      }
    });

    // Leave room handler
    socket.on('leave_room', (room) => {
      if (room) {
        socket.leave(room);
        console.log(`[Socket] Client ${socket.id} left room: ${room}`);
      }
    });

    // Direct socket order:placed event handler (as fallback to REST)
    socket.on('order:placed', async (orderPayload, callback) => {
      try {
        const { table_number, customer_name, items } = orderPayload;
        const newOrder = await db.createOrder({
          table_number,
          customer_name,
          items
        });
        const updatedTable = await db.getTableByNumber(table_number);

        // Broadcast to kitchen
        io.to('kitchen').emit('kitchen:new_order', {
          order: newOrder,
          timestamp: new Date().toISOString()
        });

        // Broadcast to reception
        io.to('reception').emit('reception:new_order', {
          order: newOrder,
          table: updatedTable,
          timestamp: new Date().toISOString()
        });

        // Broadcast to the table room
        io.to(`table_${table_number}`).emit('order:created', newOrder);
        io.emit('table:status_update', updatedTable);
        io.emit('order:new_broadcast', newOrder);

        if (typeof callback === 'function') {
          callback({ success: true, data: newOrder });
        }
      } catch (err) {
        console.error('[Socket] Error in order:placed:', err);
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    // Order status update event (Kitchen / Cashier)
    socket.on('order:status_update', async ({ orderId, status }, callback) => {
      try {
        const updatedOrder = await db.updateOrderStatus(orderId, status);
        if (updatedOrder) {
          io.emit('order:status_update', updatedOrder);
          io.to('kitchen').emit('kitchen:order_updated', updatedOrder);
          io.to('reception').emit('reception:order_updated', updatedOrder);
          io.to(`table_${updatedOrder.table_number}`).emit('table:order_update', updatedOrder);

          if (typeof callback === 'function') {
            callback({ success: true, data: updatedOrder });
          }
        }
      } catch (err) {
        console.error('[Socket] Error in order:status_update:', err);
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    // Customer requests bill via socket
    socket.on('table:request_bill', async ({ tableNumber }, callback) => {
      try {
        const num = parseInt(tableNumber, 10);
        const updatedTable = await db.updateTableStatus(num, 'billing_pending');
        if (updatedTable) {
          io.emit('table:status_update', updatedTable);
          io.to('reception').emit('reception:bill_requested', {
            table_number: num,
            table: updatedTable
          });
          io.to(`table_${num}`).emit('table:bill_requested_ack', {
            table_number: num,
            status: 'billing_pending'
          });

          if (typeof callback === 'function') {
            callback({ success: true, data: updatedTable });
          }
        }
      } catch (err) {
        console.error('[Socket] Error in table:request_bill:', err);
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    // Reception settles bill
    socket.on('table:bill_settled', async ({ tableNumber }, callback) => {
      try {
        const num = parseInt(tableNumber, 10);
        const result = await db.settleTableOrders(num);
        const updatedTable = await db.getTableByNumber(num);

        io.emit('table:status_update', updatedTable);
        io.emit('table:bill_settled', {
          table_number: num,
          settled_at: new Date().toISOString(),
          table: updatedTable
        });
        io.to(`table_${num}`).emit('table:session_reset', {
          table_number: num,
          message: 'Table bill settled. Thank you for dining with us!'
        });
        io.to('kitchen').emit('kitchen:table_cleared', { table_number: num });

        if (typeof callback === 'function') {
          callback({ success: true, data: result });
        }
      } catch (err) {
        console.error('[Socket] Error in table:bill_settled:', err);
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};
