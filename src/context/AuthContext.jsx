/**
 * =========================================================================
 * 🔐 HỆ THỐNG QUẢN LÝ TÀI KHOẢN (Authentication Context)
 * - Lưu trữ dữ liệu bằng localStorage (không cần backend)
 * - Phân quyền: admin | client
 * - Quy trình: Đăng ký → Xác nhận thông tin → Đăng nhập
 * =========================================================================
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// ─── Tài khoản Admin mặc định (seed data) ───────────────────────────────────
const SEED_ADMIN = {
  id: 'admin-001',
  name: 'KenRestaurant Admin',
  email: 'admin@kenrestaurant.vn',
  password: 'Admin@2024',      // Trong thực tế cần hash, đây là demo
  phone: '0334756330',
  address: '133/50/4 Cống Lở, P.15, Q.Tân Bình, TP.HCM',
  role: 'admin',
  avatar: null,
  verified: true,
  createdAt: new Date().toISOString(),
};

const STORAGE_KEY = 'kenrestaurant_users';
const SESSION_KEY = 'kenrestaurant_session';

// ─── Helpers ────────────────────────────────────────────────────────────────
const loadUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  // Seed admin nếu chưa có dữ liệu
  const initial = [SEED_ADMIN];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const loadSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
};

const saveSession = (user) => {
  if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else sessionStorage.removeItem(SESSION_KEY);
};

// ─── Provider ───────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(loadUsers);
  const [currentUser, setCurrentUser] = useState(loadSession);

  // Modal state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'confirm' | 'admin'

  // Register multi-step data
  const [pendingUser, setPendingUser] = useState(null);

  // ── Sync session ──────────────────────────────────────────────────────────
  useEffect(() => {
    saveSession(currentUser);
  }, [currentUser]);

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

  // ── Register Step 1: thu thập info ───────────────────────────────────────
  const submitRegister = useCallback((formData) => {
    const { email } = formData;
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'Email này đã được đăng ký. Vui lòng dùng email khác.' };
    }

    const draft = {
      id: `user-${Date.now()}`,
      ...formData,
      role: 'client',
      verified: false,
      createdAt: new Date().toISOString(),
    };

    setPendingUser(draft);
    setAuthMode('confirm'); // Bước 2: Xác nhận thông tin
    return { ok: true };
  }, [users]);

  // ── Register Step 2: xác nhận & lưu ─────────────────────────────────────
  const confirmRegister = useCallback(() => {
    if (!pendingUser) return;

    const confirmed = { ...pendingUser, verified: true };
    const updated = [...users, confirmed];
    setUsers(updated);
    saveUsers(updated);
    setCurrentUser(confirmed);
    setIsAuthOpen(false);
    setPendingUser(null);
    return { ok: true };
  }, [pendingUser, users]);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback((email, password) => {
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { error: 'Email hoặc mật khẩu không đúng.' };
    if (!found.verified) return { error: 'Tài khoản chưa được xác nhận.' };

    setCurrentUser(found);
    setIsAuthOpen(false);
    return { ok: true, user: found };
  }, [users]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setCurrentUser(null);
    saveSession(null);
  }, []);

  // ── Update profile ────────────────────────────────────────────────────────
  const updateProfile = useCallback((updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    const updatedUsers = users.map(u => u.id === updated.id ? updated : u);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  }, [currentUser, users]);

  // ── Admin helpers ─────────────────────────────────────────────────────────
  const isAdmin = currentUser?.role === 'admin';
  const isLoggedIn = !!currentUser;

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoggedIn,
      isAdmin,
      users,
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
