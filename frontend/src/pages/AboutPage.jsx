import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, ShieldCheck, Award, ArrowRight, Code2, Database, Layers } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Badge from '../components/common/Badge';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="indigo" size="sm">Our Mission & Technology</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Democratizing ATS Intelligence for Job Seekers
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            ResumeIQ was built to level the playing field between applicant tracking algorithms and ambitious professionals.
          </p>
        </div>

        {/* AI & NLP Methodology Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                How Our AI Parsing & Recommendation Engine Works
              </h2>
              <p className="text-xs text-slate-500">Transparent algorithms with zero black-box mystery</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <Code2 className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">spaCy Entity Matcher</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Extracts over 200+ industry-standard skill taxonomies categorized into Technical, Tools, Soft Skills, and Domain Architecture.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <Database className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">TF-IDF Vectorization</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Constructs high-dimensional n-gram term frequency matrices to match candidate profiles against market job descriptions using cosine similarity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <Award className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">4-Part Scoring Formula</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                A mathematical weighted equation: Skill Match (40%), Experience Depth (30%), ATS Formatting (20%), and Keyword Density (10%).
              </p>
            </div>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="p-8 rounded-3xl bg-indigo-600 text-white text-center space-y-4 shadow-xl shadow-indigo-600/20">
          <h3 className="text-2xl font-black">Ready to test your resume?</h3>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-md mx-auto">
            Scan your document in under 30 seconds and receive instant, explainable feedback.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-950 font-bold text-xs sm:text-sm shadow-md hover:bg-slate-100 transition-colors"
          >
            <span>Scan Resume Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
