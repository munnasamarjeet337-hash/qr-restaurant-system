import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DarkModeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
};

export default DarkModeToggle;
