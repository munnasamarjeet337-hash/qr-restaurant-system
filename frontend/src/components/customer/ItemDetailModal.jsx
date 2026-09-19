import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, MessageSquareQuote, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ItemDetailModal = ({ item, isOpen, onClose }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setInstructions('');
      setAddedAnimation(false);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    addItem(item, quantity, instructions);
    setAddedAnimation(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const itemTotal = item.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header Image with close button */}
        <div className="relative aspect-[16/9] w-full bg-slate-800 shrink-0">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Veg / Non-veg tag */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                item.is_veg
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
              }`}
            >
              {item.is_veg ? '• Pure Veg' : '• Non-Veg'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white">{item.name}</h2>
              <div className="text-amber-400 font-extrabold text-lg sm:text-xl shrink-0">
                ₹{item.price}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Special Instructions Input */}
          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
              <MessageSquareQuote className="w-4 h-4" />
              Special instructions (e.g. Less spicy, no onion)
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Extra crisp, make it medium spicy, sauce on side..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              The kitchen team receives this instruction highlighted on their display.
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Quantity
            </span>
            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl p-1">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg bg-slate-700/60 hover:bg-slate-700 disabled:opacity-40 text-white flex items-center justify-center transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-bold text-sm text-white">{quantity}</span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold transition"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer / Add Button */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 mt-auto">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm flex items-center justify-between shadow-xl transition-all ${
              addedAnimation
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {addedAnimation ? (
              <span className="w-full flex items-center justify-center gap-2">
                <Check className="w-5 h-5 stroke-[3]" /> Added to Cart!
              </span>
            ) : (
              <>
                <span>Add to Cart ({quantity})</span>
                <span className="font-mono text-base">₹{itemTotal}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
