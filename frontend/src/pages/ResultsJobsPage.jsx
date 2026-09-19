import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  DollarSign,
  Clock,
  Filter,
  Search,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { getResume } from '../api/resume';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ResultsTabsNav from '../components/results/ResultsTabsNav';
import Badge from '../components/common/Badge';

const ResultsJobsPage = () => {
  const { id } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minMatchFilter, setMinMatchFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedJobId, setExpandedJobId] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await getResume(id);
        setResumeData(res.data);
      } catch (err) {
        console.error('Failed to load job matches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const matchedJobs = resumeData?.matched_jobs || [];

  // Available categories
  const categories = useMemo(() => {
    const cats = new Set(matchedJobs.map((j) => j.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [matchedJobs]);

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return matchedJobs.filter((job) => {
      const matchCategory = selectedCategory === 'All' || job.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.matching_skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchScore = job.match_percentage >= minMatchFilter;
      return matchCategory && matchSearch && matchScore;
    });
  }, [matchedJobs, selectedCategory, searchQuery, minMatchFilter]);

  const toggleExpand = (jobId) => {
    setExpandedJobId((prev) => (prev === jobId ? null : jobId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-slate-500">Calculating TF-IDF job matches...</p>
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

        {/* Filter and Search Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Recommended Job Profiles ({filteredJobs.length})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ranked using TF-IDF vectorization, cosine similarity, and required skill overlap
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search job titles or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Category Pills & Min Match Slider */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">
                Min Match: <strong className="text-slate-800 dark:text-slate-200">{minMatchFilter}%</strong>
              </span>
              <input
                type="range"
                min="0"
                max="80"
                step="10"
                value={minMatchFilter}
                onChange={(e) => setMinMatchFilter(Number(e.target.value))}
                className="w-24 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">No matching job roles found</h4>
              <p className="text-xs text-slate-500">Try adjusting your category filter or minimum match percentage slider.</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isExpanded = expandedJobId === job.job_id;
              const matchPct = Math.round(job.match_percentage);

              return (
                <div
                  key={job.job_id}
                  className={`p-6 rounded-3xl border transition-all duration-200 bg-white dark:bg-slate-900 ${
                    isExpanded
                      ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 shadow-sm'
                  }`}
                >
                  {/* Main Card Header Row */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="indigo" size="sm">
                          {job.category}
                        </Badge>
                        <Badge variant="slate" size="sm">
                          {job.experience_level}
                        </Badge>
                        {job.location && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {job.location}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        {job.salary_range && (
                          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                            {job.salary_range}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Min {job.min_experience_years}+ years exp
                        </span>
                      </div>
                    </div>

                    {/* Match Score & Expand Button */}
                    <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="text-left lg:text-right min-w-[130px]">
                        <div className="flex items-baseline justify-between lg:justify-end gap-1.5">
                          <span className="text-xs font-semibold text-slate-400">Match Score:</span>
                          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            {matchPct}%
                          </span>
                        </div>
                        {/* Horizontal Match Bar */}
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              matchPct >= 75 ? 'bg-emerald-500' : matchPct >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, matchPct)}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpand(job.job_id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'Why This Matches'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Skills Chips Strip */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    {/* Matching Skills */}
                    {job.matching_skills && job.matching_skills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 mr-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Matching ({job.matching_skills.length}):
                        </span>
                        {job.matching_skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200/80 dark:border-emerald-800/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Missing Skills */}
                    {job.missing_skills && job.missing_skills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400 mr-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Missing ({job.missing_skills.length}):
                        </span>
                        {job.missing_skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-200/80 dark:border-amber-800/60"
                          >
                            + {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expandable "Why This Matches" AI Reasoning Box */}
                  {isExpanded && (
                    <div className="mt-5 p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3 animate-in fade-in-50 duration-150">
                      <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Match Analysis & Recruiter Recommendation</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {job.why_it_matches}
                      </p>

                      {job.description && (
                        <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/60">
                          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                            Role Description Overview:
                          </span>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            {job.description}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultsJobsPage;
