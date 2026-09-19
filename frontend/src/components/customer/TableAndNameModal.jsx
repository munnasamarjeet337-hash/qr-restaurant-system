import React, { useState, useEffect } from 'react';
import { User, MapPin, Sparkles, ArrowRight, Check } from 'lucide-react';

export const TableAndNameModal = ({
  isOpen,
  initialTable = 1,
  initialName = '',
  onSubmit
}) => {
  const [selectedTable, setSelectedTable] = useState(initialTable || 1);
  const [name, setName] = useState(initialName || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTable) setSelectedTable(initialTable);
    if (initialName) setName(initialName);
  }, [initialTable, initialName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTable || selectedTable < 1) {
      setError('Please choose your table number');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name to proceed');
      return;
    }
    setError('');
    onSubmit({
      tableNumber: parseInt(selectedTable, 10),
      customerName: name.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl p-6 relative overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-5 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center mx-auto mb-2.5 shadow-lg shadow-amber-500/20 font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Welcome to The Royal Pavilion
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Universal QR Scan • Please select your table & enter your name
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
          {/* 1. Table Number Selection Grid */}
          <div>
            <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Select Your Table Number
              </span>
              <span className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded-md text-[11px]">
                Table #{selectedTable}
              </span>
            </label>

            {/* Quick 20 Table Buttons */}
            <div className="grid grid-cols-5 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-950/60 rounded-2xl border border-slate-800">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
                const isChosen = selectedTable === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setSelectedTable(num);
                      if (error) setError('');
                    }}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center ${
                      isChosen
                        ? 'bg-amber-400 text-slate-950 shadow-md scale-105 z-10'
                        : 'bg-slate-850 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    T{num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Customer Name Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
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

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all"
            >
              <span>Explore Menu as Table #{selectedTable}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-500">
            You can change your table number anytime by tapping the top Table badge.
          </p>
        </form>
      </div>
    </div>
  );
};
