import { seedCategories, seedMenuItems, seedTables } from './seedData.js';

// In-Memory / File-persisted state container for zero-friction local run and fallback
class InMemoryDatabase {
  constructor() {
    this.categories = [];
    this.menuItems = [];
    this.tables = [];
    this.orders = [];
    this.orderItems = [];
    this.init();
  }

  init() {
    this.categories = JSON.parse(JSON.stringify(seedCategories));
    this.menuItems = JSON.parse(JSON.stringify(seedMenuItems));
    this.tables = JSON.parse(JSON.stringify(seedTables));
    this.orders = [];
    this.orderItems = [];
    console.log('[DB] In-Memory / Local DB initialized with 4 categories, 16 menu items, and 20 tables.');
  }

  // Categories
  async getCategories() {
    return [...this.categories].sort((a, b) => a.sort_order - b.sort_order);
  }

  // Menu Items
  async getMenuItems({ categoryId, availableOnly = false } = {}) {
    let items = [...this.menuItems];
    if (categoryId) {
      items = items.filter(i => i.category_id === categoryId);
    }
    if (availableOnly) {
      items = items.filter(i => i.is_available);
    }
    // enrich with category name
    return items.map(item => {
      const category = this.categories.find(c => c.id === item.category_id);
      return { ...item, category: category ? { id: category.id, name: category.name } : null };
    });
  }

  async getMenuItemById(id) {
    const item = this.menuItems.find(i => i.id === id);
    if (!item) return null;
    const category = this.categories.find(c => c.id === item.category_id);
    return { ...item, category: category ? { id: category.id, name: category.name } : null };
  }

  // Tables
  async getTables() {
    // Sort by table number
    return [...this.tables].sort((a, b) => a.table_number - b.table_number);
  }

  async getTableByNumber(tableNumber) {
    const num = parseInt(tableNumber, 10);
    return this.tables.find(t => t.table_number === num) || null;
  }

  async updateTableStatus(tableNumber, status) {
    const num = parseInt(tableNumber, 10);
    const table = this.tables.find(t => t.table_number === num);
    if (table) {
      table.status = status;
      table.updated_at = new Date().toISOString();
      return { ...table };
    }
    return null;
  }

  // Orders
  async createOrder({ table_number, customer_name, items = [] }) {
    const tableNum = parseInt(table_number, 10);
    const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    let totalAmount = 0;
    const populatedItems = items.map((item, index) => {
      const menuItem = this.menuItems.find(m => m.id === item.item_id);
      const unitPrice = item.unit_price ?? (menuItem ? menuItem.price : 0);
      const quantity = parseInt(item.quantity || 1, 10);
      const subtotal = unitPrice * quantity;
      totalAmount += subtotal;

      const orderItem = {
        id: `oi-${orderId}-${index + 1}`,
        order_id: orderId,
        item_id: item.item_id || null,
        item_name: item.item_name || (menuItem ? menuItem.name : 'Custom Item'),
        quantity,
        unit_price: unitPrice,
        special_instructions: item.special_instructions || null,
        created_at: new Date().toISOString()
      };
      this.orderItems.push(orderItem);
      return orderItem;
    });

    const newOrder = {
      id: orderId,
      table_number: tableNum,
      customer_name: customer_name?.trim() || `Guest (Table ${tableNum})`,
      status: 'placed', // placed, preparing, ready, completed, paid
      total_amount: Math.round(totalAmount * 100) / 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: populatedItems
    };

    this.orders.unshift(newOrder);

    // Update table status to occupied
    await this.updateTableStatus(tableNum, 'occupied');

    return newOrder;
  }

  async getOrders({ status, tableNumber, activeOnly = false } = {}) {
    let orders = [...this.orders];

    if (activeOnly) {
      orders = orders.filter(o => ['placed', 'preparing', 'ready'].includes(o.status));
    } else if (status) {
      orders = orders.filter(o => o.status === status);
    }

    if (tableNumber) {
      const num = parseInt(tableNumber, 10);
      orders = orders.filter(o => o.table_number === num);
    }

    // Attach items
    return orders.map(order => {
      const items = this.orderItems.filter(i => i.order_id === order.id);
      return { ...order, items };
    });
  }

  async getOrderById(id) {
    const order = this.orders.find(o => o.id === id);
    if (!order) return null;
    const items = this.orderItems.filter(i => i.order_id === order.id);
    return { ...order, items };
  }

  async updateOrderStatus(id, newStatus) {
    const order = this.orders.find(o => o.id === id);
    if (!order) return null;

    order.status = newStatus;
    order.updated_at = new Date().toISOString();

    const items = this.orderItems.filter(i => i.order_id === order.id);
    return { ...order, items };
  }

  async settleTableOrders(tableNumber) {
    const num = parseInt(tableNumber, 10);
    const tableOrders = this.orders.filter(o => o.table_number === num && o.status !== 'paid');
    
    tableOrders.forEach(o => {
      o.status = 'paid';
      o.updated_at = new Date().toISOString();
    });

    await this.updateTableStatus(num, 'vacant');

    return {
      table_number: num,
      settled_orders: tableOrders.length,
      status: 'vacant'
    };
  }

  async resetSeed() {
    this.init();
    return { success: true, message: 'Database reset to fresh seed state.' };
  }
}

// Export singleton instance
export const db = new InMemoryDatabase();
