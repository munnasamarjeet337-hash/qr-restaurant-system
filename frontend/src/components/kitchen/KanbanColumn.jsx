import React from 'react';
import { OrderCard } from './OrderCard';

export const KanbanColumn = ({
  title,
  subtitle,
  icon: Icon,
  orders = [],
  colorScheme = 'amber',
  onStatusChange,
  newOrderIds = new Set()
}) => {
  const getHeaderStyles = () => {
    switch (colorScheme) {
      case 'amber':
        return {
          border: 'border-amber-500/40',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          iconBg: 'bg-amber-500/20 text-amber-400'
        };
      case 'orange':
        return {
          border: 'border-orange-500/40',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          iconBg: 'bg-orange-500/20 text-orange-400'
        };
      case 'emerald':
        return {
          border: 'border-emerald-500/40',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          iconBg: 'bg-emerald-500/20 text-emerald-400'
        };
      default:
        return {
          border: 'border-slate-700',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          iconBg: 'bg-slate-800 text-slate-400'
        };
    }
  };

  const styles = getHeaderStyles();

  return (
    <div className="flex flex-col bg-slate-950/60 border border-slate-800 rounded-3xl p-4 flex-1 min-w-[320px] max-w-full">
      {/* Column Header */}
      <div className={`flex items-center justify-between pb-3 mb-3 border-b ${styles.border}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl ${styles.iconBg} flex items-center justify-center font-bold`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-white">
              {title}
            </h2>
            <p className="text-[11px] text-slate-400">{subtitle}</p>
          </div>
        </div>

        {/* Count badge */}
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold border ${styles.badge}`}>
          {orders.length}
        </span>
      </div>

      {/* Column Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 no-scrollbar min-h-[400px]">
        {orders.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-2xl p-6 text-center">
            <Icon className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-xs font-semibold">No active orders</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Tickets will appear here in real-time</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              isNew={newOrderIds.has(order.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
