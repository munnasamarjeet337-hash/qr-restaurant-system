import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  UploadCloud,
  FileText,
  TrendingUp,
  Briefcase,
  Award,
  ArrowRight,
  Sparkles,
  History,
  Clock,
  ChevronRight,
  Plus,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BarChart3,
  Cpu,
  RefreshCw,
  Target,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getResumeHistory, uploadResume } from '../api/resume';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Badge from '../components/common/Badge';

// Framer motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 14,
    },
  },
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [quickUploadLoading, setQuickUploadLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');

  const fetchHistory = async () => {
    try {
      const res = await getResumeHistory();
      setHistoryData(res.history || []);
      setTrendData(res.trend || []);
    } catch (err) {
      console.warn('Could not fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const latestResume = historyData[0] || null;
  const totalAnalyzed = historyData.length;
  const topRole = latestResume?.top_matched_role || 'Software Engineer';
  const latestScore = latestResume?.overall_score || 0;

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Quick file drop handler directly on dashboard
  const handleQuickDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processQuickUpload(files[0]);
    }
  };

  const handleQuickFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processQuickUpload(e.target.files[0]);
    }
  };

  const processQuickUpload = async (file) => {
    if (!file) return;
    setQuickUploadLoading(true);
    try {
      const res = await uploadResume(file);
      const resultData = res.data;
      navigate(`/results/${resultData.id}/score`, { state: { analysis: resultData } });
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setQuickUploadLoading(false);
    }
  };

  // Score circular meter calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(latestScore, 100) / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Animated Header Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>ATS Intelligence Console</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Candidate'}! 🚀
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Track your resume scoring progression, explore algorithm-matched job opportunities, and bridge keyword gaps.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/history"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all active:scale-95"
              >
                <History className="w-4 h-4 text-indigo-500" />
                <span>History ({historyData.length})</span>
              </Link>

              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all duration-150 active:scale-95"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Scan New Resume</span>
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats Grid with Interactive Hover Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Latest ATS Composite Score with Animated Circular Ring */}
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
              
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Latest ATS Score
                  </span>
                  <Badge
                    variant={latestScore >= 70 ? 'emerald' : latestScore >= 40 ? 'amber' : 'rose'}
                    size="sm"
                  >
                    {latestResume?.tier || 'Unscored'} Band
                  </Badge>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        {latestResume ? Math.round(latestScore) : '—'}
                      </span>
                      {latestResume && (
                        <span className="text-sm font-bold text-slate-400">/100</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {latestResume ? 'Explainable 4-part index' : 'Upload your first resume'}
                    </p>
                  </div>

                  {/* Mini Animated Circular Gauge */}
                  {latestResume && (
                    <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="7"
                          fill="transparent"
                          className="text-slate-100 dark:text-slate-800"
                        />
                        <motion.circle
                          cx="40"
                          cy="40"
                          r={radius}
                          stroke={latestScore >= 70 ? '#10B981' : latestScore >= 40 ? '#F59E0B' : '#EF4444'}
                          strokeWidth="7"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <Award className="w-6 h-6 absolute text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                {latestResume ? (
                  <Link
                    to={`/results/${latestResume.id}/score`}
                    className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>View score breakdown</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-slate-400">Ready to analyze</span>
                )}
                <span className="text-[11px] text-slate-400 font-medium">
                  {latestResume ? `${Math.round(latestResume.file_size_kb || 35)} KB file` : 'PDF / DOCX'}
                </span>
              </div>
            </motion.div>

            {/* Card 2: Top Matched Target Role */}
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all"></div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Primary Target Match
                  </span>
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                    <Target className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
                    {latestResume ? topRole : 'No Role Matched Yet'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {latestResume
                      ? `TF-IDF match engine calculated high affinity based on your technical competencies and experience.`
                      : 'Upload your resume to discover your highest-probability career roles.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                {latestResume ? (
                  <Link
                    to={`/results/${latestResume.id}/jobs`}
                    className="inline-flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    <span>Browse 20 job matches</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link to="/upload" className="font-bold text-indigo-600 hover:underline">
                    Start scan
                  </Link>
                )}
                <span className="text-[11px] text-slate-400 font-medium">20 Seed Roles</span>
              </div>
            </motion.div>

            {/* Card 3: Extracted Competency Matrix */}
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    NLP Skill Taxonomy
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {latestResume ? (latestResume.skills_count || 34) : '0'}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Verified Skills</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Categorized into Tech, Tools, Domain & Soft skills
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                {latestResume ? (
                  <Link
                    to={`/results/${latestResume.id}/skills`}
                    className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>View skills radar chart</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-slate-400">200+ taxonomy ready</span>
                )}
                <span className="text-[11px] text-emerald-500 font-bold">spaCy Powered</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Workspace: Quick Upload Dropzone + Score Trend Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Quick Drag & Drop Action Zone */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <span>Quick Scan Workspace</span>
                  </h3>
                  <p className="text-xs text-slate-500">Drop a new version to test score changes instantly</p>
                </div>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleQuickDrop}
                className={`relative p-8 rounded-3xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center min-h-[260px] ${
                  isDragging
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 scale-[1.01]'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400/60 shadow-sm'
                }`}
              >
                {quickUploadLoading ? (
                  <div className="space-y-3">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Parsing & scoring resume with NLP...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-inner">
                      <UploadCloud className="w-7 h-7" />
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Drag & Drop Resume Here
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                      Supports PDF (.pdf) and Word (.docx) documents up to 5MB
                    </p>

                    <label className="mt-4 cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/80 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700">
                      <span>Browse Local File</span>
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleQuickFileSelect}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            </motion.div>

            {/* Right: Score Progression Trend Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>Score Progression Telemetry</span>
                  </h3>
                  <p className="text-xs text-slate-500">Historical performance trend across iterations</p>
                </div>
                <Badge variant="indigo" size="sm">
                  {trendData.length > 0 ? `${trendData.length} Scans Logged` : 'Live'}
                </Badge>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[260px] flex flex-col justify-between">
                {trendData.length > 0 ? (
                  <div className="w-full h-56 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ top: 10, right: 20, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" strokeOpacity={0.12} />
                        <XAxis
                          dataKey="date"
                          tick={{ fill: '#64748B', fontSize: 11 }}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fill: '#64748B', fontSize: 11 }}
                          tickLine={false}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: '#1E293B',
                            borderRadius: '12px',
                            border: '1px solid #334155',
                            color: '#FFFFFF',
                            fontSize: '12px',
                          }}
                          formatter={(val) => [`${val}/100`, 'ATS Score']}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#4F46E5"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#scoreGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="my-auto text-center py-8 space-y-2">
                    <BarChart3 className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="text-xs font-bold text-slate-400">
                      Upload your first 2 resume iterations to generate your live trajectory chart.
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Target Benchmark: 90+ High Band</span>
                  <Link to="/history" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View full history table →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Scans Feed */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Recent Resume Scans
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Access comprehensive results, radar charts, and job recommendations
                </p>
              </div>

              {historyData.length > 0 && (
                <Link
                  to="/history"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>See all {historyData.length} scans</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <span>Loading your scans...</span>
              </div>
            ) : historyData.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">No resumes scanned yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Upload your first resume in PDF or DOCX format to get your initial ATS score and job matches.
                </p>
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload Resume Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {historyData.slice(0, 3).map((item, idx) => (
                  <motion.div
                    key={item.id || idx}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 transition-all flex flex-col justify-between shadow-sm space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-black text-xs">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                              {item.filename}
                            </h4>
                            <span className="text-[11px] text-slate-400 block">
                              {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                        </div>

                        <Badge
                          variant={item.overall_score >= 70 ? 'emerald' : item.overall_score >= 40 ? 'amber' : 'rose'}
                          size="sm"
                        >
                          {Math.round(item.overall_score)}/100
                        </Badge>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Top Match</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {item.top_matched_role}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/results/${item.id}/score`}
                      className="w-full py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Open Full Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
