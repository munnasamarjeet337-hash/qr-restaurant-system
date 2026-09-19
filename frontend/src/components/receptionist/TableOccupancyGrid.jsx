import React from 'react';
import { Users, AlertCircle, CheckCircle2, Utensils, Receipt } from 'lucide-react';

export const TableOccupancyGrid = ({
  tables = [],
  selectedTableNumber,
  onSelectTable,
  filterState,
  onFilterChange
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'occupied':
        return {
          bg: 'bg-blue-950/40 border-blue-500/50 hover:border-blue-400 text-blue-200',
          dot: 'bg-blue-400',
          label: 'Active',
          icon: Utensils
        };
      case 'billing_pending':
        return {
          bg: 'bg-amber-950/40 border-amber-500/70 hover:border-amber-400 text-amber-200 animate-pulse',
          dot: 'bg-amber-400',
          label: 'Bill Req',
          icon: Receipt
        };
      case 'vacant':
      default:
        return {
          bg: 'bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-400 text-emerald-200',
          dot: 'bg-emerald-400',
          label: 'Vacant',
          icon: CheckCircle2
        };
    }
  };

  const vacantCount = tables.filter((t) => t.status === 'vacant').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const billingCount = tables.filter((t) => t.status === 'billing_pending').length;

  const filteredTables = tables.filter((t) => {
    if (!filterState || filterState === 'all') return true;
    return t.status === filterState;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
      {/* Header & Stats */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div>
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Floor Plan ({tables.length} Tables)</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Click a table to view live tab & bill</p>
        </div>
      </div>

      {/* Filter Badges */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
            filterState === 'all'
              ? 'bg-slate-700 text-white border-slate-600'
              : 'bg-slate-800/60 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          All ({tables.length})
        </button>
        <button
          onClick={() => onFilterChange('vacant')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
            filterState === 'vacant'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              : 'bg-slate-800/60 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5" />
          Vacant ({vacantCount})
        </button>
        <button
          onClick={() => onFilterChange('occupied')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
            filterState === 'occupied'
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
              : 'bg-slate-800/60 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block mr-1.5" />
          Occupied ({occupiedCount})
        </button>
        <button
          onClick={() => onFilterChange('billing_pending')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
            filterState === 'billing_pending'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
              : 'bg-slate-800/60 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mr-1.5" />
          Bill Req ({billingCount})
        </button>
      </div>

      {/* 20-Table Grid (4 columns x 5 rows) */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-2">
        {filteredTables.map((t) => {
          const config = getStatusBadge(t.status);
          const isSelected = selectedTableNumber === t.table_number;

          return (
            <button
              key={t.id}
              onClick={() => onSelectTable(t.table_number)}
              className={`relative p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                config.bg
              } ${
                isSelected
                  ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-500/10 scale-105 z-10'
                  : 'hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-sm text-white">
                  T{t.table_number}
                </span>
                <span className={`w-2 h-2 rounded-full ${config.dot}`} />
              </div>

              <div className="mt-2">
                {t.current_total > 0 ? (
                  <span className="text-xs font-mono font-extrabold text-amber-300 block truncate">
                    ₹{t.current_total}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 block truncate">
                    {config.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
