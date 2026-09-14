import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../data/foods';

const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    closeCheckout,
    cart,
    cartSubtotal,
    deliveryFee,
    voucherDiscount,
    tax,
    cartTotal,
    appliedVoucher,
    placeOrder,
    currentUser
  } = useCart();

  const [step, setStep] = useState(1); // 1: Info, 2: Payment
  const [formData, setFormData] = useState({
    name: currentUser.name || 'Nguyễn Hải Đăng',
    phone: currentUser.phone || '0912.345.678',
    address: currentUser.address || '720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP.HCM',
    note: '',
    deliveryType: 'now', // 'now' or 'scheduled'
    scheduledTime: '12:30 Hôm nay',
    paymentMethod: 'vietqr' // 'cod', 'vietqr', 'card'
  });

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = () => {
    // Fire confetti effect
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#e11d48', '#f59e0b', '#10b981', '#6366f1']
      });
    } catch (e) {
      // Confetti fallback
    }

    placeOrder(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeCheckout}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden z-10 border border-gray-100 dark:border-gray-800 flex flex-col max-h-[92vh]"
      >
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="font-black text-lg text-gray-900 dark:text-white">
                {step === 1 ? 'Thông Tin Giao Hàng' : 'Phương Thức Thanh Toán'}
              </h3>
              <p className="text-xs text-gray-400">
                Bước {step} / 2 • Đảm bảo bảo mật &amp; giao hàng chuẩn xác
              </p>
            </div>
          </div>

          <button
            onClick={closeCheckout}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {step === 1 ? (
            /* STEP 1: Delivery Information */
            <div className="space-y-4">
              
              {/* Delivery Timing Options */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setFormData({ ...formData, deliveryType: 'now' })}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.deliveryType === 'now'
                      ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Giao Siêu Tốc</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Giao ngay trong 20 - 25 phút
                  </p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, deliveryType: 'scheduled' })}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.deliveryType === 'scheduled'
                      ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Hẹn Giờ Giao</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Chọn thời gian bạn muốn nhận
                  </p>
                </div>
              </div>

              {/* Recipient Full Name */}
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1.5">
                  Họ và tên người nhận *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="VD: Nguyễn Hải Đăng"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1.5">
                  Số điện thoại nhận hàng *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="VD: 0912.345.678"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1.5">
                  Địa chỉ giao hàng chi tiết *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={2}
                    placeholder="Số nhà, tên đường, toà nhà, phường, quận..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold outline-none focus:border-orange-500 text-gray-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1.5">
                  Ghi chú cho shipper (Tùy chọn)
                </label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="VD: Gọi trước khi giao, gửi tại sảnh lễ tân..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-xs outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                />
              </div>

            </div>
          ) : (
            /* STEP 2: Payment Method */
            <div className="space-y-4">
              
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                Chọn hình thức thanh toán
              </label>

              {/* VietQR Bank Transfer Option */}
              <div
                onClick={() => setFormData({ ...formData, paymentMethod: 'vietqr' })}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  formData.paymentMethod === 'vietqr'
                    ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                      Chuyển Khoản Nhanh VietQR (Khuyên Dùng)
                    </h4>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                      Tự động xác nhận
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Quét mã QR qua mọi ứng dụng Ngân hàng (MB, VCB, Techcombank, MoMo, ZaloPay).
                  </p>
                </div>
              </div>

              {/* Cash On Delivery Option */}
              <div
                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  formData.paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                    Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Kiểm tra món ăn nóng hổi trước khi thanh toán cho tài xế.
                  </p>
                </div>
              </div>

              {/* Credit/Debit Card Option */}
              <div
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  formData.paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                    Thẻ Quốc Tế Visa / Mastercard / JCB
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Bảo mật 3D Secure, thanh toán không chạm tiện lợi.
                  </p>
                </div>
              </div>

              {/* Mini Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-800/80 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs space-y-2">
                <div className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Tóm Tắt Đơn Hàng ({cart.length} món)
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Mã {appliedVoucher.code}:</span>
                    <span>-{formatCurrency(voucherDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Phí giao hàng:</span>
                  <span>{deliveryFee === 0 ? 'Miễn phí' : formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-gray-900 dark:text-white pt-1 border-t border-gray-200 dark:border-gray-700">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-orange-600 dark:text-orange-400">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-gray-50 dark:bg-gray-800/90 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
          <div className="text-xs">
            <div className="text-gray-400">Tổng thanh toán</div>
            <div className="text-lg font-black text-orange-600 dark:text-orange-400">
              {formatCurrency(cartTotal)}
            </div>
          </div>

          {step === 1 ? (
            <button
              onClick={() => {
                if (!formData.name || !formData.phone || !formData.address) {
                  alert('Vui lòng điền đầy đủ Tên, Số điện thoại và Địa chỉ nhận hàng!');
                  return;
                }
                setStep(2);
              }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl shadow-orange-500/30 transition-all"
            >
              <span>Tiếp Tục Chọn Thanh Toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirmOrder}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 via-orange-600 to-rose-500 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Xác Nhận Đặt Món Ngay</span>
            </motion.button>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default CheckoutModal;
