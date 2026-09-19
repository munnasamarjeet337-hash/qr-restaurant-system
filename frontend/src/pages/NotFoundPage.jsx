import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 text-center">
        <div className="max-w-md w-full space-y-6">
          <span className="text-6xl font-black text-indigo-600 dark:text-indigo-400">404</span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
          <p className="text-xs text-slate-500">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
