import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Zap,
  FileCheck,
  Briefcase,
  Key,
} from 'lucide-react';
import { getResume } from '../api/resume';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ResultsTabsNav from '../components/results/ResultsTabsNav';
import Badge from '../components/common/Badge';

const ResultsSuggestionsPage = () => {
  const { id } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState('all');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await getResume(id);
        setResumeData(res.data);
      } catch (err) {
        console.error('Failed to load suggestions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const suggestions = resumeData?.suggestions || [];

  const highPriority = suggestions.filter((s) => s.priority === 'high');
  const mediumPriority = suggestions.filter((s) => s.priority === 'medium');
  const lowPriority = suggestions.filter((s) => s.priority === 'low');

  const filteredSuggestions =
    selectedPriority === 'all'
      ? suggestions
      : suggestions.filter((s) => s.priority === selectedPriority);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-slate-500">Generating tailored suggestions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        <ResultsTabsNav resumeData={resumeData} />

        {/* Hero Impact Summary Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="indigo" size="sm" className="bg-white/20 text-white border-white/30">
              💡 Actionable Optimization Roadmap
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Bridge gaps to reach a 90+ ATS score
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              We identified <strong>{suggestions.length} prioritized improvements</strong> across skills, experience quantification, and keyword density that can boost your recruiter callback rates.
            </p>
          </div>

          <Link
            to="/upload"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-950 font-bold text-xs sm:text-sm shadow-md hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            <span>Re-analyze After Edits</span>
          </Link>
        </div>

        {/* Priority Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Filter by Impact:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedPriority('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedPriority === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                All ({suggestions.length})
              </button>
              <button
                onClick={() => setSelectedPriority('high')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedPriority === 'high'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                }`}
              >
                High Impact ({highPriority.length})
              </button>
              <button
                onClick={() => setSelectedPriority('medium')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedPriority === 'medium'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                }`}
              >
                Medium Impact ({mediumPriority.length})
              </button>
              <button
                onClick={() => setSelectedPriority('low')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedPriority === 'low'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                }`}
              >
                Low / Polish ({lowPriority.length})
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-5">
          {filteredSuggestions.map((sug, idx) => {
            const isHigh = sug.priority === 'high';
            const isMed = sug.priority === 'medium';

            const badgeVariant = isHigh ? 'rose' : isMed ? 'amber' : 'slate';
            const impactColor = isHigh
              ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800'
              : isMed
              ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
              : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';

            return (
              <div
                key={sug.id || idx}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-indigo-400/40 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={badgeVariant} size="sm">
                      {sug.priority?.toUpperCase()} PRIORITY
                    </Badge>
                    <span className="text-xs font-semibold text-slate-400">
                      Category: <strong className="text-slate-700 dark:text-slate-300">{sug.category}</strong>
                    </span>
                  </div>

                  <div className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${impactColor}`}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Estimated Impact: {sug.estimated_impact}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {sug.title}
                  </h3>
                  <div className="mt-2 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <p>
                      <strong className="text-slate-900 dark:text-white">What to fix:</strong> {sug.what_to_fix}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      <strong className="text-slate-700 dark:text-slate-300">Why it matters:</strong> {sug.why_it_matters}
                    </p>
                  </div>
                </div>

                {/* Concrete Actionable Steps */}
                {sug.actionable_steps && sug.actionable_steps.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                      Recommended Implementation Steps:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                      {sug.actionable_steps.map((step, sIdx) => (
                        <li key={sIdx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Made updates to your resume document?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Upload your revised resume to instantly see your new score calculation and verify that your improvements registered.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Upload Updated Resume</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultsSuggestionsPage;
