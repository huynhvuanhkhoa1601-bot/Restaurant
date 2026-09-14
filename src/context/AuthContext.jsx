/**
 * =========================================================================
 * 🔐 HỆ THỐNG QUẢN LÝ TÀI KHOẢN (Authentication Context)
 * - Lưu thông tin khách hàng lên Supabase khi đăng ký
 * - Phân quyền: admin | client
 * - Quy trình: Đăng ký → Xác nhận thông tin → Đăng nhập
 * =========================================================================
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { supabase } from '../lib/supabase';

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

  // ── Sync session ──────────────────────────────────────────────────────────
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
          if (res && res.user) setCurrentUser(res.user);
        })
        .catch(() => {
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
    setAuthMode('confirm');
    return { ok: true };
  }, []);

  // ── Register Step 2: Xác nhận & Lưu lên Supabase ─────────────────────────
  const confirmRegister = useCallback(async () => {
    if (!pendingUser) return { error: 'Không có dữ liệu đăng ký' };

    try {
      // 1. Lưu vào backend REST API (SQLite) để lấy JWT token
      const res = await authAPI.register(pendingUser);
      if (res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
      }

      // 2. Đồng thời lưu thông tin khách hàng lên Supabase
      const userId = res.user?.id || `user-${Date.now()}`;
      const { error: supabaseError } = await supabase
        .from('users')
        .upsert({
          id: userId,
          name: pendingUser.name || '',
          email: (pendingUser.email || '').toLowerCase().trim(),
          password_hash: `[hashed_via_api]`,
          phone: pendingUser.phone || '',
          address: pendingUser.address || '',
          role: 'client',
          avatar: null,
          verified: true,
        }, { onConflict: 'email', ignoreDuplicates: false });

      if (supabaseError) {
        console.warn('⚠️ Lưu Supabase thất bại (dữ liệu đã lưu vào SQLite):', supabaseError.message);
      } else {
        console.log('✅ Đã lưu thông tin khách hàng lên Supabase thành công!');
      }

      setCurrentUser(res.user);
      setIsAuthOpen(false);
      setPendingUser(null);
      return { ok: true, user: res.user };
    } catch (err) {
      return { error: err.message || 'Lỗi đăng ký tài khoản' };
    }
  }, [pendingUser]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
      }

      // Đồng bộ thông tin user lên Supabase khi đăng nhập thành công
      if (res.user) {
        try {
          await supabase
            .from('users')
            .upsert({
              id: res.user.id?.toString() || `user-${Date.now()}`,
              name: res.user.name || '',
              email: (res.user.email || email).toLowerCase().trim(),
              phone: res.user.phone || '',
              address: res.user.address || '',
              role: res.user.role || 'client',
              avatar: res.user.avatar || null,
              verified: true,
            }, { onConflict: 'email', ignoreDuplicates: false });
          console.log('✅ Đồng bộ user lên Supabase khi đăng nhập thành công');
        } catch (supErr) {
          console.warn('⚠️ Không thể đồng bộ Supabase:', supErr.message);
        }
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

  // ── Update profile (cũng cập nhật Supabase) ──────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    try {
      const res = await authAPI.updateProfile(updates);
      if (res.user) {
        setCurrentUser(res.user);

        // Cập nhật đồng thời trên Supabase
        if (res.user.id) {
          await supabase
            .from('users')
            .update({
              name: res.user.name,
              phone: res.user.phone,
              address: res.user.address,
              avatar: res.user.avatar,
            })
            .eq('id', res.user.id);
        }
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
