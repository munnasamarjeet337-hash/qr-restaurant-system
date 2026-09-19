import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Receipt, QrCode, Wifi, WifiOff, Smartphone } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

export const Navbar = () => {
  const location = useLocation();
  const { isConnected } = useSocket();

  const navLinks = [
    { path: '/', label: 'Overview', icon: UtensilsCrossed },
    { path: '/menu', label: 'Customer Menu', icon: Smartphone, badge: 'Universal QR' },
    { path: '/reception', label: 'Reception & Billing', icon: Receipt, badge: 'Live Floor' },
    { path: '/admin/qr', label: 'Print QR Stand', icon: QrCode }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform font-bold">
              <UtensilsCrossed className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                The Royal Pavilion<span className="text-amber-400">QR</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block -mt-1">
                Customer & Reception POS
              </span>
            </div>
          </Link>

          {/* Nav items */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path.split('?')[0];
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-slate-950/20 text-slate-950 font-bold'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Status badge & Quick Actions */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
                isConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
              title={isConnected ? 'Socket.io Connected' : 'Socket.io Disconnected'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="hidden sm:inline flex items-center gap-1">
                {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isConnected ? 'Realtime Sync' : 'Offline'}
              </span>
            </div>

            {/* Quick switcher on mobile */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                to="/menu"
                className="p-2 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700 transition"
                title="Customer Menu"
              >
                <Smartphone className="w-4 h-4" />
              </Link>
              <Link
                to="/reception"
                className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                title="Reception Dashboard"
              >
                <Receipt className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
