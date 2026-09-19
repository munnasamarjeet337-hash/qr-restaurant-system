import React from 'react';
import { NavLink, useParams, Link } from 'react-router-dom';
import { Award, Zap, Briefcase, Lightbulb, ArrowLeft, RefreshCw, Download } from 'lucide-react';

const ResultsTabsNav = ({ resumeData }) => {
  const { id } = useParams();

  const tabs = [
    {
      name: 'Score Overview',
      path: `/results/${id}/score`,
      icon: Award,
      badge: resumeData ? `${Math.round(resumeData.overall_score || resumeData.score?.overall_score || 0)}/100` : null,
    },
    {
      name: 'Skill Analysis',
      path: `/results/${id}/skills`,
      icon: Zap,
      badge: resumeData ? `${resumeData.skills?.all?.length || 0} skills` : null,
    },
    {
      name: 'Job Matches',
      path: `/results/${id}/jobs`,
      icon: Briefcase,
      badge: resumeData ? `${resumeData.matched_jobs?.length || 0} roles` : null,
    },
    {
      name: 'Actionable Suggestions',
      path: `/results/${id}/suggestions`,
      icon: Lightbulb,
      badge: resumeData ? `${resumeData.suggestions?.length || 0} tips` : null,
    },
  ];

  return (
    <div className="w-full mb-8">
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {resumeData?.candidate_name ? `${resumeData.candidate_name}'s Analysis` : 'Resume Analysis Report'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            File: <span className="font-medium text-slate-700 dark:text-slate-300">{resumeData?.filename || 'Uploaded Resume'}</span>
            {resumeData?.created_at && (
              <span> • Analyzed on {new Date(resumeData.created_at).toLocaleDateString()}</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
            Upload New Version
          </Link>
        </div>
      </div>

      {/* Segmented Tab Navigation Bar */}
      <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
              {tab.badge && (
                <span
                  className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 dark:bg-black/20 text-inherit"
                >
                  {tab.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsTabsNav;
