import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  Zap,
  Briefcase,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Linkedin,
  GraduationCap,
  Calendar,
  ArrowRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getResume } from '../api/resume';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ResultsTabsNav from '../components/results/ResultsTabsNav';
import CircularProgress from '../components/common/CircularProgress';
import ScoreBreakdownBar from '../components/common/ScoreBreakdownBar';
import Badge from '../components/common/Badge';

const ResultsScorePage = () => {
  const { id } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await getResume(id);
        const data = res.data;
        setResumeData(data);

        // Trigger celebratory confetti if score is high
        const sc = data.score?.overall_score ?? data.overall_score ?? 0;
        if (sc >= 70) {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#4F46E5', '#10B981', '#F59E0B', '#818CF8'],
            });
          } catch (e) {
            // Ignore if canvas not supported
          }
        }
      } catch (err) {
        setErrorMsg('Failed to load resume analysis. It may have been deleted or expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-slate-500">Loading analysis score...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !resumeData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="p-8 max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analysis Not Found</h3>
            <p className="text-xs text-slate-500">{errorMsg || 'Could not find this resume analysis record.'}</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Upload a Resume
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const scoreObj = resumeData.score || {};
  const overallScore = scoreObj.overall_score ?? resumeData.overall_score ?? 0;
  const breakdown = scoreObj.breakdown || resumeData.breakdown || {};
  const topJob = resumeData.matched_jobs?.[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Results Navigation Tabs */}
        <ResultsTabsNav resumeData={resumeData} />

        {/* Hero Score Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Animated Score Ring Card */}
          <div className="lg:col-span-1 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-4 left-4">
              <Badge variant="indigo" size="sm">
                ATS Score Ring
              </Badge>
            </div>

            <div className="my-6">
              <CircularProgress score={overallScore} size={210} strokeWidth={16} />
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {scoreObj.badge || (overallScore >= 70 ? 'Strong Candidate' : overallScore >= 40 ? 'Competitive with Gaps' : 'Needs Improvement')}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
              {overallScore >= 70
                ? 'Your resume demonstrates high alignment with top industry ATS algorithms and technical requirements.'
                : overallScore >= 40
                ? 'Solid core skills detected with key formatting or keyword gaps that can be quickly improved.'
                : 'Significant skill or ATS formatting gaps detected. Follow the tailored recommendations to elevate your score.'}
            </p>
          </div>

          {/* Candidate Profile & Top Match Summary */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Profile Summary
                </span>
                <Badge
                  variant={overallScore >= 70 ? 'emerald' : overallScore >= 40 ? 'amber' : 'rose'}
                  size="sm"
                >
                  {scoreObj.tier || (overallScore >= 70 ? 'High Tier' : 'Moderate Tier')}
                </Badge>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {resumeData.candidate_name || 'Candidate Profile'}
              </h2>

              {/* Contact and Education Pills */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {resumeData.contact_info?.email && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {resumeData.contact_info.email}
                  </span>
                )}
                {resumeData.contact_info?.phone && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {resumeData.contact_info.phone}
                  </span>
                )}
                {resumeData.contact_info?.linkedin && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-xs font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn Verified
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  ~{resumeData.experience_years || 1} {resumeData.experience_years === 1 ? 'Year' : 'Years'} Exp
                </span>
                {resumeData.education?.has_higher_ed && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    {resumeData.education.degrees?.[0] || 'Higher Degree'}
                  </span>
                )}
              </div>
            </div>

            {/* Top Match Highlight Box */}
            {topJob && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-transparent border border-indigo-200/80 dark:border-indigo-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    🏆 Highest Recommended Role
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {topJob.match_percentage}% Match
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {topJob.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {topJob.why_it_matches}
                </p>
                <div className="pt-2">
                  <Link
                    to={`/results/${id}/jobs`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>View all {resumeData.matched_jobs?.length || 0} job recommendations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Explainable 4-Part Scoring Breakdown Component */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Mathematical Score Breakdown
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Transparent weighting formula calculating your ATS & interview readiness.
            </p>
          </div>

          <ScoreBreakdownBar breakdown={breakdown} />
        </div>

        {/* Action Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Link
            to={`/results/${id}/skills`}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 w-fit mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Skill Gap Radar</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Explore your radar chart across Technical, Soft, Tool, and Domain categories with matched vs missing skills.
            </p>
          </Link>

          <Link
            to={`/results/${id}/jobs`}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 w-fit mb-4 group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Job Recommendations</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-purple-600 transition-all" />
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Discover roles matched with TF-IDF cosine similarity and expandable skill overlap explanations.
            </p>
          </Link>

          <Link
            to={`/results/${id}/suggestions`}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 w-fit mb-4 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Tailored Suggestions</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Review prioritized suggestions with estimated score increases to boost your interview callbacks.
            </p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultsScorePage;
