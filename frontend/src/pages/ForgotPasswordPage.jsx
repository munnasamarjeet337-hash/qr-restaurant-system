import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { KeyRound, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';

const ForgotPasswordPage = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Enter OTP + New Password
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Step 1: Request Password Reset OTP
  const handleRequestOtp = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      await forgotPassword(data.email);
      setEmail(data.email);
      setSuccessMsg('Reset code sent! Please check your email inbox.');
      setStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to send reset code. Please check your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Submit OTP & New Password
  const handleResetPassword = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      await resetPassword(email, data.otp, data.new_password);
      setSuccessMsg('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Invalid or expired reset code. Please try again.');
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
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {step === 1 ? 'Reset your password' : 'Enter reset code'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {step === 1
                ? 'Enter your email address and we will send you a 6-digit verification code'
                : `Enter the 6-digit code sent to ${email} and your new password`}
            </p>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSubmit(handleRequestOtp)} className="space-y-4">
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
                    {...register('email', { required: 'Email is required' })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-600/20 transition-all duration-150 disabled:opacity-50 active:scale-98"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Send Reset OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  {...register('otp', { required: 'OTP is required', minLength: 6 })}
                  className="w-full text-center tracking-widest text-lg font-bold py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
                {errors.otp && <p className="text-xs text-rose-500 mt-1">{errors.otp.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    {...register('new_password', {
                      required: 'New password is required',
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
                {errors.new_password && <p className="text-xs text-rose-500 mt-1">{errors.new_password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-600/20 transition-all duration-150 disabled:opacity-50 active:scale-98"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Set New Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Remembered your password?{' '}
            <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Back to log in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
