import React from 'react';

export const CategoryChips = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="sticky top-16 z-30 w-full bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800/80 py-2.5 px-4">
      <div className="max-w-2xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {/* 'All' chip */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
            selectedCategory === null
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
          }`}
        >
          All Items
        </button>

        {/* Category specific chips */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
