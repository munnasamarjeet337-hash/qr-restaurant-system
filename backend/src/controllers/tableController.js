import { db } from '../models/db.js';

export const getAllTables = async (req, res) => {
  try {
    const tables = await db.getTables();
    
    // Also attach active order summary to each table for the receptionist grid
    const activeOrders = await db.getOrders({ activeOnly: false });
    
    const tablesWithOrders = tables.map(table => {
      const tableOrders = activeOrders.filter(
        o => o.table_number === table.table_number && o.status !== 'paid'
      );
      const totalAmount = tableOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      return {
        ...table,
        active_orders_count: tableOrders.length,
        current_total: Math.round(totalAmount * 100) / 100,
        orders: tableOrders
      };
    });

    res.json({ success: true, data: tablesWithOrders });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tables', error: error.message });
  }
};

export const getTableByNumber = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const table = await db.getTableByNumber(tableNumber);
    if (!table) {
      return res.status(404).json({ success: false, message: `Table #${tableNumber} not found` });
    }

    const tableOrders = await db.getOrders({ tableNumber });
    const activeOrders = tableOrders.filter(o => o.status !== 'paid');
    const totalAmount = activeOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    res.json({
      success: true,
      data: {
        ...table,
        active_orders: activeOrders,
        all_orders: tableOrders,
        current_total: Math.round(totalAmount * 100) / 100
      }
    });
  } catch (error) {
    console.error('Error fetching table details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch table details', error: error.message });
  }
};

export const requestBill = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const num = parseInt(tableNumber, 10);
    
    const updatedTable = await db.updateTableStatus(num, 'billing_pending');
    if (!updatedTable) {
      return res.status(404).json({ success: false, message: `Table #${tableNumber} not found` });
    }

    const io = req.app.get('io');
    if (io) {
      // Broadcast to reception and the specific table
      io.emit('table:status_update', updatedTable);
      io.to('reception').emit('reception:bill_requested', {
        table_number: num,
        timestamp: new Date().toISOString(),
        table: updatedTable
      });
      io.to(`table_${num}`).emit('table:bill_requested_ack', {
        table_number: num,
        status: 'billing_pending'
      });
    }

    res.json({
      success: true,
      message: `Bill requested for Table #${tableNumber}`,
      data: updatedTable
    });
  } catch (error) {
    console.error('Error requesting bill:', error);
    res.status(500).json({ success: false, message: 'Failed to request bill', error: error.message });
  }
};

export const settleTableBill = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const num = parseInt(tableNumber, 10);

    const result = await db.settleTableOrders(num);
    const updatedTable = await db.getTableByNumber(num);

    const io = req.app.get('io');
    if (io) {
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
    }

    res.json({
      success: true,
      message: `Table #${tableNumber} settled and marked vacant`,
      data: result
    });
  } catch (error) {
    console.error('Error settling table bill:', error);
    res.status(500).json({ success: false, message: 'Failed to settle table bill', error: error.message });
  }
};

export const resetDatabase = async (req, res) => {
  try {
    const result = await db.resetSeed();
    const io = req.app.get('io');
    if (io) {
      io.emit('system:reset', { message: 'Database reset to default seed.' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ success: false, message: 'Failed to reset database', error: error.message });
  }
};
