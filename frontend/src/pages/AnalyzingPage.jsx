import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Zap,
  Briefcase,
  Award,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { uploadResume } from '../api/resume';
import Navbar from '../components/common/Navbar';

const AnalyzingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const file = location.state?.file;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const steps = [
    {
      title: 'Extracting text and section layout',
      description: 'Parsing raw document layers, headers, contact info, and education credentials.',
      icon: FileText,
    },
    {
      title: 'Detecting skills and entity taxonomies',
      description: 'Running spaCy matcher across Technical, Soft, Tool, and Domain skill dictionaries.',
      icon: Zap,
    },
    {
      title: 'Vectorizing TF-IDF and matching jobs',
      description: 'Computing cosine similarity against 20+ curated software, data, and engineering roles.',
      icon: Briefcase,
    },
    {
      title: 'Generating explainable 4-part scoring & suggestions',
      description: 'Applying weighted scoring formula (40/30/20/10) and ranking prioritized improvements.',
      icon: Award,
    },
  ];

  // Initiate real backend upload
  useEffect(() => {
    if (!file) {
      navigate('/upload');
      return;
    }

    let isMounted = true;

    const performAnalysis = async () => {
      try {
        const res = await uploadResume(file);
        if (isMounted) {
          setAnalysisResult(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMsg(err.response?.data?.error || 'Failed to analyze resume. Please try uploading again.');
        }
      }
    };

    performAnalysis();

    return () => {
      isMounted = false;
    };
  }, [file, navigate]);

  // Advance visual steps realistically
  useEffect(() => {
    if (errorMsg) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [errorMsg, steps.length]);

  // When backend analysis finishes and visual steps reach the end, navigate to results
  useEffect(() => {
    if (analysisResult && currentStepIndex >= steps.length - 1) {
      const timer = setTimeout(() => {
        navigate(`/results/${analysisResult.id}/score`, { replace: true });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [analysisResult, currentStepIndex, navigate, steps.length]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg space-y-8 p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-md shadow-indigo-500/10">
                <Sparkles className="w-8 h-8 animate-spin-slow" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-sm animate-pulse-subtle"></div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Analyzing your resume...
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Document: <span className="font-semibold text-slate-800 dark:text-slate-200">{file?.name || 'Resume'}</span>
            </p>
          </div>

          {/* Error State */}
          {errorMsg ? (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 space-y-3 text-center">
              <div className="flex items-center justify-center text-rose-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">{errorMsg}</p>
              <button
                onClick={() => navigate('/upload')}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
              >
                Back to Upload
              </button>
            </div>
          ) : (
            /* Multi-step progress list */
            <div className="space-y-4 pt-2">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStepIndex || (idx === currentStepIndex && analysisResult);
                const isCurrent = idx === currentStepIndex && !analysisResult;

                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                      isCompleted
                        ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : isCurrent
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                        : 'border-slate-100 dark:border-slate-800/60 opacity-40 bg-slate-50/50 dark:bg-slate-900/50'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className="mt-0.5 flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-7 h-7 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin flex items-center justify-center"></div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-xs font-bold ${
                          isCompleted
                            ? 'text-emerald-900 dark:text-emerald-300'
                            : isCurrent
                            ? 'text-indigo-900 dark:text-indigo-200'
                            : 'text-slate-500'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Progress bar footer */}
              <div className="pt-4">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    initial={{ width: '10%' }}
                    animate={{
                      width: `${Math.min(100, ((currentStepIndex + 1) / steps.length) * 100)}%`,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AnalyzingPage;
