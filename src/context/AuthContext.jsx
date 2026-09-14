/**
 * =========================================================================
 * 🔐 HỆ THỐNG QUẢN LÝ TÀI KHOẢN (Authentication Context)
 * - Tích hợp Database SQLite & REST API qua authAPI
 * - Phân quyền: admin | client
 * - Quy trình: Đăng ký → Xác nhận thông tin → Đăng nhập
 * =========================================================================
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'kenrestaurant_token';
const USER_KEY = 'kenrestaurant_session';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });

  // Modal state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'confirm' | 'admin'

  // Register multi-step data
  const [pendingUser, setPendingUser] = useState(null);

  // ── Sync session & verify token with backend ──────────────────────────────
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      authAPI.getMe()
        .then(res => {
          if (res && res.user) {
            setCurrentUser(res.user);
          }
        })
        .catch(() => {
          // Token không hợp lệ hoặc hết hạn
          localStorage.removeItem(TOKEN_KEY);
          sessionStorage.removeItem(TOKEN_KEY);
          setCurrentUser(null);
        });
    }
  }, []);

  // ── Open helpers ─────────────────────────────────────────────────────────
  const openLogin = useCallback(() => {
    setAuthMode('login');
    setIsAuthOpen(true);
  }, []);

  const openRegister = useCallback(() => {
    setAuthMode('register');
    setPendingUser(null);
    setIsAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsAuthOpen(false);
    setPendingUser(null);
  }, []);

  // ── Register Step 1: Thu thập thông tin ──────────────────────────────────
  const submitRegister = useCallback((formData) => {
    const draft = {
      ...formData,
      role: 'client',
      verified: false,
    };
    setPendingUser(draft);
    setAuthMode('confirm'); // Bước 2: Xác nhận thông tin
    return { ok: true };
  }, []);

  // ── Register Step 2: Xác nhận & Lưu vào Database ─────────────────────────
  const confirmRegister = useCallback(async () => {
    if (!pendingUser) return { error: 'Không có dữ liệu đăng ký' };

    try {
      const res = await authAPI.register(pendingUser);
      if (res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
      }
      setCurrentUser(res.user);
      setIsAuthOpen(false);
      setPendingUser(null);
      return { ok: true, user: res.user };
    } catch (err) {
      return { error: err.message || 'Lỗi đăng ký tài khoản vào database' };
    }
  }, [pendingUser]);

  // ── Login qua Database REST API ──────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
      }
      setCurrentUser(res.user);
      setIsAuthOpen(false);
      return { ok: true, user: res.user };
    } catch (err) {
      return { error: err.message || 'Email hoặc mật khẩu không chính xác.' };
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
  }, []);

  // ── Update profile trong Database ────────────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    try {
      const res = await authAPI.updateProfile(updates);
      if (res.user) {
        setCurrentUser(res.user);
      }
      return { ok: true, user: res.user };
    } catch (err) {
      return { error: err.message };
    }
  }, []);

  // ── Admin helpers ─────────────────────────────────────────────────────────
  const isAdmin = currentUser?.role === 'admin';
  const isLoggedIn = !!currentUser;

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoggedIn,
      isAdmin,
      users: [],
      isAuthOpen,
      authMode,
      setAuthMode,
      pendingUser,
      openLogin,
      openRegister,
      closeAuth,
      submitRegister,
      confirmRegister,
      login,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng bên trong AuthProvider');
  return ctx;
};

export default AuthContext;
