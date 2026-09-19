import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User, ArrowRight, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const passwordValue = watch('password', '');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-blue-500', text: 'text-blue-500' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
      default:
        return { score: 10, label: 'Too Weak', color: 'bg-rose-400', text: 'text-rose-400' };
    }
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await signup(data.name, data.email, data.password, data.confirm_password);
      navigate('/verify-otp', { state: { email: data.email, purpose: 'verification' } });
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md space-y-8 p-8 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Start optimizing your resume with AI intelligence
            </p>
          </div>

          {/* Global Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </div>
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {passwordValue && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Password strength:</span>
                    <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
              {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  {...register('confirm_password', {
                    required: 'Please confirm password',
                    validate: (val) => val === passwordValue || 'Passwords do not match',
                  })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </div>
              {errors.confirm_password && <p className="text-xs text-rose-500 mt-1">{errors.confirm_password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-600/20 transition-all duration-150 disabled:opacity-50 active:scale-98"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Log in here
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
