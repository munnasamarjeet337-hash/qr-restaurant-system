import React, { useState } from 'react';
import { X, Printer, CheckCircle2, Receipt, Sparkles, CreditCard, Banknote, ShieldCheck } from 'lucide-react';

export const BillingModal = ({
  isOpen,
  onClose,
  tableNumber,
  orders = [],
  onSettleBill,
  isSettling
}) => {
  const [includeServiceCharge, setIncludeServiceCharge] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, cash, upi

  if (!isOpen) return null;

  // Flatten all items across all active orders for this table
  const allItems = [];
  let subtotal = 0;

  orders.forEach((order) => {
    if (order.items) {
      order.items.forEach((item) => {
        const itemSubtotal = item.unit_price * item.quantity;
        subtotal += itemSubtotal;
        allItems.push({
          ...item,
          order_id: order.id,
          customer_name: order.customer_name
        });
      });
    }
  });

  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const serviceCharge = includeServiceCharge ? Math.round(subtotal * 0.10 * 100) / 100 : 0;
  const grandTotal = Math.round((subtotal + tax + serviceCharge) * 100) / 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">
                Table #{tableNumber} Billing Summary
              </h2>
              <p className="text-xs text-slate-400">
                {orders.length} order ticket(s) • Cashier POS Punch Helper
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable/Readable Receipt Surface */}
        <div className="p-6 overflow-y-auto space-y-4 bg-slate-900/90 print:bg-white print:text-black">
          {/* Receipt Branding Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-800 print:border-black">
            <h3 className="text-lg font-black text-white print:text-black tracking-tight">
              THE ROYAL PAVILION
            </h3>
            <p className="text-xs text-slate-400 print:text-black">
              Table #{tableNumber} • Guest Dining Receipt
            </p>
            <p className="text-[11px] font-mono text-slate-500 print:text-black mt-1">
              Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </p>
          </div>

          {/* Items Breakdown */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-black flex justify-between pb-1 border-b border-slate-800 print:border-black">
              <span>Item & Qty</span>
              <span>Amount</span>
            </div>

            {allItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1 text-slate-200 print:text-black"
              >
                <div>
                  <span className="font-bold text-amber-400 print:text-black mr-2">
                    {item.quantity}x
                  </span>
                  <span>{item.item_name}</span>
                  {item.special_instructions && (
                    <span className="block text-[10px] text-amber-300/80 italic">
                      Note: {item.special_instructions}
                    </span>
                  )}
                </div>
                <div className="font-mono font-bold text-white print:text-black">
                  ₹{item.unit_price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* POS Numeric Punch Assistant (Big high-visibility values for cashiers) */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 print:border print:border-black print:bg-slate-50">
            <div className="flex justify-between text-xs text-slate-400 print:text-black">
              <span>Items Subtotal</span>
              <span className="font-mono font-bold text-white print:text-black">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400 print:text-black">
              <span>GST / Tax (5%)</span>
              <span className="font-mono font-bold text-white print:text-black">₹{tax}</span>
            </div>

            {/* Service Charge Toggle */}
            <div className="flex items-center justify-between text-xs pt-1 no-print">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeServiceCharge}
                  onChange={(e) => setIncludeServiceCharge(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span>Add 10% Service Charge</span>
              </label>
              <span className="font-mono font-bold text-white">₹{serviceCharge}</span>
            </div>

            {/* GRAND TOTAL CALLOUT */}
            <div className="pt-3 border-t border-slate-800 print:border-black flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400 print:text-black block">
                  Amount to Punch
                </span>
                <span className="text-[10px] text-slate-500 print:text-black">Net Payable Amount</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 print:text-black">
                ₹{grandTotal}
              </div>
            </div>
          </div>

          {/* Payment Method Selector (no-print) */}
          <div className="space-y-2 no-print">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Payment Tender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                { id: 'upi', label: 'UPI / QR', icon: Sparkles },
                { id: 'cash', label: 'Cash Payment', icon: Banknote }
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md'
                        : 'bg-slate-850 bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Footer (no-print) */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSettling}
            onClick={() => onSettleBill(tableNumber)}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-[0.99] transition"
          >
            {isSettling ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Settling Table #{tableNumber}...
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                <span>Settle & Clear Table #{tableNumber} (₹{grandTotal})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
