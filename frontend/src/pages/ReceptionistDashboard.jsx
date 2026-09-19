import React, { useState, useEffect } from 'react';
import { Receipt, Users, DollarSign, Clock, RefreshCw, Sparkles, CheckCircle2, RotateCcw, QrCode } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { getTables, getOrders, updateOrderStatus, settleTableBill, resetDemoDatabase } from '../api/apiClient';
import { playBillAlertSound } from '../utils/soundEffects';

import { TableOccupancyGrid } from '../components/receptionist/TableOccupancyGrid';
import { ActiveOrdersTable } from '../components/receptionist/ActiveOrdersTable';
import { BillingModal } from '../components/receptionist/BillingModal';
import { UniversalQrStand } from '../components/receptionist/UniversalQrStand';

export const ReceptionistDashboard = () => {
  const { socket, joinRoom } = useSocket();

  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Selected State
  const [selectedTableNumber, setSelectedTableNumber] = useState(null);
  const [tableFilterState, setTableFilterState] = useState('all');

  // Billing Modal State
  const [billingModalTable, setBillingModalTable] = useState(null);
  const [billingModalOrders, setBillingModalOrders] = useState([]);
  const [isSettling, setIsSettling] = useState(false);

  // Fetch initial tables and orders
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [tablesRes, ordersRes] = await Promise.all([
        getTables(),
        getOrders({ activeOnly: false })
      ]);

      if (tablesRes.success) setTables(tablesRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
    } catch (err) {
      console.error('Error loading receptionist data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Socket Room Join and Live Events
  useEffect(() => {
    if (!socket) return;

    joinRoom('reception');

    // 1. New Order arrives
    socket.on('reception:new_order', ({ order, table }) => {
      console.log('[Reception] New order event:', order);
      setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);

      if (table) {
        setTables((prev) =>
          prev.map((t) => (t.table_number === table.table_number ? { ...t, ...table, status: 'occupied' } : t))
        );
      }
    });

    // 2. Bill Requested by Customer at Table
    socket.on('reception:bill_requested', ({ table_number, table }) => {
      console.log('[Reception] Bill requested for table:', table_number);
      playBillAlertSound();

      setTables((prev) =>
        prev.map((t) =>
          t.table_number === table_number
            ? { ...t, status: 'billing_pending' }
            : t
        )
      );
    });

    // 3. Order status updated
    socket.on('reception:order_updated', (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
    });

    // 4. Table status update broadcast
    socket.on('table:status_update', (updatedTable) => {
      setTables((prev) =>
        prev.map((t) => (t.table_number === updatedTable.table_number ? { ...t, ...updatedTable } : t))
      );
    });

    // 5. Bill Settled broadcast
    socket.on('table:bill_settled', ({ table_number, table }) => {
      setTables((prev) =>
        prev.map((t) =>
          t.table_number === table_number ? { ...t, status: 'vacant', current_total: 0, orders: [] } : t
        )
      );
      setOrders((prev) =>
        prev.map((o) => (o.table_number === table_number ? { ...o, status: 'paid' } : o))
      );
    });

    return () => {
      socket.off('reception:new_order');
      socket.off('reception:bill_requested');
      socket.off('reception:order_updated');
      socket.off('table:status_update');
      socket.off('table:bill_settled');
    };
  }, [socket, joinRoom]);

  // Open Billing Modal for a table
  const handleOpenBilling = (tableNum, specificOrder = null) => {
    const num = parseInt(tableNum, 10);
    const tableActiveOrders = orders.filter(
      (o) => o.table_number === num && o.status !== 'paid'
    );

    setBillingModalTable(num);
    setBillingModalOrders(
      tableActiveOrders.length > 0 ? tableActiveOrders : specificOrder ? [specificOrder] : []
    );
  };

  // Status transition from reception (Start Prep -> Mark Ready -> Served)
  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await updateOrderStatus(orderId, status);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? res.data : o))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Settle Bill
  const handleSettle = async (tableNum) => {
    try {
      setIsSettling(true);
      const res = await settleTableBill(tableNum);
      if (res.success) {
        setTables((prev) =>
          prev.map((t) =>
            t.table_number === tableNum ? { ...t, status: 'vacant', current_total: 0 } : t
          )
        );
        setOrders((prev) =>
          prev.map((o) => (o.table_number === tableNum ? { ...o, status: 'paid' } : o))
        );
        setBillingModalTable(null);
      }
    } catch (err) {
      console.error('Failed to settle bill:', err);
      alert('Could not settle bill. Please try again.');
    } finally {
      setIsSettling(false);
    }
  };

  // Reset Demo Database
  const handleResetData = async () => {
    if (window.confirm('Reset database to default seed state?')) {
      await resetDemoDatabase();
      await loadDashboardData();
    }
  };

  // Filtered orders for table selection
  const filteredOrders = orders.filter((o) => {
    if (selectedTableNumber) {
      return o.table_number === selectedTableNumber;
    }
    return o.status !== 'paid';
  });

  // Calculate Metrics
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
  const billPendingTables = tables.filter((t) => t.status === 'billing_pending').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const activeOrderValue = orders
    .filter((o) => o.status !== 'paid')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Reception Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-4 sticky top-0 z-30 backdrop-blur-xl no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Receptionist & Billing Dashboard
              </h1>
              <p className="text-xs text-slate-400">
                Floor Plan Live Occupancy • POS Billing • 1 Universal Restaurant QR
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition"
              title="Reset sample tables and orders"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            <button
              onClick={loadDashboardData}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
              title="Refresh register"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* KPI Metrics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 no-print">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Occupied Tables</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black font-mono text-blue-400 mt-2">
              {occupiedTables} <span className="text-xs font-normal text-slate-500">/ 20</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Bill Requests</span>
              <Receipt className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black font-mono text-amber-400 mt-2">
              {billPendingTables} <span className="text-xs font-normal text-slate-500">pending</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Active Tabs Value</span>
              <Clock className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-black font-mono text-orange-300 mt-2">
              ₹{activeOrderValue}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Settled Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-2">
              ₹{totalRevenue}
            </div>
          </div>
        </div>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Live 20-Table Grid + Universal QR Stand (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <TableOccupancyGrid
              tables={tables}
              selectedTableNumber={selectedTableNumber}
              onSelectTable={(num) => {
                setSelectedTableNumber((prev) => (prev === num ? null : num));
              }}
              filterState={tableFilterState}
              onFilterChange={setTableFilterState}
            />

            {/* 1 Universal QR Code Stand Component */}
            <UniversalQrStand />
          </div>

          {/* Right Column: Active Orders & Billing Table (7 cols) */}
          <div className="lg:col-span-7 no-print">
            <ActiveOrdersTable
              orders={filteredOrders}
              selectedTableNumber={selectedTableNumber}
              onClearFilter={() => setSelectedTableNumber(null)}
              onOpenBillingModal={(tableNum, order) => handleOpenBilling(tableNum, order)}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        </div>
      </main>

      {/* Cashier Billing Modal */}
      <BillingModal
        isOpen={Boolean(billingModalTable)}
        onClose={() => setBillingModalTable(null)}
        tableNumber={billingModalTable}
        orders={billingModalOrders}
        onSettleBill={handleSettle}
        isSettling={isSettling}
      />
    </div>
  );
};
