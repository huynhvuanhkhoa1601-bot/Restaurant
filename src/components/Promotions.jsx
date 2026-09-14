import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Tag, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  Gift, 
  ArrowRight, 
  Percent, 
  Truck 
} from 'lucide-react';
import { vouchers } from '../data/foods';
import { useCart } from '../context/CartContext';

const Promotions = () => {
  const { applyVoucher, openCart } = useCart();
  const [copiedCode, setCopiedCode] = useState(null);

  // Flash deal countdown timer simulator
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 5, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyVoucher(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const formatTime = (num) => String(num).padStart(2, '0');

  return (
    <section id="promotions" className="py-12 bg-white/50 dark:bg-gray-900/40 relative border-y border-gray-100 dark:border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-xs sm:text-sm tracking-wider uppercase mb-1">
              <Gift className="w-4 h-4" />
              <span>Ưu Đãi Độc Quyền Hôm Nay</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Mã Giảm Giá &amp; Voucher Hấp Dẫn
            </h2>
          </div>

          {/* Flash Deal Countdown Banner */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-transparent dark:from-orange-950/40 dark:via-rose-950/40 border border-orange-200 dark:border-orange-800/50 px-4 py-2.5 rounded-2xl">
            <Clock className="w-5 h-5 text-rose-500 animate-pulse" />
            <div>
              <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Flash Deals Kết Thúc Sau:
              </div>
              <div className="flex items-center gap-1.5 font-black text-sm text-gray-900 dark:text-white">
                <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-1.5 py-0.5 rounded-md text-xs font-mono">
                  {formatTime(timeLeft.hours)}
                </span>
                <span>:</span>
                <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-1.5 py-0.5 rounded-md text-xs font-mono">
                  {formatTime(timeLeft.minutes)}
                </span>
                <span>:</span>
                <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-1.5 py-0.5 rounded-md text-xs font-mono">
                  {formatTime(timeLeft.seconds)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {vouchers.map((voucher, idx) => {
            const isCopied = copiedCode === voucher.code;

            return (
              <motion.div
                key={voucher.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-lg shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-700/70 overflow-hidden flex flex-col justify-between group"
              >
                
                {/* Top Accent Gradient Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${voucher.gradient}`} />

                <div>
                  {/* Badge & Expiry */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                      {voucher.badge}
                    </span>
                    <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                      {voucher.expiry}
                    </span>
                  </div>

                  {/* Code Box */}
                  <div className="bg-gray-50 dark:bg-gray-900/80 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-3 mb-3 flex items-center justify-between gap-2 group-hover:border-orange-400 transition-colors">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">MÃ GIẢM GIÁ</div>
                      <div className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white tracking-wider font-mono">
                        {voucher.code}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyCode(voucher.code)}
                      className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
                        isCopied 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white dark:bg-orange-500/20 dark:text-orange-400'
                      }`}
                      title="Sao chép & Áp dụng"
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-4">
                    {voucher.description}
                  </p>
                </div>

                {/* Bottom Action Button */}
                <button
                  onClick={() => {
                    handleCopyCode(voucher.code);
                    openCart();
                  }}
                  className="w-full text-xs font-bold py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700/60 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 text-gray-700 dark:text-gray-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{isCopied ? 'Đã Áp Dụng Giỏ Hàng' : 'Áp Dụng Vào Giỏ'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Promotions;
