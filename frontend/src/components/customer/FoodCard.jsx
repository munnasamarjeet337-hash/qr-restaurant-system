import React from 'react';
import { Plus, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const FoodCard = ({ item, onOpenModal }) => {
  const { items, addItem } = useCart();

  // Find if this item exists in the cart
  const cartQuantity = items
    .filter((i) => i.item_id === item.id)
    .reduce((sum, i) => sum + i.quantity, 0);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addItem(item, 1, '');
  };

  return (
    <div
      onClick={() => onOpenModal(item)}
      className="group flex flex-col justify-between bg-slate-850/80 bg-slate-900 border border-slate-800/90 rounded-2xl overflow-hidden hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-200 cursor-pointer active:scale-[0.99]"
    >
      {/* Food Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-800">
        <img
          src={item.image_url}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

        {/* Veg / Non-Veg Indicator Badge */}
        <div className="absolute top-2.5 left-2.5">
          <div
            className={`w-5 h-5 rounded bg-slate-950/80 backdrop-blur-md border p-1 flex items-center justify-center ${
              item.is_veg ? 'border-emerald-500' : 'border-rose-500'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                item.is_veg ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </div>
        </div>

        {/* Cart count badge if in cart */}
        {cartQuantity > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 font-extrabold text-xs px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>{cartQuantity} in cart</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
            {item.name}
          </h3>
          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Bottom Bar: Price & Action */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[11px] font-semibold text-amber-400">₹</span>
            <span className="text-base font-extrabold text-white">{item.price}</span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 active:scale-95 transition-all"
            title="Quick add to cart"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
