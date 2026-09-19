import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, FileCheck } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Badge from '../components/common/Badge';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="space-y-3">
          <Badge variant="emerald" size="sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Enterprise Security & Data Protection</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Privacy Policy & Resume Security
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: August 2026 • Effective for all ResumeIQ SaaS users
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500" />
              1. Document Privacy & Retention Policy
            </h2>
            <p>
              When you upload a resume to ResumeIQ, the file is parsed in-memory and encrypted at rest. We never sell, monetize, or train third-party public models on your personal resume text or contact details.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-indigo-500" />
              2. Information We Extract
            </h2>
            <p>
              Our NLP pipeline extracts skills, years of experience, educational degrees, and ATS layout markers solely to calculate your score breakdown and recommend relevant job roles.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-500" />
              3. Right to Delete Your Data
            </h2>
            <p>
              You maintain complete ownership of your data. You can delete any individual resume scan or your entire account at any time directly from the History page or by contacting support.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
