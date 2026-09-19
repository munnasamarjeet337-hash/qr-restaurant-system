import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  UploadCloud,
  FileCheck,
  TrendingUp,
  Briefcase,
  Layers,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Target,
  BarChart3,
  Award,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Badge from '../components/common/Badge';

const LandingPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload Your Resume',
      desc: 'Drag and drop your PDF or DOCX file. Our engine extracts text, contact info, and structural sections in milliseconds.',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: 'Deep AI Parsing',
      desc: 'Advanced NLP entity matchers extract 200+ technical, soft, tool, and domain competencies with semantic accuracy.',
      icon: Zap,
    },
    {
      num: '03',
      title: 'TF-IDF Job Matching',
      desc: 'Cosine similarity engines calculate your exact match percentage against 20+ live tech job profiles and detect missing skills.',
      icon: Briefcase,
    },
    {
      num: '04',
      title: 'Score & Actionable Edits',
      desc: 'Receive an explainable 4-part score and prioritized suggestions to bridge skill gaps and maximize interview callbacks.',
      icon: TrendingUp,
    },
  ];

  const features = [
    {
      title: '4-Part Explainable Scoring',
      desc: 'Calculated using a transparent mathematical formula: 40% Skill Match, 30% Experience, 20% ATS Formatting, 10% Keywords.',
      icon: Award,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      title: 'Skill Gap Radar Matrix',
      desc: 'Visualize your coverage across Technical, Soft Skills, Tools, and Domain Knowledge on interactive radar charts.',
      icon: Target,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'TF-IDF Semantic Matching',
      desc: 'Vectorized cosine similarity ranks matching job roles, highlighting your overlapping strengths and missing keywords.',
      icon: Briefcase,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'ATS Parseability Verification',
      desc: 'Detect unparseable tables, contact omissions, non-standard section headers, and file formatting red flags before applying.',
      icon: FileCheck,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Prioritized Impact Roadmap',
      desc: 'Get high, medium, and low impact recommendations with estimated score gains and concrete phrasing suggestions.',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Historical Progress Tracking',
      desc: 'Track how your resume score evolves across iterations over time with interactive trend visualization.',
      icon: BarChart3,
      color: 'from-rose-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden gradient-bg-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Next-Generation AI Resume Intelligence Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]"
            >
              Know exactly where your resume stands{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                before recruiters do.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
            >
              Instant ATS formatting checks, deep NLP skill extraction, and TF-IDF job recommendation scoring with an explainable 4-part formula.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/upload"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all duration-200 active:scale-98 group"
              >
                <UploadCloud className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Upload Resume & Analyze Free</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-all duration-200"
              >
                Create Account
              </Link>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free instant scan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card needed
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Private & Encrypted
              </span>
            </div>
          </div>

          {/* Hero Mockup Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-14 max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent border border-indigo-500/20 shadow-2xl"
          >
            <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <Badge variant="emerald" size="sm">Overall ATS Score: 86/100</Badge>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      Alex Morgan — Senior Full-Stack Engineer
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Matched with 8 Job Profiles • 18 Detected Skills • 4 Actionable Improvements
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-medium">Top Recommended Role</span>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Senior Full-Stack Engineer</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 text-sm font-black border border-emerald-200 dark:border-emerald-800">
                    92% Match
                  </div>
                </div>
              </div>

              {/* Mini Interactive Preview Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Skill Match (40%)</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">88/100</span>
                    <span className="text-xs font-medium text-emerald-500">+35.2 pts</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[88%] rounded-full"></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Experience (30%)</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400">84/100</span>
                    <span className="text-xs font-medium text-emerald-500">+25.2 pts</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-500 h-full w-[84%] rounded-full"></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ATS Format (20%)</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">90/100</span>
                    <span className="text-xs font-medium text-emerald-500">+18.0 pts</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[90%] rounded-full"></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Keywords (10%)</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400">76/100</span>
                    <span className="text-xs font-medium text-emerald-500">+7.6 pts</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-500 h-full w-[76%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof & Metrics Strip */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">10,000+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Resumes Analyzed</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">98.4%</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">ATS Parse Accuracy</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">200+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Skills Recognized</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">3.2x</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Interview Rate Boost</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              How ResumeIQ Works
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3">
              Go from an unoptimized document to an interview-ready application in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <span className="text-3xl font-black text-slate-200 dark:text-slate-800 group-hover:text-indigo-500/20 transition-colors">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 my-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 lg:py-28 bg-slate-100/60 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Powerful Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Everything you need to beat the ATS
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3">
              Built on modern NLP pipelines, spaCy entity matchers, and scikit-learn recommendation models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-md mb-5 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-8 sm:p-12 text-center text-white shadow-2xl shadow-indigo-600/30">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Ready to optimize your resume for your dream job?
              </h2>
              <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                Join thousands of software engineers, data scientists, and product leaders who use ResumeIQ to supercharge their job hunt.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/upload"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-indigo-900 bg-white hover:bg-slate-100 shadow-lg transition-transform active:scale-95"
                >
                  <UploadCloud className="w-5 h-5 text-indigo-600" />
                  <span>Analyze Your Resume Now</span>
                </Link>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white border border-indigo-300 hover:bg-white/10 transition-colors"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
