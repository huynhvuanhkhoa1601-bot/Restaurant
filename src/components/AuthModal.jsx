/**
 * =========================================================================
 * 🔐 GIAO DIỆN ĐĂNG KÝ / ĐĂNG NHẬP (Auth Modal)
 * Quy trình Client: Bước 1 Nhập Thông Tin → Bước 2 Xác Nhận → Đăng Nhập
 * Admin: Đăng nhập với tài khoản đặc quyền → Giao diện quản trị
 * =========================================================================
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Eye, EyeOff, User, Lock, Mail, Phone, MapPin,
  ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft,
  Crown, ChefHat, Sparkles, AlertCircle, LogIn,
  UserPlus, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Input Component ─────────────────────────────────────────────────────────
const FormInput = ({ icon: Icon, label, type = 'text', value, onChange, placeholder, required, hint }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pr-4 text-sm font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all ${Icon ? 'pl-10' : 'pl-4'}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {hint && <p className="text-[11px] text-gray-400 mt-1 pl-1">{hint}</p>}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AuthModal = () => {
  const {
    isAuthOpen, authMode, setAuthMode, pendingUser,
    closeAuth, submitRegister, confirmRegister, login,
    openRegister, isAdmin
  } = useAuth();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Register form
  const [registerData, setRegisterData] = useState({
    name: '', email: '', phone: '', address: '', password: '', confirmPassword: ''
  });

  const clearError = () => setError('');

  // ── Login submit ──────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    const result = await login(loginData.email, loginData.password);
    setLoading(false);
    if (result && result.error) setError(result.error);
  };

  // ── Register submit ───────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    clearError();
    if (registerData.password !== registerData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (registerData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    setLoading(true);
    const { confirmPassword, ...rest } = registerData;
    const result = submitRegister(rest);
    setLoading(false);
    if (result && result.error) setError(result.error);
  };

  // ── Confirm submit ────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    setLoading(true);
    const result = await confirmRegister();
    setLoading(false);
    if (result && result.error) setError(result.error);
  };

  if (!isAuthOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuth}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl z-10 border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          {/* Top gradient bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500" />

          {/* Close button */}
          <button
            onClick={closeAuth}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-8">

            {/* ─── LOGIN MODE ────────────────────────────────────────────── */}
            {authMode === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                {/* Header */}
                <div className="text-center mb-7">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/30">
                    <LogIn className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Chào Mừng Trở Lại!</h2>
                  <p className="text-xs text-gray-400 mt-1">Đăng nhập để đặt món và theo dõi đơn hàng</p>
                </div>

                {/* Role tabs */}
                <div className="flex gap-2 mb-5 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
                  <button
                    onClick={() => { setAuthMode('login'); clearError(); }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" /> Khách Hàng
                  </button>
                  <button
                    onClick={() => { setAuthMode('admin'); clearError(); setLoginData({ email: 'admin@kenrestaurant.vn', password: '' }); }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Crown className="w-3.5 h-3.5" /> Admin
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <FormInput
                    icon={Mail} label="Email" type="email" required
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="email@kenrestaurant.vn"
                  />
                  <FormInput
                    icon={Lock} label="Mật khẩu" type="password" required
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Nhập mật khẩu..."
                  />

                  {error && (
                    <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 px-3 py-2.5 rounded-xl">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><LogIn className="w-4 h-4" /> Đăng Nhập</>
                    )}
                  </button>
                </form>

                <div className="mt-5 text-center text-xs text-gray-400">
                  Chưa có tài khoản?{' '}
                  <button
                    onClick={() => { setAuthMode('register'); clearError(); }}
                    className="font-extrabold text-orange-500 hover:text-orange-600 underline"
                  >
                    Đăng ký ngay miễn phí →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── ADMIN LOGIN MODE ─────────────────────────────────────── */}
            {authMode === 'admin' && (
              <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="text-center mb-7">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/30">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Cổng Quản Trị Viên</h2>
                  <p className="text-xs text-gray-400 mt-1">Chỉ dành cho nhân viên KenRestaurant</p>
                </div>

                {/* Role tabs */}
                <div className="flex gap-2 mb-5 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
                  <button
                    onClick={() => { setAuthMode('login'); clearError(); setLoginData({ email: '', password: '' }); }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" /> Khách Hàng
                  </button>
                  <button
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5" /> Admin
                  </button>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/30 rounded-2xl px-4 py-3 mb-4 flex items-center gap-2.5 border border-purple-200/50 dark:border-purple-800/50">
                  <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-purple-700 dark:text-purple-300">Tài khoản Admin mặc định</p>
                    <p className="text-[11px] text-purple-500">Email: admin@kenrestaurant.vn</p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <FormInput
                    icon={Mail} label="Email Admin" type="email" required
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="admin@kenrestaurant.vn"
                  />
                  <FormInput
                    icon={Lock} label="Mật khẩu Admin" type="password" required
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Admin@2024"
                    hint="Mật khẩu Admin mặc định: Admin@2024"
                  />

                  {error && (
                    <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 px-3 py-2.5 rounded-xl">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold text-sm shadow-xl shadow-purple-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Crown className="w-4 h-4" /> Truy Cập Quản Trị</>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ─── REGISTER MODE (Bước 1) ───────────────────────────────── */}
            {authMode === 'register' && (
              <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                {/* Progress indicator */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">1</div>
                    <span className="text-xs font-bold text-orange-500">Nhập Thông Tin</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 text-xs font-black flex items-center justify-center">2</div>
                    <span className="text-xs text-gray-400">Xác Nhận</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 text-xs font-black flex items-center justify-center">3</div>
                    <span className="text-xs text-gray-400">Hoàn tất</span>
                  </div>
                </div>

                <div className="mb-5">
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Tạo Tài Khoản Mới</h2>
                  <p className="text-xs text-gray-400 mt-1">Đăng ký để đặt món và nhận ưu đãi độc quyền</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                  <FormInput
                    icon={User} label="Họ và Tên" required
                    value={registerData.name}
                    onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                  />
                  <FormInput
                    icon={Mail} label="Email" type="email" required
                    value={registerData.email}
                    onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="email@gmail.com"
                  />
                  <FormInput
                    icon={Phone} label="Số Điện Thoại" required
                    value={registerData.phone}
                    onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="0912 345 678"
                  />
                  <FormInput
                    icon={MapPin} label="Địa Chỉ Giao Hàng"
                    value={registerData.address}
                    onChange={e => setRegisterData({ ...registerData, address: e.target.value })}
                    placeholder="Số nhà, đường, phường, quận..."
                  />
                  <FormInput
                    icon={Lock} label="Mật Khẩu" type="password" required
                    value={registerData.password}
                    onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Tối thiểu 6 ký tự"
                    hint="Mật khẩu phải có ít nhất 6 ký tự"
                  />
                  <FormInput
                    icon={Lock} label="Xác Nhận Mật Khẩu" type="password" required
                    value={registerData.confirmPassword}
                    onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu..."
                  />

                  {error && (
                    <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 px-3 py-2.5 rounded-xl">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Tiếp Theo: Xác Nhận Thông Tin <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>

                <div className="mt-4 text-center text-xs text-gray-400">
                  Đã có tài khoản?{' '}
                  <button
                    onClick={() => { setAuthMode('login'); clearError(); }}
                    className="font-extrabold text-orange-500 hover:text-orange-600 underline"
                  >
                    Đăng nhập ngay →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── CONFIRM MODE (Bước 2) ────────────────────────────────── */}
            {authMode === 'confirm' && pendingUser && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                {/* Progress indicator */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs text-emerald-500 font-bold">Nhập Thông Tin</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-orange-400" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">2</div>
                    <span className="text-xs font-bold text-orange-500">Xác Nhận</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 text-xs font-black flex items-center justify-center">3</div>
                    <span className="text-xs text-gray-400">Hoàn tất</span>
                  </div>
                </div>

                <div className="mb-5">
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Xác Nhận Thông Tin</h2>
                  <p className="text-xs text-gray-400 mt-1">Vui lòng kiểm tra lại thông tin trước khi tạo tài khoản</p>
                </div>

                {/* Info summary card */}
                <div className="bg-orange-50 dark:bg-orange-950/30 rounded-2xl p-4 mb-5 space-y-3 border border-orange-200/60 dark:border-orange-800/40">
                  {[
                    { icon: User, label: 'Họ và tên', value: pendingUser.name },
                    { icon: Mail, label: 'Email', value: pendingUser.email },
                    { icon: Phone, label: 'Điện thoại', value: pendingUser.phone },
                    { icon: MapPin, label: 'Địa chỉ', value: pendingUser.address || 'Chưa nhập' },
                    { icon: ShieldCheck, label: 'Phân quyền', value: 'Khách Hàng (Client)' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-medium">{label}</p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setAuthMode('register'); clearError(); }}
                    className="flex-1 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Sửa Lại
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="flex-2 flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> Xác Nhận & Tạo Tài Khoản</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
