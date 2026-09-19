import React, { useState, useEffect } from 'react';
import { Clock, MessageSquareQuote, CheckCircle2, Play, Flame, Utensils, AlertTriangle } from 'lucide-react';

export const OrderCard = ({ order, onStatusChange, isNew = false }) => {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Calculate elapsed time from created_at
  useEffect(() => {
    const calculateElapsed = () => {
      if (!order.created_at) return;
      const createdTime = new Date(order.created_at).getTime();
      const now = Date.now();
      const diffMins = Math.floor((now - createdTime) / (1000 * 60));
      setElapsedMinutes(Math.max(0, diffMins));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [order.created_at]);

  // Is urgent if elapsed > 15 mins and not yet ready
  const isUrgent = elapsedMinutes >= 15 && order.status !== 'ready' && order.status !== 'completed';

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`bg-slate-900 border rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all duration-300 ${
        isNew ? 'animate-entrance-pulse ring-2 ring-amber-400' : ''
      } ${
        isUrgent
          ? 'border-rose-500/60 bg-gradient-to-b from-rose-950/20 to-slate-900'
          : order.status === 'ready'
          ? 'border-emerald-500/40'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div>
        {/* Top Header: Table # & Elapsed Timer */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-white tracking-tight bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
                Table #{order.table_number}
              </span>
              {isUrgent && (
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> &gt;15m Delayed
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1.5">
              <span>{order.customer_name || 'Guest'}</span>
              <span>•</span>
              <span className="font-mono text-[11px] text-slate-500">#{order.id.slice(-6)}</span>
            </div>
          </div>

          {/* Elapsed Timer Counter */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${
              isUrgent
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : elapsedMinutes >= 10
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{elapsedMinutes}m ago</span>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="py-3 space-y-2.5">
          {order.items && order.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between text-sm font-bold text-white">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-xs">
                    {item.quantity}x
                  </span>
                  <span>{item.item_name}</span>
                </span>
              </div>

              {/* CRITICAL: Prominent High-Contrast Amber Callout for Special Instructions */}
              {item.special_instructions && (
                <div className="bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2 shadow-sm">
                  <MessageSquareQuote className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="tracking-wide">NOTE: {item.special_instructions}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Footer Actions */}
      <div className="pt-3 border-t border-slate-800 mt-2 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500 font-mono">
          Received at {formatTime(order.created_at)}
        </span>

        {/* Action Button depending on current status */}
        {order.status === 'placed' && (
          <button
            onClick={() => onStatusChange(order.id, 'preparing')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Preparing</span>
          </button>
        )}

        {order.status === 'preparing' && (
          <button
            onClick={() => onStatusChange(order.id, 'ready')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Mark as Ready</span>
          </button>
        )}

        {order.status === 'ready' && (
          <button
            onClick={() => onStatusChange(order.id, 'completed')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs active:scale-95 transition-all"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Served to Table</span>
          </button>
        )}

        {order.status === 'completed' && (
          <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold">
            ✓ Served
          </span>
        )}
      </div>
    </div>
  );
};
