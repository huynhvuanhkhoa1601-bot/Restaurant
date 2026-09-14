import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Mail, Phone, MapPin, ShieldCheck, 
  CheckCircle2, Save, Crown, Sparkles, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const UserProfileModal = () => {
  const { currentUser, updateProfile, isAdmin } = useAuth();
  const { isProfileOpen, closeProfile, showToast } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
      });
      setError('');
      setSuccess(false);
    }
  }, [currentUser, isProfileOpen]);

  if (!isProfileOpen || !currentUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });

      if (res && res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        if (showToast) {
          showToast('Cập nhật thông tin hồ sơ thành công!', 'success');
        }
        setTimeout(() => {
          setSuccess(false);
          closeProfile();
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi cập nhật hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeProfile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative bg-white dark:bg-[#0f172a] rounded-3xl w-full max-w-lg shadow-2xl z-10 border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          {/* Top gradient bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500" />

          {/* Close button */}
          <button
            onClick={closeProfile}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header / Avatar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
              <div className="relative">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-orange-500/20 shadow-md"
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md ${isAdmin ? 'bg-gradient-to-br from-purple-600 to-indigo-700 ring-4 ring-purple-500/20' : 'bg-gradient-to-br from-orange-500 to-rose-600 ring-4 ring-orange-500/20'}`}>
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {isAdmin && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-gray-900 rounded-full p-1 shadow-md" title="Quản trị viên">
                    <Crown className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white truncate">
                    {currentUser.name}
                  </h3>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${isAdmin ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300' : 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300'}`}>
                    {isAdmin ? 'Quản Trị Viên' : 'Khách Hàng'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                  {currentUser.email}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tài khoản đã xác thực
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                  Họ và Tên <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all"
                    placeholder="Nhập họ và tên..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                  Địa Chỉ Email (Không thể đổi)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                  Số Điện Thoại Giao Hàng
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all"
                    placeholder="Ví dụ: 0912 345 678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                  Địa Chỉ Giao Hàng Mặc Định
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:text-white transition-all resize-none"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 px-3 py-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-3 py-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Cập nhật thông tin thành công!
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeProfile}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Save className="w-4 h-4" /> Lưu Thay Đổi</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserProfileModal;
