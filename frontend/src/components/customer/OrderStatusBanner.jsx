import React from 'react';
import { ChefHat, Flame, BellRing, CheckCircle2, Clock, Receipt, Sparkles } from 'lucide-react';

export const OrderStatusBanner = ({
  activeOrders = [],
  onRequestBill,
  isRequestingBill,
  tableStatus
}) => {
  if (!activeOrders || activeOrders.length === 0) return null;

  // Latest active order
  const latestOrder = activeOrders[0];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'placed':
        return {
          label: 'Order Sent to Kitchen',
          desc: 'Chef received your order and is reviewing preparation steps.',
          color: 'from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-300',
          badgeBg: 'bg-amber-500 text-slate-950',
          icon: Clock,
          pulse: true,
          step: 1
        };
      case 'preparing':
        return {
          label: 'Preparing in Kitchen',
          desc: 'Your dishes are actively being cooked on the stove & tandoor.',
          color: 'from-orange-500/20 to-orange-600/10 border-orange-500/40 text-orange-300',
          badgeBg: 'bg-orange-500 text-white',
          icon: Flame,
          pulse: true,
          step: 2
        };
      case 'ready':
        return {
          label: 'Dishes are Ready!',
          desc: 'Hot & fresh food is on its way to your table right now.',
          color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-300',
          badgeBg: 'bg-emerald-500 text-slate-950',
          icon: BellRing,
          pulse: true,
          step: 3
        };
      case 'completed':
        return {
          label: 'Served to Table',
          desc: 'Enjoy your delicious meal! Let us know if you need anything else.',
          color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/40 text-indigo-300',
          badgeBg: 'bg-indigo-500 text-white',
          icon: CheckCircle2,
          pulse: false,
          step: 4
        };
      default:
        return {
          label: 'Order Placed',
          desc: 'Your order is recorded.',
          color: 'from-slate-800 to-slate-900 border-slate-700 text-slate-200',
          badgeBg: 'bg-slate-700 text-white',
          icon: Clock,
          pulse: false,
          step: 1
        };
    }
  };

  const config = getStatusConfig(latestOrder.status);
  const StatusIcon = config.icon;

  const isBillPending = tableStatus === 'billing_pending';

  return (
    <div className="max-w-2xl mx-auto px-4 mb-4">
      <div
        className={`bg-gradient-to-r ${config.color} border rounded-2xl p-4 shadow-lg backdrop-blur-md relative overflow-hidden transition-all duration-300`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${config.badgeBg} flex items-center justify-center shrink-0 shadow-md ${
                config.pulse ? 'animate-bounce' : ''
              }`}
            >
              <StatusIcon className="w-5 h-5 font-bold" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-white text-sm sm:text-base">
                  {config.label}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/60 border border-white/10 text-slate-300">
                  ID: #{latestOrder.id.slice(-6)}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {config.desc}
              </p>
            </div>
          </div>

          {/* Request Bill Button */}
          <button
            onClick={onRequestBill}
            disabled={isRequestingBill || isBillPending}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              isBillPending
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 hover:border-amber-400'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{isBillPending ? 'Bill Requested' : 'Request Bill'}</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-white/10">
          {['Placed', 'Cooking', 'Ready', 'Served'].map((label, index) => {
            const stepNum = index + 1;
            const isCompleted = config.step >= stepNum;
            const isCurrent = config.step === stepNum;
            return (
              <div key={label} className="flex flex-col gap-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    isCompleted
                      ? isCurrent
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-emerald-400'
                      : 'bg-slate-800'
                  }`}
                />
                <span
                  className={`text-[9px] font-bold text-center ${
                    isCompleted ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
