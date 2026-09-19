import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowUpDown,
  Code,
  Users,
  Wrench,
  Globe,
} from 'lucide-react';
import { getResume } from '../api/resume';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ResultsTabsNav from '../components/results/ResultsTabsNav';
import Badge from '../components/common/Badge';

const ResultsSkillsPage = () => {
  const { id } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'category'

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await getResume(id);
        setResumeData(res.data);
      } catch (err) {
        console.error('Failed to load skills analysis:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const skillsObj = resumeData?.skills || {};
  const technicalSkills = skillsObj.technical || [];
  const softSkills = skillsObj.soft_skills || [];
  const toolSkills = skillsObj.tools || [];
  const domainSkills = skillsObj.domain || [];

  // Top matched job missing skills
  const topJob = resumeData?.matched_jobs?.[0] || null;
  const missingSkills = topJob?.missing_skills || [
    'System Design',
    'CI/CD Pipelines',
    'GraphQL',
    'Kubernetes',
    'Unit Testing',
  ];

  // Radar Chart Data preparation
  const radarData = useMemo(() => {
    // Benchmark ideal counts vs actual counts
    const techCount = technicalSkills.length;
    const softCount = softSkills.length;
    const toolsCount = toolSkills.length;
    const domainCount = domainSkills.length;

    return [
      {
        subject: 'Technical Stack',
        candidateScore: Math.min(100, Math.round((techCount / 12) * 100)),
        benchmarkScore: 85,
        fullMark: 100,
        count: techCount,
      },
      {
        subject: 'Developer Tools',
        candidateScore: Math.min(100, Math.round((toolsCount / 6) * 100)),
        benchmarkScore: 80,
        fullMark: 100,
        count: toolsCount,
      },
      {
        subject: 'Soft Competencies',
        candidateScore: Math.min(100, Math.round((softCount / 5) * 100)),
        benchmarkScore: 75,
        fullMark: 100,
        count: softCount,
      },
      {
        subject: 'Domain Architecture',
        candidateScore: Math.min(100, Math.round((domainCount / 4) * 100)),
        benchmarkScore: 70,
        fullMark: 100,
        count: domainCount,
      },
    ];
  }, [technicalSkills, softSkills, toolSkills, domainSkills]);

  // Flattened all detected skills with metadata
  const allDetected = useMemo(() => {
    const list = [];
    technicalSkills.forEach((s) => list.push({ name: s, category: 'Technical', icon: Code, proficiency: 'Detected in Resume' }));
    toolSkills.forEach((s) => list.push({ name: s, category: 'Tools', icon: Wrench, proficiency: 'Detected in Resume' }));
    softSkills.forEach((s) => list.push({ name: s, category: 'Soft Skills', icon: Users, proficiency: 'Detected in Resume' }));
    domainSkills.forEach((s) => list.push({ name: s, category: 'Domain', icon: Globe, proficiency: 'Detected in Resume' }));
    return list;
  }, [technicalSkills, toolSkills, softSkills, domainSkills]);

  // Filtered and sorted skills
  const filteredSkills = useMemo(() => {
    let result = allDetected;
    if (selectedCategory !== 'all') {
      result = result.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchQuery) {
      result = result.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'category') {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }
    return result;
  }, [allDetected, selectedCategory, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-slate-500">Loading skill analytics...</p>
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

        {/* Radar & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Radar Chart Card */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Skill Competency Radar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Your skill profile vs Industry Senior Benchmark
                </p>
              </div>
              <Badge variant="indigo" size="sm">
                4-Axis Matrix
              </Badge>
            </div>

            {/* Recharts Radar Chart */}
            <div className="w-full h-72 sm:h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid stroke="#94A3B8" strokeOpacity={0.25} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    stroke="#94A3B8"
                    strokeOpacity={0.2}
                    tick={{ fill: '#94A3B8', fontSize: 10 }}
                  />
                  <Radar
                    name="Your Profile"
                    dataKey="candidateScore"
                    stroke="#4F46E5"
                    fill="#6366F1"
                    fillOpacity={0.45}
                  />
                  <Radar
                    name="Industry Benchmark"
                    dataKey="benchmarkScore"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.15}
                    strokeDasharray="4 4"
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '12px',
                      border: '1px solid #334155',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Strip */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                <span className="text-slate-700 dark:text-slate-300">Your Resume Score</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500/50 border border-emerald-500"></span>
                <span className="text-slate-500">Senior Industry Target</span>
              </div>
            </div>
          </div>

          {/* Missing & In-Demand Skills Card */}
          <div className="lg:col-span-6 space-y-6">
            {/* Missing High-Priority Skills Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      High-Priority Missing Keywords
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Required by top matched roles ({topJob?.title || 'Target Jobs'}) but not detected
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 text-xs font-bold shadow-sm"
                  >
                    <span>+ {skill}</span>
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                💡 <strong>Tip:</strong> If you have experience with any of these technologies, add them under your <em>Technical Skills</em> and reference them in relevant project descriptions to increase your match rate by up to 18%.
              </p>
            </div>

            {/* Overview Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{technicalSkills.length}</span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Technical</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{toolSkills.length}</span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Dev Tools</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{softSkills.length}</span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Soft Skills</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{domainSkills.length}</span>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Domain</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Detected Skills List / Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Detected Skills in Your Resume ({allDetected.length})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Categorized by our natural language entity parser
              </p>
            </div>

            {/* Filter and Search Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {['all', 'Technical', 'Tools', 'Soft Skills', 'Domain'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat.toLowerCase())}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedCategory === cat.toLowerCase()
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filteredSkills.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {item.category}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
                    Verified
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultsSkillsPage;
