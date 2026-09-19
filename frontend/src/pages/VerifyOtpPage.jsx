import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RefreshCw, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';

const VerifyOtpPage = () => {
  const { verifyOtp, resendOtp, pendingEmail } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || pendingEmail || '';
  const purpose = location.state?.purpose || 'verification';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [expirySeconds, setExpirySeconds] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(30); // 30s cooldown
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef([]);

  // 5-minute countdown timer
  useEffect(() => {
    if (expirySeconds <= 0) return;
    const interval = setInterval(() => {
      setExpirySeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [expirySeconds]);

  // 30-second resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleDigitChange = (index, value) => {
    setErrorMsg('');
    // Handle paste event of multiple digits
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...digits];
      cleanDigits.forEach((d, i) => {
        newDigits[i] = d;
      });
      setDigits(newDigits);
      const nextFocus = Math.min(cleanDigits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const cleanVal = value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    // Auto focus next box
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const otpCode = digits.join('');
    if (otpCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP code.');
      return;
    }

    if (!email) {
      setErrorMsg('No email address associated with verification. Please sign up or log in again.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await verifyOtp(email, otpCode, purpose);
      if (purpose === 'reset_password') {
        navigate('/forgot-password', { state: { step: 3, email, otp: otpCode } });
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Invalid or expired OTP code. Please check your email and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await resendOtp(email, purpose);
      setSuccessMsg('A new 6-digit verification code has been sent to your email.');
      setExpirySeconds(300);
      setResendCooldown(30);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to resend verification code. Please check server email credentials.');
    } finally {
      setIsResending(false);
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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Verify your email
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              We sent a 6-digit code to{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {email || 'your email'}
              </span>
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Segmented 6-box input */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between gap-2 sm:gap-2.5">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  className="otp-digit-input w-11 sm:w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                />
              ))}
            </div>

            {/* Countdown timer */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {expirySeconds > 0 ? (
                <span>Code expires in <strong className="text-slate-800 dark:text-slate-200">{formatTimer(expirySeconds)}</strong></span>
              ) : (
                <span className="text-rose-500 font-bold">Code has expired. Please request a new one.</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || digits.join('').length !== 6 || expirySeconds <= 0}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-600/20 transition-all duration-150 disabled:opacity-50 active:scale-98"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Verify Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend Cooldown Strip */}
          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-40 disabled:no-underline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
