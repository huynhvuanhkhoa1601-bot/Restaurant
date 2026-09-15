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
  ChevronLeft,
  Utensils,
  AlertCircle,
  Calendar
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
    currentUser,
    diningMode,
    setDiningMode,
    selectedTable,
    openTableQR
  } = useCart();

  const [step, setStep] = useState(1); // 1: Info, 2: Payment
  const isDineIn = diningMode === 'dine_in';
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
    deliveryType: 'now', // 'now' or 'scheduled'
    scheduledTime: '',
    paymentMethod: 'vietqr' // 'cod', 'vietqr', 'card'
  });

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = () => {
    if (isDineIn && !selectedTable) {
      openTableQR();
      return;
    }

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

    placeOrder({
      ...formData,
      orderType: diningMode,
      tableNumber: selectedTable?.name || null
    });
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
            /* STEP 1: Delivery Information OR Dine-in Table Information */
            <div className="space-y-4">

              {/* Mode Switcher */}
              <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDiningMode('delivery')}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    !isDineIn
                      ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>🛵 Giao Tận Nơi</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDiningMode('dine_in');
                    if (!selectedTable) openTableQR();
                  }}
                  className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    isDineIn
                      ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>🍽️ Dùng Tại Bàn (QR)</span>
                </button>
              </div>

              {isDineIn ? (
                /* DINE-IN TABLE FORM */
                <div className="space-y-4">
                  {/* Table Selection Banner */}
                  {selectedTable ? (
                    <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 p-4 rounded-2xl border-2 border-emerald-400 dark:border-emerald-600/50 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0">
                          {selectedTable.code}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm sm:text-base text-gray-900 dark:text-white">
                              {selectedTable.name} • {selectedTable.floor}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                              0đ Phí Ship
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {selectedTable.area} • {selectedTable.capacity}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={openTableQR}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs hover:bg-emerald-50 border border-emerald-200 dark:border-emerald-700/60 shadow-sm transition-all shrink-0 flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Đổi Bàn</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border-2 border-dashed border-orange-400 text-center space-y-2">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                        <AlertCircle className="w-4 h-4" />
                        <span>Quý khách chưa chọn số bàn ăn tại quán</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Vui lòng quét mã QR dán trên bàn của bạn hoặc bấm nút chọn bàn nhanh bên dưới:
                      </p>
                      <button
                        type="button"
                        onClick={openTableQR}
                        className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl text-xs font-bold shadow-md hover:brightness-110 transition-all inline-flex items-center gap-2"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>📷 Quét Mã QR Hoặc Chọn Bàn Ngay</span>
                      </button>
                    </div>
                  )}

                  {/* Customer Name */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1.5">
                      Tên khách hàng / Đại diện bàn (Tùy chọn)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập tên của bạn hoặc đại diện bàn"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold outline-none focus:border-orange-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1.5">
                      Số điện thoại (Nhận hóa đơn điện tử / Tích điểm)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại (tùy chọn)"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold outline-none focus:border-orange-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Kitchen / Service Note */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1.5">
                      Ghi chú cho Bếp &amp; Phục vụ tại bàn (Tùy chọn)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={2}
                      placeholder="VD: Ít cay, không hành tây, mang đồ uống lên trước, xin thêm đá lạnh..."
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-xs sm:text-sm outline-none focus:border-orange-500 text-gray-900 dark:text-white resize-none"
                    />
                  </div>
                </div>
              ) : (
                /* DELIVERY FORM */
                <div className="space-y-4">
                  {/* Delivery Timing Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'now', scheduledTime: '' }))}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.deliveryType === 'now'
                          ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
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
                      onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'scheduled' }))}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.deliveryType === 'scheduled'
                          ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
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

                  {/* Scheduled Delivery Time Input when Hẹn Giờ Giao is chosen */}
                  {formData.deliveryType === 'scheduled' && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Thời gian hẹn giao hàng *</span>
                        </label>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                          (Nhà hàng chuẩn bị trước 30p)
                        </span>
                      </div>

                      <div className="relative">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="scheduledTime"
                          value={formData.scheduledTime}
                          onChange={handleChange}
                          placeholder="Nhập giờ bạn muốn nhận (VD: 18:30 Tối nay, 11:30 Trưa mai...)"
                          required={formData.deliveryType === 'scheduled'}
                          className="w-full bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-amber-500 text-gray-900 dark:text-white placeholder:text-gray-400 placeholder:font-normal"
                        />
                      </div>

                      {/* Quick preset buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[10px] font-bold text-gray-400">Chọn nhanh:</span>
                        {['+45 phút', '+1 giờ', '+2 giờ', '18:30 Tối nay', '11:30 Trưa mai'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, scheduledTime: preset }))}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                              formData.scheduledTime === preset
                                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                                : 'bg-white dark:bg-gray-800 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

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
                        placeholder="Nhập họ và tên người nhận hàng"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold outline-none focus:border-orange-500 text-gray-900 dark:text-white placeholder:text-gray-400"
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
                        placeholder="Nhập số điện thoại (VD: 0912345678)"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold outline-none focus:border-orange-500 text-gray-900 dark:text-white placeholder:text-gray-400"
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
                        placeholder="Nhập địa chỉ giao hàng (số phòng, căn hộ, toà nhà, đường, phường, quận...)"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold outline-none focus:border-orange-500 text-gray-900 dark:text-white resize-none placeholder:text-gray-400"
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
                      placeholder="VD: Gọi trước khi giao, gửi bảo vệ, bấm chuông..."
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-xs outline-none focus:border-orange-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

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

              {/* Cash On Delivery / At Table Option */}
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
                    {isDineIn ? 'Thanh Toán Tại Bàn Sau Khi Ăn' : 'Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {isDineIn 
                      ? 'Thanh toán tiền mặt hoặc yêu cầu quẹt thẻ khi nhân viên mang hóa đơn đến bàn.'
                      : 'Kiểm tra món ăn nóng hổi trước khi thanh toán cho tài xế.'}
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
                if (isDineIn) {
                  if (!selectedTable) {
                    openTableQR();
                    return;
                  }
                } else {
                  if (!formData.name?.trim() || !formData.phone?.trim() || !formData.address?.trim()) {
                    alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
                    return;
                  }
                  if (formData.deliveryType === 'scheduled' && !formData.scheduledTime?.trim()) {
                    alert('Vui lòng chọn hoặc nhập thời gian bạn muốn nhận hàng!');
                    return;
                  }
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
