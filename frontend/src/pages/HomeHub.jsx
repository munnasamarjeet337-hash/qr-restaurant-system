import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Receipt, QrCode, ArrowRight, Sparkles, Wifi, Smartphone, CheckCircle2 } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { apiClient } from '../api/apiClient';

export const HomeHub = () => {
  const { isConnected } = useSocket();
  const [selectedTable, setSelectedTable] = useState(3);
  const [backendHealthy, setBackendHealthy] = useState(null);

  useEffect(() => {
    apiClient
      .get('/health')
      .then(() => setBackendHealthy(true))
      .catch(() => setBackendHealthy(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full-Stack QR Restaurant Ordering & Receptionist System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            1 Universal QR Code to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Customer Mobile & Reception POS</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Scan the single restaurant QR code on your phone to select your table and order in real time. The receptionist dashboard tracks live orders, table occupancy, and billing.
          </p>

          {/* System Status Indicators */}
          <div className="flex items-center justify-center gap-4 pt-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendHealthy ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-300">
                Backend API: {backendHealthy ? 'Online' : 'Connecting...'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="text-slate-300">
                Socket.io: {isConnected ? 'Synchronized' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

        {/* 2 Main Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">
          {/* 1. Customer Mobile View */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg font-bold group-hover:scale-105 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                  Customer View
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">
                Customer Mobile Web App
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Single Universal QR onboarding with Table selector (1 to 20), food menu browsing with images, special instructions note box ("Less spicy"), cart review, and live order status tracker.
              </p>

              {/* Table Picker for quick browser demo */}
              <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  Quick Demo Table:
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 5, 12].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedTable(num)}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition ${
                        selectedTable === num
                          ? 'bg-amber-400 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <Link
                to={`/menu?table=${selectedTable}`}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all duration-200"
              >
                <span>Launch Customer Menu (Table #{selectedTable})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 2. Receptionist Dashboard */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 text-slate-950 flex items-center justify-center shadow-lg font-bold group-hover:scale-105 transition-transform">
                  <Receipt className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-800 text-blue-300 border border-slate-700">
                  Manager & POS
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-blue-300 transition-colors">
                Receptionist & Billing Dashboard
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Live 20-table occupancy grid (Vacant/Occupied/Bill Req), incoming orders register with special notes, preparation status toggles, printable POS bill punch modal, and 1 Universal QR stand.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <Link
                to="/reception"
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-blue-500 hover:text-slate-950 text-white font-black text-xs flex items-center justify-center gap-2 transition-all duration-200 group-hover:shadow-lg shadow-sm"
              >
                <span>Launch Receptionist Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-850 bg-slate-950 text-center text-xs text-slate-500 font-mono">
        <p>GourmetQR System • 2-Part Architecture (Customer & Receptionist with 1 Universal QR)</p>
      </footer>
    </div>
  );
};
