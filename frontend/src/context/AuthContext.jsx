import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('resumeiq_token') || null);
  const [pendingEmail, setPendingEmail] = useState(() => sessionStorage.getItem('resumeiq_pending_email') || '');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user if token exists
  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('resumeiq_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiClient.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.warn('Session expired or invalid:', err);
      localStorage.removeItem('resumeiq_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 1. Signup -> requires OTP verification
  const signup = async (name, email, password, confirm_password) => {
    const res = await apiClient.post('/auth/signup', {
      name,
      email,
      password,
      confirm_password,
    });
    setPendingEmail(email);
    sessionStorage.setItem('resumeiq_pending_email', email);
    return res.data;
  };

  // 2. Verify OTP -> sets token and user
  const verifyOtp = async (email, otp, purpose = 'verification') => {
    const emailToUse = email || pendingEmail;
    const res = await apiClient.post('/auth/verify-otp', {
      email: emailToUse,
      otp,
      purpose,
    });

    if (purpose === 'verification' && res.data.token) {
      localStorage.setItem('resumeiq_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      sessionStorage.removeItem('resumeiq_pending_email');
      setPendingEmail('');
    }
    return res.data;
  };

  // 3. Resend OTP
  const resendOtp = async (email, purpose = 'verification') => {
    const emailToUse = email || pendingEmail;
    const res = await apiClient.post('/auth/resend-otp', {
      email: emailToUse,
      purpose,
    });
    return res.data;
  };

  // 4. Login -> checks if verified
  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('resumeiq_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      sessionStorage.removeItem('resumeiq_pending_email');
      setPendingEmail('');
      return res.data;
    } else if (res.data.requires_otp) {
      setPendingEmail(email);
      sessionStorage.setItem('resumeiq_pending_email', email);
      return res.data;
    }
    return res.data;
  };

  // 5. Logout
  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore network failure on logout
    } finally {
      localStorage.removeItem('resumeiq_token');
      sessionStorage.removeItem('resumeiq_pending_email');
      setToken(null);
      setUser(null);
    }
  };

  // 6. Forgot Password
  const forgotPassword = async (email) => {
    const res = await apiClient.post('/auth/forgot-password', { email });
    setPendingEmail(email);
    sessionStorage.setItem('resumeiq_pending_email', email);
    return res.data;
  };

  // 7. Reset Password
  const resetPassword = async (email, otp, newPassword) => {
    const res = await apiClient.post('/auth/reset-password', {
      email: email || pendingEmail,
      otp,
      new_password: newPassword,
    });
    sessionStorage.removeItem('resumeiq_pending_email');
    setPendingEmail('');
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        pendingEmail,
        setPendingEmail,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        signup,
        verifyOtp,
        resendOtp,
        login,
        logout,
        forgotPassword,
        resetPassword,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
