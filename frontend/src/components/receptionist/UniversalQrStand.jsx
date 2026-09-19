import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Printer, Download, ExternalLink, UtensilsCrossed, Smartphone, Check } from 'lucide-react';

export const UniversalQrStand = () => {
  const [qrUrl, setQrUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate QR code for universal menu entry: http://<LAN_IP_or_domain>:5173/menu
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    const target = `${origin}/menu`;
    setQrUrl(target);

    QRCode.toDataURL(target, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR error:', err));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'royal-pavilion-universal-qr.png';
    link.href = qrDataUrl;
    link.click();
  };

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col items-center text-center">
      <div className="flex items-center justify-between w-full pb-3 border-b border-slate-800 no-print">
        <div className="flex items-center gap-2 text-left">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">Single Universal QR Code</h3>
            <p className="text-[11px] text-slate-400">1 QR for all tables in restaurant</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Stand</span>
        </button>
      </div>

      {/* Printable Stand Preview Card */}
      <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-5 shadow-lg w-full max-w-xs my-4 flex flex-col items-center print:border-2 print:border-black">
        <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center mb-1.5 shadow-sm">
          <UtensilsCrossed className="w-4 h-4 font-bold" />
        </div>
        <h4 className="font-black text-sm uppercase tracking-tight text-slate-900">
          The Royal Pavilion
        </h4>
        <p className="text-[11px] font-bold text-slate-600">Scan & Select Your Table</p>

        {/* QR image */}
        <div className="p-2 bg-slate-50 border border-slate-200 rounded-2xl my-3 shadow-inner">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Universal Restaurant QR Code"
              className="w-40 h-40 object-contain mx-auto"
            />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center text-slate-400">
              Generating...
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Scan with any Phone Camera</span>
        </div>
      </div>

      {/* Action links */}
      <div className="flex items-center gap-2 w-full no-print">
        <button
          onClick={handleDownload}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PNG</span>
        </button>

        <button
          onClick={handleCopy}
          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition"
          title="Copy Link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
