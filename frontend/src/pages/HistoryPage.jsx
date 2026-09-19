import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  History,
  FileText,
  Trash2,
  ExternalLink,
  UploadCloud,
  TrendingUp,
  Award,
  Clock,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { getResumeHistory, deleteResume } from '../api/resume';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Badge from '../components/common/Badge';

const HistoryPage = () => {
  const [historyList, setHistoryList] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await getResumeHistory();
      setHistoryList(res.history || []);
      setTrendData(res.trend || []);
    } catch (err) {
      setErrorMsg('Failed to load analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume analysis record?')) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteResume(id);
      await fetchHistory();
    } catch (err) {
      alert('Failed to delete resume record.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="indigo" size="sm">Historical Analytics</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Resume Analysis History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track how your resume score and skill alignment improve across iterations.
            </p>
          </div>

          <Link
            to="/upload"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-600/20 transition-all active:scale-95 self-start sm:self-auto"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Version</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <span>Loading your historical scans...</span>
          </div>
        ) : historyList.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No history recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't uploaded any resumes yet. Upload your first document to begin tracking your ATS readiness trend.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Score Progression Trend Chart */}
            {trendData.length > 1 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <span>ATS Score Progression Over Time</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Score trend across all {trendData.length} uploaded iterations
                    </p>
                  </div>
                  <Badge variant="emerald" size="sm">
                    Live Telemetry
                  </Badge>
                </div>

                <div className="w-full h-64 sm:h-72 pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" strokeOpacity={0.15} />
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
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#4F46E5"
                        strokeWidth={3}
                        dot={{ fill: '#4F46E5', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 8, fill: '#10B981' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Historical Records Table / Card Grid */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  All Uploaded Resumes ({historyList.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click any past version to review the detailed score breakdown, skills radar, and job matches.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Resume File</th>
                      <th className="py-3.5 px-4">Scan Date</th>
                      <th className="py-3.5 px-4">Top Role Match</th>
                      <th className="py-3.5 px-4">ATS Score</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {historyList.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="truncate max-w-xs">{item.filename}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-medium">
                          {item.top_matched_role}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-slate-900 dark:text-white">
                              {Math.round(item.overall_score)}/100
                            </span>
                            <Badge
                              variant={item.overall_score >= 70 ? 'emerald' : item.overall_score >= 40 ? 'amber' : 'rose'}
                              size="sm"
                            >
                              {item.tier || 'Score'}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/results/${item.id}/score`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                            >
                              <span>View Report</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              disabled={deletingId === item.id}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-40"
                              title="Delete scan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HistoryPage;
