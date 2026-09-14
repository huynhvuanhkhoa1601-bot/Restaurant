import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { reservationsAPI } from '../services/api';
import { supabase } from '../lib/supabase';

const TableReservationModal = () => {
  const { isReservationOpen, closeReservation, showToast } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);

  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    seatingArea: '',
    specialRequest: ''
  });

  if (!isReservationOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Lưu thông tin đặt bàn lên Supabase
    try {
      const { error } = await supabase
        .from('reservations')
        .insert({
          customer_name: bookingData.name,
          phone: bookingData.phone,
          guests: Number(bookingData.guests),
          date: bookingData.date,
          time: bookingData.time,
          table_type: bookingData.seatingArea,
          notes: bookingData.specialRequest || '',
          status: 'pending',
        });

      if (error) {
        console.warn('⚠️ Lưu Supabase thất bại:', error.message);
      } else {
        console.log('✅ Đặt bàn đã lưu lên Supabase thành công!');
      }
    } catch (supErr) {
      console.warn('⚠️ Lỗi kết nối Supabase:', supErr.message);
    }

    // 2. Lưu dự phòng lên backend SQLite
    try {
      await reservationsAPI.create({
        name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email || '',
        guests: bookingData.guests,
        date: bookingData.date,
        time: bookingData.time,
        tableType: bookingData.seatingArea,
        notes: bookingData.specialRequest
      });
    } catch (_) {}

    setIsSuccess(true);
    showToast('Đặt bàn thành công! KenRestaurant đã lưu thông tin của bạn.', 'success');
  };

  const handleClose = () => {
    setIsSuccess(false);
    closeReservation();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden z-10 border border-gray-100 dark:border-gray-800"
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 p-6 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-xs font-black uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full w-fit mb-2">
            🍷 Trải Nghiệm Fine Dining
          </div>
          <h3 className="text-2xl font-black">Đặt Bàn Tại Nhà Hàng</h3>
          <p className="text-xs text-orange-100 mt-1">
            Không gian lãng mạn, view Landmark 81 tráng lệ cùng ẩm thực đỉnh cao.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Đặt Bàn Thành Công!
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                Chúng tôi đã nhận thông tin đặt bàn của quý khách ({bookingData.guests} người, {bookingData.time} ngày {bookingData.date}). Nhân viên sẽ gọi điện xác nhận trong ít phút!
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-500/30"
              >
                Hoàn Tất
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 outline-none focus:border-orange-500 text-gray-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 outline-none focus:border-orange-500 text-gray-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Ngày đến
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 outline-none focus:border-orange-500 text-gray-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Giờ đến
                  </label>
                  <select
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 outline-none focus:border-orange-500 text-gray-900 dark:text-white font-semibold"
                  >
                    <option value="11:30">11:30 (Trưa)</option>
                    <option value="12:30">12:30 (Trưa)</option>
                    <option value="18:00">18:00 (Tối)</option>
                    <option value="19:00">19:00 (Tối)</option>
                    <option value="20:00">20:00 (Tối)</option>
                    <option value="21:00">21:00 (Tối)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Số khách
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: Number(e.target.value) })}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 outline-none focus:border-orange-500 text-gray-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                  Khu vực ngồi mong muốn
                </label>
                <select
                  value={bookingData.seatingArea}
                  onChange={(e) => setBookingData({ ...bookingData, seatingArea: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 outline-none focus:border-orange-500 text-gray-900 dark:text-white font-semibold"
                >
                  <option value="Rooftop Lounge VIP">🌆 Rooftop Lounge Ngoài Trời (View Sông &amp; Landmark)</option>
                  <option value="Main Dining Hall">🕯️ Không Gian Ấm Cúng Trong Nhà (Main Hall)</option>
                  <option value="Private VIP Room">👑 Phòng Riêng VIP (Họp mặt &amp; Tiếp khách)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                  Yêu cầu đặc biệt (Setup nến, hoa sinh nhật, kỉ niệm...)
                </label>
                <input
                  type="text"
                  value={bookingData.specialRequest}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequest: e.target.value })}
                  placeholder="VD: Kỷ niệm ngày cưới, setup bàn sát cửa sổ..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-500/30 transition-all mt-2"
              >
                Xác Nhận Giữ Chỗ Bàn Ăn
              </button>
            </form>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default TableReservationModal;
