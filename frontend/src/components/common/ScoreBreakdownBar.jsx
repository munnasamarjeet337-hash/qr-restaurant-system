import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Sparkles, Briefcase, FileCheck, Key } from 'lucide-react';

const ScoreBreakdownBar = ({ breakdown }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  if (!breakdown) return null;

  const categories = [
    {
      key: 'skill_match',
      label: 'Skill Match',
      weight: '40%',
      weightMultiplier: 0.40,
      score: breakdown.skill_match?.score || 0,
      weighted: breakdown.skill_match?.weighted_score || 0,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      icon: Sparkles,
      description: 'Calculated from technical skills, tools, soft skills, and domain relevance compared to modern industry job standards.',
    },
    {
      key: 'experience_relevance',
      label: 'Experience Relevance',
      weight: '30%',
      weightMultiplier: 0.30,
      score: breakdown.experience_relevance?.score || 0,
      weighted: breakdown.experience_relevance?.weighted_score || 0,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      icon: Briefcase,
      description: 'Evaluates career duration, leadership verbs, and presence of quantified metric outcomes in work bullet points.',
    },
    {
      key: 'ats_formatting',
      label: 'ATS Formatting',
      weight: '20%',
      weightMultiplier: 0.20,
      score: breakdown.ats_formatting?.score || 0,
      weighted: breakdown.ats_formatting?.weighted_score || 0,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      icon: FileCheck,
      description: 'Measures standard section header detection, contact parseability (email, phone, LinkedIn), and clean single-page length.',
    },
    {
      key: 'keyword_density',
      label: 'Keyword Density',
      weight: '10%',
      weightMultiplier: 0.10,
      score: breakdown.keyword_density?.score || 0,
      weighted: breakdown.keyword_density?.weighted_score || 0,
      color: 'bg-amber-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      icon: Key,
      description: 'Scans action verb power distribution and natural industry terminology frequency without keyword-stuffing.',
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Weighting Formula Header Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2 font-medium">
          <HelpCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <span>Explainable Formula:</span>
          <code className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-800">
            Total = (0.40 × Skill) + (0.30 × Exp) + (0.20 × ATS) + (0.10 × Keyword)
          </code>
        </div>
        <span className="text-slate-400 text-xs">Hover segments for details</span>
      </div>

      {/* Horizontal Multi-Segment Weighted Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Weighted Contribution to Overall Score</span>
          <span>100% Normalized</span>
        </div>
        
        <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex p-0.5 gap-0.5 shadow-inner">
          {categories.map((cat) => {
            const widthPct = Math.max(5, (cat.weighted / 100) * 100);
            return (
              <div
                key={cat.key}
                onMouseEnter={() => setActiveTooltip(cat.key)}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`relative h-full ${cat.color} rounded cursor-pointer transition-all duration-200 hover:opacity-90 flex items-center justify-center`}
                style={{ width: `${widthPct}%` }}
              >
                <span className="text-[10px] font-bold text-white tracking-wider truncate px-1">
                  {cat.weighted}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.key}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                activeTooltip === cat.key
                  ? 'border-indigo-500 shadow-md bg-indigo-50/20 dark:bg-indigo-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${cat.color} bg-opacity-10 dark:bg-opacity-20 text-${cat.color.replace('bg-', '')}`}>
                    <Icon className={`w-4 h-4 ${cat.textColor}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{cat.label}</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {cat.weight}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {cat.score}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  +{cat.weighted} pts
                </span>
              </div>

              {/* Mini progress bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full ${cat.color} rounded-full`}
                  style={{ width: `${Math.min(100, cat.score)}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoreBreakdownBar;
