import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { HomeHub } from './pages/HomeHub';
import { CustomerMenu } from './pages/CustomerMenu';
import { ReceptionistDashboard } from './pages/ReceptionistDashboard';
import { QrGenerator } from './pages/QrGenerator';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';

export function App() {
  return (
    <SocketProvider>
      <CartProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
          {/* Top Navigation Bar (auto-hides during printing) */}
          <div className="no-print">
            <Navbar />
          </div>

          {/* Route views */}
          <div className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<HomeHub />} />
              <Route path="/menu" element={<CustomerMenu />} />
              <Route path="/reception" element={<ReceptionistDashboard />} />
              <Route path="/admin/qr" element={<QrGenerator />} />
              <Route path="/qr" element={<QrGenerator />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </CartProvider>
    </SocketProvider>
  );
}

export default App;
