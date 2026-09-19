import React from 'react';
import { Search, Sparkles, User, MapPin } from 'lucide-react';

export const CustomerHero = ({
  tableNumber,
  customerName,
  onChangeNameClick,
  searchQuery,
  onSearchChange,
  vegOnlyFilter,
  onVegOnlyToggle
}) => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background with moody food photography & atmospheric gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-700"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80')`
        }}
      />
      {/* Vertical gradient overlay fading into #0F172A dark slate */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/90 to-[#0F172A]" />

      {/* Content Container */}
      <div className="relative max-w-2xl mx-auto px-4 pt-6 pb-4">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Table #{tableNumber || '?'}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" /> Fine Dining
            </span>
          </div>

          {/* Customer Name Pill */}
          <button
            onClick={onChangeNameClick}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 text-xs font-medium transition"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[110px]">{customerName || 'Set Name'}</span>
          </button>
        </div>

        {/* Restaurant Title & Tagline */}
        <div className="mb-4 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
            The Royal Pavilion
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal">
            Artisanal Indian Flavors & Continental Delicacies
          </p>
        </div>

        {/* Search Bar & Dietary Filter Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search butter chicken, pasta, dessert..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-800/90 text-white placeholder-slate-400 border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            />
          </div>

          {/* Veg Only Toggle */}
          <button
            onClick={onVegOnlyToggle}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition shrink-0 ${
              vegOnlyFilter
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full border border-emerald-400 flex items-center justify-center">
              <span className={`w-1.5 h-1.5 rounded-full ${vegOnlyFilter ? 'bg-emerald-400' : 'bg-transparent'}`} />
            </span>
            <span>Pure Veg</span>
          </button>
        </div>
      </div>
    </div>
  );
};
