import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Check, 
  Truck, 
  AlertCircle,
  Percent,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency, vouchers } from '../data/foods';

const CartModal = () => {
  const {
    isCartOpen,
    closeCart,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    voucherDiscount,
    tax,
    cartTotal,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    openCheckout
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  // Free shipping progress logic (Free shipping at >= 200k)
  const freeShipThreshold = 200000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShipThreshold) * 100));
  const remainingForFreeShip = Math.max(0, freeShipThreshold - cartSubtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyVoucher(couponInput);
    if (success) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Slide-over Drawer Content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-screen max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col justify-between border-l border-gray-100 dark:border-gray-800"
        >
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                  Giỏ Hàng Của Bạn
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {cart.length} loại món ăn đã chọn
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="bg-orange-50/80 dark:bg-orange-950/40 p-4 border-b border-orange-100 dark:border-orange-900/30">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                  <Truck className="w-4 h-4" />
                  {remainingForFreeShip === 0 
                    ? '🎉 Bạn đã đủ điều kiện Miễn Phí Giao Hàng!' 
                    : `Mua thêm ${formatCurrency(remainingForFreeShip)} để được FREESHIP!`}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Items List (Scrollable Area) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-3.5 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 relative group"
                >
                  {/* Item Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                        title="Xóa món"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customization Details: Size & Toppings */}
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 space-y-0.5">
                      {item.selectedSize && (
                        <div>• Size: <strong>{item.selectedSize.name}</strong></div>
                      )}
                      {item.selectedToppings && item.selectedToppings.length > 0 && (
                        <div className="truncate">
                          • Toppings: {item.selectedToppings.map(t => t.name).join(', ')}
                        </div>
                      )}
                      {item.notes && (
                        <div className="text-orange-600 dark:text-orange-400 italic truncate">
                          • Note: "{item.notes}"
                        </div>
                      )}
                    </div>

                    {/* Price and Quantity Stepper */}
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-sm font-extrabold text-orange-600 dark:text-orange-400">
                        {formatCurrency(item.totalPrice)}
                      </span>

                      <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              /* Empty Cart State */
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-24 h-24 rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-5xl mb-4">
                  🛍️
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Giỏ hàng của bạn đang trống
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mb-6">
                  Hãy khám phá thực đơn thơm ngon và chọn ngay món yêu thích của bạn nhé!
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all"
                >
                  Khám Phá Món Ngon Ngay
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer: Voucher, Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 space-y-4 shadow-2xl">
              
              {/* Voucher Form */}
              <div>
                {appliedVoucher ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-extrabold text-emerald-800 dark:text-emerald-200">
                          Mã: {appliedVoucher.code}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 ml-1.5">
                          (-{formatCurrency(voucherDiscount)})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={removeVoucher}
                      className="text-rose-500 font-bold hover:underline"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập mã voucher (VD: FEAST50)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs font-semibold uppercase outline-none focus:border-orange-500 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      Áp Dụng
                    </button>
                  </form>
                )}
              </div>

              {/* Cost Summary Breakdown */}
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                <div className="flex justify-between">
                  <span>Tạm tính ({cart.length} món):</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Phí giao hàng:</span>
                  <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                    {deliveryFee === 0 ? 'MIỄN PHÍ' : formatCurrency(deliveryFee)}
                  </span>
                </div>

                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Giảm giá Voucher:</span>
                    <span>-{formatCurrency(voucherDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Thuế VAT (5%):</span>
                  <span>{formatCurrency(tax)}</span>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between items-center text-sm font-black text-gray-900 dark:text-white">
                  <span>Tổng Thanh Toán:</span>
                  <span className="text-xl text-orange-600 dark:text-orange-400">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openCheckout}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-rose-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center gap-2 transition-all"
              >
                <span>Tiến Hành Thanh Toán</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default CartModal;
