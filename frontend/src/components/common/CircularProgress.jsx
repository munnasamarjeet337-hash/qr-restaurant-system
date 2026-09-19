import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CircularProgress = ({ score = 0, size = 180, strokeWidth = 14, showLabel = true }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (animatedScore / 100) * circumference;

  // Determine color scheme
  let strokeColor = '#10B981'; // emerald >= 70
  let glowColor = 'rgba(16, 185, 129, 0.3)';
  let tierLabel = 'Excellent';
  let badgeClass = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';

  if (score < 40) {
    strokeColor = '#EF4444'; // rose < 40
    glowColor = 'rgba(239, 68, 68, 0.3)';
    tierLabel = 'Needs Work';
    badgeClass = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
  } else if (score < 70) {
    strokeColor = '#F59E0B'; // amber 40-70
    glowColor = 'rgba(245, 158, 11, 0.3)';
    tierLabel = 'Competitive';
    badgeClass = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  }

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
          fill="transparent"
        />

        {/* Animated Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progressOffset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: `drop-shadow(0 0 8px ${glowColor})`,
          }}
        />
      </svg>

      {/* Center Score Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
        >
          {Math.round(score)}
        </motion.span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          out of 100
        </span>
      </div>

      {showLabel && (
        <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
          {tierLabel} ({score >= 70 ? '70%+' : score >= 40 ? '40–70%' : '<40%'})
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
