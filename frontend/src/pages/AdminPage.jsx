import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Shield,
  Users,
  FileText,
  Briefcase,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAdminStats, getAdminUsers, createJob, updateJob, deleteJob } from '../api/admin';
import { getJobs } from '../api/jobs';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Badge from '../components/common/Badge';

const AdminPage = () => {
  const { user, isAdmin, login } = useAuth();

  // Admin login gate states
  const [adminEmail, setAdminEmail] = useState('admin@resumeiq.ai');
  const [adminPassword, setAdminPassword] = useState('Admin@123456');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin dashboard data
  const [statsData, setStatsData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'jobs' | 'users'
  const [loadingData, setLoadingData] = useState(false);

  // Job Modal state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    category: 'Software Engineering',
    experience_level: 'Mid-Level',
    min_experience_years: 2,
    salary_range: '$100,000 - $140,000',
    location: 'Remote / Hybrid',
    description: '',
    required_skills: '',
    preferred_skills: '',
  });

  const fetchAdminData = async () => {
    setLoadingData(true);
    try {
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getJobs(),
      ]);
      setStatsData(statsRes.stats);
      setUsersList(usersRes.users || []);
      setJobsList(jobsRes.jobs || []);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await login(adminEmail, adminPassword);
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Invalid administrator credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const openAddJobModal = () => {
    setEditingJob(null);
    setJobFormData({
      title: '',
      category: 'Software Engineering',
      experience_level: 'Mid-Level',
      min_experience_years: 2,
      salary_range: '$100,000 - $140,000',
      location: 'Remote / Hybrid',
      description: '',
      required_skills: 'React, Node.js, TypeScript, SQL',
      preferred_skills: 'Docker, AWS, GraphQL',
    });
    setIsJobModalOpen(true);
  };

  const openEditJobModal = (job) => {
    setEditingJob(job);
    setJobFormData({
      title: job.title || '',
      category: job.category || 'Software Engineering',
      experience_level: job.experience_level || 'Mid-Level',
      min_experience_years: job.min_experience_years || 2,
      salary_range: job.salary_range || '',
      location: job.location || '',
      description: job.description || '',
      required_skills: (job.required_skills || []).join(', '),
      preferred_skills: (job.preferred_skills || []).join(', '),
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...jobFormData,
        required_skills: jobFormData.required_skills.split(',').map((s) => s.trim()).filter(Boolean),
        preferred_skills: jobFormData.preferred_skills.split(',').map((s) => s.trim()).filter(Boolean),
        min_experience_years: Number(jobFormData.min_experience_years),
      };

      if (editingJob) {
        await updateJob(editingJob.id || editingJob._id, payload);
      } else {
        await createJob(payload);
      }

      setIsJobModalOpen(false);
      await fetchAdminData();
    } catch (err) {
      alert('Failed to save job role: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job role from the dataset?')) return;
    try {
      await deleteJob(jobId);
      await fetchAdminData();
    } catch (err) {
      alert('Failed to delete job role.');
    }
  };

  // If not logged in as admin, show Admin Login Gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 mb-2">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Admin Console Gate
              </h2>
              <p className="text-xs text-slate-500">
                Administrative privileges required to access dataset manager and global analytics.
              </p>
            </div>

            {/* Default Dev Admin Note */}
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-300 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Pre-Configured Administrator Credentials:
              </span>
              <p className="font-mono text-[11px]">Email: admin@resumeiq.ai</p>
              <p className="font-mono text-[11px]">Password: Admin@123456</p>
            </div>

            {loginError && (
              <p className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold">
                {loginError}
              </p>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                {isLoggingIn ? 'Verifying...' : 'Authenticate as Admin'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="indigo" size="sm">Admin Management Console</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Live telemetry, aggregate skill demand charts, job dataset editor, and user activity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openAddJobModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Job Role</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {[
            { key: 'overview', label: 'System Overview & Demand Charts', icon: TrendingUp },
            { key: 'jobs', label: `Job Dataset Management (${jobsList.length})`, icon: Briefcase },
            { key: 'users', label: `Registered Users (${usersList.length})`, icon: Users },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === t.key
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview & Analytics */}
        {activeTab === 'overview' && statsData && (
          <div className="space-y-8">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                  {statsData.total_users}
                </p>
                <span className="text-[11px] text-emerald-500 font-semibold mt-1 block">
                  Active in database
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Resumes Scanned</span>
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                  {statsData.total_resumes}
                </p>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                  Processed with spaCy/TF-IDF
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Average ATS Score</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                  {statsData.average_score || '78.5'}
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                </p>
                <span className="text-[11px] text-emerald-500 font-semibold mt-1 block">
                  Overall Candidate Mean
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Target Roles</span>
                <p className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">
                  {statsData.total_jobs || jobsList.length}
                </p>
                <span className="text-[11px] text-purple-500 font-semibold mt-1 block">
                  Available in seed catalog
                </span>
              </div>
            </div>

            {/* In-Demand Skills Aggregate Bar Chart */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Most In-Demand Skills Across Job Dataset
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Frequency count of technical & cloud competencies across all active job postings
                  </p>
                </div>
                <Badge variant="indigo" size="sm">
                  Aggregate Telemetry
                </Badge>
              </div>

              <div className="w-full h-80 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statsData.top_in_demand_skills || []}
                    margin={{ top: 10, right: 30, left: -10, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" strokeOpacity={0.15} />
                    <XAxis
                      dataKey="skill"
                      tick={{ fill: '#64748B', fontSize: 11 }}
                      angle={-30}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderRadius: '12px',
                        border: '1px solid #334155',
                        color: '#FFFFFF',
                        fontSize: '12px',
                      }}
                      formatter={(val) => [`${val} job postings`, 'Requirement Count']}
                    />
                    <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Job Dataset Manager */}
        {activeTab === 'jobs' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Seed Job Dataset ({jobsList.length} Roles)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage the job profiles used by the TF-IDF and cosine similarity matching engine.
                </p>
              </div>
              <button
                onClick={openAddJobModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Role</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4">Role Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Experience</th>
                    <th className="py-3.5 px-4">Required Skills</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {jobsList.map((job) => (
                    <tr key={job.id || job._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                        {job.title}
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        <Badge variant="indigo" size="sm">{job.category}</Badge>
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                        {job.experience_level} ({job.min_experience_years}+ yrs)
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {(job.required_skills || []).slice(0, 4).map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                              {s}
                            </span>
                          ))}
                          {(job.required_skills || []).length > 4 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{job.required_skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditJobModal(job)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                            title="Edit Role"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id || job._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Delete Role"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Users List */}
        {activeTab === 'users' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Registered Candidate Accounts ({usersList.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Overview of user verification states and total resume scans executed.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Verification</th>
                    <th className="py-3.5 px-4">Resumes Scanned</th>
                    <th className="py-3.5 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                        <div>
                          <p>{u.name}</p>
                          <p className="text-[11px] text-slate-400 font-normal">{u.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={u.role === 'admin' ? 'indigo' : 'slate'} size="sm">
                          {u.role?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={u.is_verified ? 'emerald' : 'amber'} size="sm">
                          {u.is_verified ? 'Verified (OTP)' : 'Unverified'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 font-black text-slate-800 dark:text-slate-200">
                        {u.resumes_analyzed || 0} scans
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Job Modal */}
        {isJobModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingJob ? 'Edit Job Role' : 'Add New Target Job Role'}
                </h3>
                <button
                  onClick={() => setIsJobModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveJob} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      required
                      value={jobFormData.title}
                      onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                      placeholder="e.g. AI Systems Architect"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      value={jobFormData.category}
                      onChange={(e) => setJobFormData({ ...jobFormData, category: e.target.value })}
                      placeholder="Software Engineering, AI / ML, Cloud..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Experience Level
                    </label>
                    <select
                      value={jobFormData.experience_level}
                      onChange={(e) => setJobFormData({ ...jobFormData, experience_level: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    >
                      <option value="Entry / Junior">Entry / Junior</option>
                      <option value="Mid-Level">Mid-Level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead / Architect">Lead / Architect</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Min Exp (Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={jobFormData.min_experience_years}
                      onChange={(e) => setJobFormData({ ...jobFormData, min_experience_years: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      value={jobFormData.salary_range}
                      onChange={(e) => setJobFormData({ ...jobFormData, salary_range: e.target.value })}
                      placeholder="$120,000 - $160,000"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Required Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={jobFormData.required_skills}
                    onChange={(e) => setJobFormData({ ...jobFormData, required_skills: e.target.value })}
                    placeholder="Python, React, TypeScript, Docker, SQL"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={jobFormData.preferred_skills}
                    onChange={(e) => setJobFormData({ ...jobFormData, preferred_skills: e.target.value })}
                    placeholder="Kubernetes, AWS, Tailwind CSS, Redis"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Description / Responsibilities
                  </label>
                  <textarea
                    rows={3}
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                    placeholder="Brief description of the role responsibilities and requirements..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsJobModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700"
                  >
                    {editingJob ? 'Update Role' : 'Create Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
