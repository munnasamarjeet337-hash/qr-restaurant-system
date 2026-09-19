import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Printer, Download, UtensilsCrossed, ExternalLink, Sparkles, Smartphone, Check } from 'lucide-react';

export const QrGenerator = () => {
  const defaultOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const [baseUrl, setBaseUrl] = useState(defaultOrigin);
  const [universalQrDataUrl, setUniversalQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate 1 Universal QR Code
  useEffect(() => {
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const universalUrl = `${cleanBase}/menu`;

    QRCode.toDataURL(universalUrl, {
      width: 500,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF'
      }
    })
      .then((url) => setUniversalQrDataUrl(url))
      .catch((err) => console.error('Failed to generate universal QR:', err));
  }, [baseUrl]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!universalQrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'royal-pavilion-universal-table-stand.png';
    link.href = universalQrDataUrl;
    link.click();
  };

  const handleCopyLink = () => {
    const cleanBase = baseUrl.replace(/\/+$/, '');
    navigator.clipboard.writeText(`${cleanBase}/menu`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Header (hidden in print) */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 no-print sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Universal Restaurant QR Stand</h1>
              <p className="text-xs text-slate-400">
                1 Single QR Code for all tables • Customers scan and select their table number
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Table Stand</span>
            </button>
          </div>
        </div>
      </header>

      {/* URL Configuration Bar (no-print) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6 no-print">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Base Application URL (Auto-detected LAN/Wi-Fi or Cloud URL)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="http://192.168.1.10:5173 or https://yourapp.vercel.app"
              className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <ExternalLink className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            QR Target: <span className="font-mono text-amber-400">{baseUrl.replace(/\/+$/, '')}/menu</span>
          </p>
        </div>
      </div>

      {/* Printable Universal Table Stand Card */}
      <main className="max-w-md mx-auto px-4 mt-8">
        <div className="bg-white text-slate-900 border-2 border-slate-200 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-between text-center print:border-4 print:border-black print:shadow-none">
          {/* Header */}
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
              <UtensilsCrossed className="w-6 h-6 font-bold" />
            </div>
            <h2 className="font-black text-2xl tracking-tight text-slate-950 uppercase">
              The Royal Pavilion
            </h2>
            <div className="inline-block bg-slate-950 text-amber-400 font-extrabold text-xs uppercase px-4 py-1 rounded-full font-mono">
              Universal Dining QR
            </div>
          </div>

          {/* High-res QR image */}
          <div className="my-6 p-3 bg-slate-50 border-2 border-slate-200 rounded-3xl shadow-inner">
            {universalQrDataUrl ? (
              <img
                src={universalQrDataUrl}
                alt="Universal Restaurant QR Code"
                className="w-56 h-56 object-contain mx-auto"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                Generating QR...
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="font-black text-base text-slate-900 uppercase tracking-wide">
              Scan with Your Phone Camera
            </h3>
            <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto">
              1. Open camera & scan QR code<br />
              2. Select your Table Number (1 to 20)<br />
              3. Browse menu & place your order!
            </p>
          </div>

          {/* Footer Badge */}
          <div className="mt-6 pt-4 border-t border-slate-200 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700">
            <Smartphone className="w-4 h-4" />
            <span>Fast • Contactless • Realtime Ordering</span>
          </div>
        </div>
      </main>
    </div>
  );
};
