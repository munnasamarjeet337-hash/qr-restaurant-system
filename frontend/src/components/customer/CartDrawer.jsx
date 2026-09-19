import React, { useState } from 'react';
import { ShoppingBag, ChevronUp, X, Plus, Minus, Trash2, ArrowRight, MessageSquareQuote, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = ({ onSubmitOrder, isSubmitting, tableNumber }) => {
  const {
    items,
    totalItemsCount,
    subtotal,
    tax,
    grandTotal,
    updateQuantity,
    removeItem,
    clearCart,
    customerName
  } = useCart();

  const [isOpen, setIsOpen] = useState(false);

  if (totalItemsCount === 0) return null;

  const handleSubmit = async () => {
    await onSubmitOrder();
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 p-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 p-3.5 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center justify-between font-bold active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-extrabold text-xs">
                {totalItemsCount}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-900/80">Your Table Cart</div>
                <div className="text-sm font-extrabold text-slate-950">
                  ₹{grandTotal} <span className="text-[10px] font-normal text-slate-900/70">(incl. 5% tax)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-extrabold bg-slate-950/10 px-3 py-1.5 rounded-xl group-hover:bg-slate-950/20 transition">
              <span>Review Order</span>
              <ChevronUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Slide-Up Review Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slideUp">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Your Cart Review</h3>
                  <p className="text-[11px] text-slate-400">
                    Seated at <span className="text-amber-400 font-bold">Table #{tableNumber}</span> ({customerName || 'Guest'})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearCart}
                  className="p-2 text-xs text-rose-400 hover:text-rose-300 transition"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {items.map((cartItem) => (
                <div
                  key={cartItem.cart_id}
                  className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-3 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            cartItem.is_veg ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}
                        />
                        <span className="font-bold text-sm text-white">
                          {cartItem.item_name}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        ₹{cartItem.unit_price} each
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-750 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(cartItem.cart_id, cartItem.quantity - 1)}
                        className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-white">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(cartItem.cart_id, cartItem.quantity + 1)}
                        className="w-6 h-6 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center transition"
                      >
                        <Plus className="w-3 h-3 stroke-[3]" />
                      </button>
                    </div>

                    <div className="text-sm font-extrabold text-amber-300 font-mono text-right min-w-[50px]">
                      ₹{cartItem.unit_price * cartItem.quantity}
                    </div>
                  </div>

                  {/* Special Instruction Badge */}
                  {cartItem.special_instructions && (
                    <div className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <MessageSquareQuote className="w-3.5 h-3.5 shrink-0" />
                      <span className="italic">"{cartItem.special_instructions}"</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bill Breakdown & Submit */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-mono">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-mono">₹{tax}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-1.5 border-t border-slate-800">
                  <span>Grand Total</span>
                  <span className="font-mono text-amber-400 text-base">₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Sending to Kitchen...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Place Order • ₹{grandTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
