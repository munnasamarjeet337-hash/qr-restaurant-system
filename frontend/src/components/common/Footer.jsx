import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin, Mail, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080C14] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Resume<span className="text-indigo-600 dark:text-indigo-400">IQ</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Enterprise-grade AI resume analytics, TF-IDF semantic job matching, and real-time skill gap intelligence. Transform your resume into an interview magnet.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All NLP Models Operational</span>
              </div>
            </div>
          </div>

          {/* Col 1: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/upload" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Resume Scanner
                </Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Skill Gap Radar
                </Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  TF-IDF Job Matcher
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  ATS Optimizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About ResumeIQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy#security" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  Data Security
                </Link>
              </li>
              <li>
                <Link to="/privacy#terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} ResumeIQ Inc. All rights reserved. Capstone SaaS Edition.
          </p>
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
