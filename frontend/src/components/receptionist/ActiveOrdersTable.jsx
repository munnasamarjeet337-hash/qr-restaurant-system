import React from 'react';
import { Clock, MessageSquareQuote, Receipt, CheckCircle2, Play, Utensils, Sparkles } from 'lucide-react';

export const ActiveOrdersTable = ({
  orders = [],
  onOpenBillingModal,
  onUpdateStatus,
  selectedTableNumber,
  onClearFilter
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'preparing':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'ready':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse';
      case 'completed':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'paid':
        return 'bg-slate-700/60 text-slate-300 border-slate-600';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col">
      {/* Table Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h2 className="font-extrabold text-base text-white flex items-center gap-2">
            <span>Live Dining Orders & Table Management</span>
          </h2>
          {selectedTableNumber && (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                Filtered: Table #{selectedTableNumber}
              </span>
              <button
                onClick={onClearFilter}
                className="text-xs text-slate-400 hover:text-white underline transition"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <span className="text-xs font-mono text-slate-400">
          {orders.length} active ticket(s)
        </span>
      </div>

      {/* Orders Table Container */}
      <div className="overflow-x-auto mt-4">
        {orders.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-2xl p-6 text-center">
            <Receipt className="w-10 h-10 mb-2 opacity-30 text-amber-400" />
            <p className="text-sm font-semibold text-slate-400">No active dining orders</p>
            <p className="text-xs text-slate-600 mt-0.5">
              Customer orders placed via the Universal QR code will appear here instantly.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 rounded-l-xl">Table #</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Ordered Items & Special Notes</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Order Status</th>
                <th className="py-3 px-3 text-right">Total</th>
                <th className="py-3 px-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-800/40 transition-colors duration-150"
                >
                  {/* Table # */}
                  <td className="py-3.5 px-3 font-mono font-extrabold text-sm text-white">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                      T{order.table_number}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-3 font-semibold text-slate-200">
                    <div>{order.customer_name || 'Guest'}</div>
                    <div className="text-[10px] text-slate-500 font-mono">#{order.id.slice(-6)}</div>
                  </td>

                  {/* Items & Highlighted Notes */}
                  <td className="py-3.5 px-3 max-w-xs">
                    <div className="space-y-1.5">
                      {order.items &&
                        order.items.map((item, idx) => (
                          <div key={idx} className="flex flex-col">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white font-medium">
                                <span className="text-amber-400 font-bold mr-1">
                                  {item.quantity}x
                                </span>
                                {item.item_name}
                              </span>
                              <span className="text-slate-400 font-mono text-[11px] ml-2">
                                ₹{item.unit_price * item.quantity}
                              </span>
                            </div>
                            {item.special_instructions && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded mt-0.5 font-mono">
                                <MessageSquareQuote className="w-2.5 h-2.5" />
                                {item.special_instructions}
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </td>

                  {/* Time */}
                  <td className="py-3.5 px-3 font-mono text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{formatTime(order.created_at)}</span>
                    </div>
                  </td>

                  {/* Status Badge & Workflow Step */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-1.5">
                      <span
                        className={`inline-block uppercase font-mono font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border text-center ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      {/* Quick status progression buttons */}
                      {order.status === 'placed' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'preparing')}
                          className="px-2 py-0.5 rounded-md bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-[10px] font-bold border border-orange-500/40 transition text-center"
                        >
                          ▶ Start Prep
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'ready')}
                          className="px-2 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 transition text-center"
                        >
                          ✓ Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'completed')}
                          className="px-2 py-0.5 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold border border-indigo-500/40 transition text-center"
                        >
                          🍽️ Mark Served
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-3 text-right font-mono font-extrabold text-sm text-amber-400">
                    ₹{order.total_amount}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onOpenBillingModal(order.table_number, order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 active:scale-95 transition"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Bill & Settle</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
