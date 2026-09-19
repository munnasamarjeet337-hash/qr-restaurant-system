import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileCheck,
  Zap,
  Briefcase,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Badge from '../components/common/Badge';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];
  const MAX_SIZE_MB = 5;

  const validateAndSetFile = (selectedFile) => {
    setErrorMsg('');
    if (!selectedFile) return;

    // Check extension and mime
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc'].includes(ext)) {
      setErrorMsg('Invalid file format. Please upload a PDF or DOCX file.');
      return;
    }

    // Check size (max 5MB)
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File size exceeds ${MAX_SIZE_MB}MB limit.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = () => {
    if (!file) {
      setErrorMsg('Please select a resume file first.');
      return;
    }
    // Navigate to /analyzing passing the file in state
    navigate('/analyzing', { state: { file } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="indigo" size="sm">
            <Sparkles className="w-3 h-3" />
            <span>AI Resume Intelligence</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Upload your resume for analysis
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Get an instant ATS compatibility score, deep skill breakdown, and tailored job recommendations in seconds.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed transition-all duration-200 p-8 sm:p-12 text-center cursor-pointer ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]'
              : file
              ? 'border-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-950/10 cursor-default'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50/50 dark:hover:bg-slate-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleFileChange}
            className="hidden"
          />

          {!file ? (
            <div className="space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto shadow-sm">
                <UploadCloud className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  Drag and drop your resume here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF, DOCX or DOC files (Max 5MB)
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Private & Secure
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Instant Processing
                </span>
              </div>
            </div>
          ) : (
            /* Selected File Preview Card */
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB • {file.name.split('.').pop().toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            to="/dashboard"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <button
            type="button"
            disabled={!file}
            onClick={handleAnalyze}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-600/25 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Resume Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 w-fit">
              <FileCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">ATS Formatting Audit</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Verify clean section hierarchy, contact extraction, and single-page length guidelines.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 w-fit">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Skill Gap Matrix</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Maps detected skills into Technical, Soft, Tools, and Domain Knowledge radar categories.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 w-fit">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">TF-IDF Role Matching</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Calculates vector cosine similarity against 20+ realistic industry job listings.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UploadPage;
