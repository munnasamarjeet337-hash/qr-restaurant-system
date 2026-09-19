import React, { useState } from 'react';
import { User, Sparkles, ArrowRight } from 'lucide-react';

export const NameModal = ({ isOpen, tableNumber, initialName = '', onSubmit }) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to proceed');
      return;
    }
    setError('');
    onSubmit(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Welcome to The Royal Pavilion</h2>
          <p className="text-xs text-slate-400 mt-1">
            You are seated at <span className="text-amber-400 font-bold">Table #{tableNumber || '1'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              What's your name?
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>
            {error && <p className="text-xs text-rose-400 mt-1.5 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all"
          >
            <span>Explore Menu & Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-slate-500">
            Your name helps the kitchen and serving team identify your table's order.
          </p>
        </form>
      </div>
    </div>
  );
};
