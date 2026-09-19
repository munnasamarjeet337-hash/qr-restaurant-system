import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, Flame, BellRing, Volume2, VolumeX, Sparkles, RefreshCw, Clock, CheckCircle2 } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { getOrders, updateOrderStatus } from '../api/apiClient';
import { playKitchenChime } from '../utils/soundEffects';
import { KanbanColumn } from '../components/kitchen/KanbanColumn';

export const KitchenKDS = () => {
  const { socket, joinRoom } = useSocket();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [newOrderIds, setNewOrderIds] = useState(new Set());
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Fetch all active orders
  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders({ activeOnly: true });
      if (res.success) {
        setOrders(res.data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error('Error fetching kitchen orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  // Socket Room Join & Real-Time Event Handlers
  useEffect(() => {
    if (!socket) return;

    joinRoom('kitchen');

    // 1. New incoming order placed by customer
    socket.on('kitchen:new_order', ({ order }) => {
      console.log('[KDS] New order arrived:', order);

      // Play chime if audio is enabled
      if (audioEnabled) {
        playKitchenChime();
      }

      // Add to state and mark with entrance pulse animation
      setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);
      setNewOrderIds((prev) => new Set([...prev, order.id]));

      // Clear pulse highlight after 4 seconds
      setTimeout(() => {
        setNewOrderIds((prev) => {
          const next = new Set(prev);
          next.delete(order.id);
          return next;
        });
      }, 4000);
    });

    // 2. Order status updated from any device
    socket.on('kitchen:order_updated', (updatedOrder) => {
      setOrders((prev) => {
        if (updatedOrder.status === 'completed' || updatedOrder.status === 'paid') {
          return prev.filter((o) => o.id !== updatedOrder.id);
        }
        return prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
      });
    });

    // 3. Table cleared / bill settled
    socket.on('kitchen:table_cleared', ({ table_number }) => {
      setOrders((prev) => prev.filter((o) => o.table_number !== table_number));
    });

    return () => {
      socket.off('kitchen:new_order');
      socket.off('kitchen:order_updated');
      socket.off('kitchen:table_cleared');
    };
  }, [socket, audioEnabled, joinRoom]);

  // Handle status transition
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders((prev) => {
          if (newStatus === 'completed' || newStatus === 'paid') {
            return prev.filter((o) => o.id !== orderId);
          }
          return prev.map((o) => (o.id === orderId ? res.data : o));
        });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Group orders by status
  const newOrders = orders.filter((o) => o.status === 'placed');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  // Stats calculation
  const totalActiveItems = orders.reduce((sum, order) => {
    const itemCount = (order.items || []).reduce((s, i) => s + (i.quantity || 1), 0);
    return sum + itemCount;
  }, 0);

  return (
    <div className="min-h-screen bg-[#111827] text-slate-100 flex flex-col">
      {/* Top KDS Command Bar */}
      <header className="bg-slate-950/90 border-b border-slate-800 px-6 py-4 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          {/* Title & Live Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Kitchen Display System
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  LIVE KDS
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Tablet & TV Optimized • Auto-chimes on incoming tickets
              </p>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Active Tickets */}
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-2xl flex items-center gap-2">
              <span className="text-[11px] uppercase font-bold text-slate-400">Tickets:</span>
              <span className="font-mono font-black text-amber-400 text-sm">{orders.length}</span>
            </div>

            {/* Total Items to cook */}
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-2xl flex items-center gap-2">
              <span className="text-[11px] uppercase font-bold text-slate-400">Items:</span>
              <span className="font-mono font-black text-white text-sm">{totalActiveItems}</span>
            </div>

            {/* Audio Toggle & Sound Test */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
              <button
                onClick={() => setAudioEnabled((a) => !a)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  audioEnabled
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={audioEnabled ? 'Audio Chime Enabled' : 'Audio Muted'}
              >
                {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{audioEnabled ? 'Chime ON' : 'Muted'}</span>
              </button>

              <button
                onClick={playKitchenChime}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                title="Test bell chime"
              >
                Test Bell
              </button>
            </div>

            {/* Manual Refresh */}
            <button
              onClick={fetchActiveOrders}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
              title="Refresh tickets"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Kanban Board Grid */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* 1. New Orders Column */}
          <KanbanColumn
            title="New Orders"
            subtitle="Pending chef review"
            icon={Clock}
            orders={newOrders}
            colorScheme="amber"
            onStatusChange={handleStatusChange}
            newOrderIds={newOrderIds}
          />

          {/* 2. Preparing Column */}
          <KanbanColumn
            title="Preparing"
            subtitle="Actively cooking"
            icon={Flame}
            orders={preparingOrders}
            colorScheme="orange"
            onStatusChange={handleStatusChange}
            newOrderIds={newOrderIds}
          />

          {/* 3. Ready to Serve Column */}
          <KanbanColumn
            title="Ready to Serve"
            subtitle="Awaiting runner dispatch"
            icon={BellRing}
            orders={readyOrders}
            colorScheme="emerald"
            onStatusChange={handleStatusChange}
            newOrderIds={newOrderIds}
          />
        </div>
      </main>
    </div>
  );
};
