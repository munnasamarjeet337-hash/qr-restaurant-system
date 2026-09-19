import { db } from '../models/db.js';

export const createOrder = async (req, res) => {
  try {
    const { table_number, customer_name, items } = req.body;

    if (!table_number) {
      return res.status(400).json({ success: false, message: 'Table number is required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    const newOrder = await db.createOrder({
      table_number,
      customer_name,
      items
    });

    const updatedTable = await db.getTableByNumber(table_number);

    // Socket.io real-time broadcasts
    const io = req.app.get('io');
    if (io) {
      // 1. Kitchen display notification with sound trigger payload
      io.to('kitchen').emit('kitchen:new_order', {
        order: newOrder,
        timestamp: new Date().toISOString()
      });

      // 2. Receptionist dashboard notification
      io.to('reception').emit('reception:new_order', {
        order: newOrder,
        table: updatedTable,
        timestamp: new Date().toISOString()
      });

      // 3. Customer's table room notification
      io.to(`table_${table_number}`).emit('order:created', newOrder);

      // 4. Global updates
      io.emit('table:status_update', updatedTable);
      io.emit('order:new_broadcast', newOrder);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully and sent to kitchen!',
      data: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, tableNumber, activeOnly } = req.query;
    const orders = await db.getOrders({
      status,
      tableNumber,
      activeOnly: activeOnly === 'true'
    });
    res.json({ success: true, data: orders, count: orders.length });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await db.getOrderById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order by id:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['placed', 'preparing', 'ready', 'completed', 'paid'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updatedOrder = await db.updateOrderStatus(id, status);
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const io = req.app.get('io');
    if (io) {
      // Broadcast status update to all connected clients & targeted rooms
      io.emit('order:status_update', updatedOrder);
      io.to('kitchen').emit('kitchen:order_updated', updatedOrder);
      io.to('reception').emit('reception:order_updated', updatedOrder);
      io.to(`table_${updatedOrder.table_number}`).emit('table:order_update', updatedOrder);
    }

    res.json({
      success: true,
      message: `Order status updated to '${status}'`,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
};
