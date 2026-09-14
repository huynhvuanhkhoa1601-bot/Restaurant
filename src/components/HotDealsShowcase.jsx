import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  Zap, 
  Award,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../data/foods';

// High-impact hot combo advertisement packages with dynamic visuals
export const hotDealsData = [
  {
    id: 'combo-wagyu',
    name: 'Combo Wagyu Supreme & Khoai Tây Truffle',
    badge: 'SIÊU COMBO BÁN CHẠY #1 🔥',
    discountTag: '-25% HÔM NAY',
    price: 215000,
    originalPrice: 285000,
    rating: 5.0,
    soldCount: 88,
    maxDailyStock: 100,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    gifVisual: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    description: 'Trải nghiệm đỉnh cao với Burger bò Wagyu Úc sốt nấm Truffle đen thơm lừng, kèm một phần khoai tây múi cau chiên bơ tỏi Truffle và nước ép cam hữu cơ.',
    items: [
      '1x Burger Bò Wagyu Truffle Đen A5 (Single Patty)',
      '1x Khoai Tây Chiên Lắc Phô Mai & Truffle',
      '1x Nước Ép Cam Tươi Nguyên Chất 350ml'
    ],
    accentGradient: 'from-orange-600 via-amber-600 to-rose-600',
    chefQuote: 'Món ăn hoàn hảo cho bữa tối chuẩn 5 sao tại nhà!'
  },
  {
    id: 'combo-sushi',
    name: 'Đại Tiệc Sushi Sashimi Hoàng Gia 28 Món',
    badge: 'CHEF SPECIAL CÁ HỒI NAUY 🍣',
    discountTag: '-30% VIP DEAL',
    price: 420000,
    originalPrice: 600000,
    rating: 4.95,
    soldCount: 42,
    maxDailyStock: 50,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    gifVisual: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80',
    description: 'Tuyển tập 28 món tinh hoa gồm Sashimi cá hồi Nauy béo ngậy, sò điệp Nhật Hokkaido, lươn nướng sốt Kabayaki gia truyền và 2 chén súp Miso đậu hũ.',
    items: [
      '14x Miếng Sashimi Cá Hồi & Sò Điệp Nhật',
      '10x Nigiri Lươn Nướng Sốt Kabayaki & Cá Ngừ',
      '2x Chén Súp Miso Rong Biển Đậu Hũ'
    ],
    accentGradient: 'from-rose-600 via-purple-600 to-indigo-600',
    chefQuote: 'Cá hồi nhập khẩu trực tiếp bằng đường hàng không mỗi sáng!'
  },
  {
    id: 'combo-pizza',
    name: 'Combo Pizza Hải Sản Pesto & Bánh Tiramisu Ý',
    badge: 'COMBO HẸN HÒ LÃNG MẠN 🍕',
    discountTag: '-22% TIẾT KIỆM',
    price: 289000,
    originalPrice: 370000,
    rating: 4.9,
    soldCount: 65,
    maxDailyStock: 80,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    gifVisual: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    description: 'Set ăn lãng mạn gồm Pizza hải sản lá quế Pesto 9 inch nướng củi giòn xốp, kèm 1 hộp Tiramisu Mascarpone cà phê Kahlúa béo mịn.',
    items: [
      '1x Pizza Hải Sản Pesto Cỡ Vừa (9 inch - 6 miếng)',
      '1x Bánh Tiramisu Mascarpone Kahlúa Ý (150g)',
      '2x Trà Đào Cam Sả Thảo Mộc'
    ],
    accentGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    chefQuote: 'Đế bánh ủ men 48 tiếng nướng củi chuẩn truyền thống Ý!'
  }
];

const HotDealsShowcase = () => {
  const { addToCart, showToast } = useCart();
  const [activeTab, setActiveTab] = useState(0);
  const [addedComboId, setAddedComboId] = useState(null);

  // Auto rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % hotDealsData.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const deal = hotDealsData[activeTab];
  const stockPercent = Math.round((deal.soldCount / deal.maxDailyStock) * 100);

  const handleAddCombo = (combo) => {
    // Create food-compatible structure for cart
    const comboCartItem = {
      id: combo.id,
      name: combo.name,
      category: 'combo',
      price: combo.price,
      originalPrice: combo.originalPrice,
      rating: combo.rating,
      reviewsCount: 150,
      image: combo.image,
      description: combo.description,
      isBestSeller: true,
      customizations: {
        sizes: [{ name: 'Trọn Gói Combo Đặc Biệt', priceOffset: 0 }],
        toppings: []
      }
    };

    addToCart(comboCartItem);
    setAddedComboId(combo.id);
    setTimeout(() => setAddedComboId(null), 2000);
  };

  return (
    <section className="py-14 bg-gradient-to-b from-gray-900 via-[#131B2E] to-gray-900 text-white relative overflow-hidden">
      
      {/* Dynamic Animated Background Glowing Rings */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow delay-1000" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Animated Glowing Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-black tracking-wider uppercase mb-2">
              <Zap className="w-3.5 h-3.5 fill-orange-400 animate-bounce" />
              <span>SIÊU DEAL KHUYẾN MÃI ĐỘC QUYỀN HÔM NAY</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Quảng Cáo Combo &amp; Món Hot Bán Chạy Nhất
            </h2>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {hotDealsData.map((d, idx) => (
              <button
                key={d.id}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                  activeTab === idx
                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/40 scale-105'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-orange-500/40'
                }`}
              >
                {idx === 0 ? '🍔 Combo Wagyu' : idx === 1 ? '🍣 Đại Tiệc Sushi' : '🍕 Pizza & Tiramisu'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Animated Ad Banner Billboard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.98 }}
            transition={{ duration: 0.45 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-gray-800/80 backdrop-blur-2xl"
          >
            {/* Top Accent Gradient Bar */}
            <div className={`h-2 w-full bg-gradient-to-r ${deal.accentGradient}`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
              
              {/* Left Column: Visual Media Gallery with Animated Overlay */}
              <div className="lg:col-span-6 relative group">
                <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={deal.image} 
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out" 
                  />
                  
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-5">
                    {/* Top Tag */}
                    <div className="flex items-center justify-between">
                      <span className="bg-rose-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                        <Flame className="w-3.5 h-3.5 fill-white" />
                        {deal.discountTag}
                      </span>

                      <span className="bg-black/60 backdrop-blur-md text-amber-300 font-extrabold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 border border-white/10">
                        ⭐ {deal.rating} / 5.0
                      </span>
                    </div>

                    {/* Bottom Chef Quote */}
                    <div className="bg-black/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs text-orange-200 italic">
                      💬 "{deal.chefQuote}"
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Combo Breakdown & CTA */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Badge & Title */}
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-orange-400 mb-1.5 block">
                    {deal.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {deal.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                {/* Items Included Checklist */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trọn Bộ Món Ăn Bao Gồm:</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-gray-200 font-semibold">
                    {deal.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-orange-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                      Số lượng có hạn hôm nay:
                    </span>
                    <span className="text-gray-300 font-mono">
                      Đã bán <strong className="text-orange-400 font-extrabold">{deal.soldCount}</strong>/{deal.maxDailyStock} suất
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stockPercent}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Pricing & Add To Cart CTA Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
                  <div>
                    <div className="text-xs text-gray-400 line-through">
                      {formatCurrency(deal.originalPrice)}
                    </div>
                    <div className="text-3xl font-black text-orange-400">
                      {formatCurrency(deal.price)}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddCombo(deal)}
                    className={`flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm shadow-xl transition-all ${
                      addedComboId === deal.id
                        ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-orange-500 via-orange-600 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white shadow-orange-500/40'
                    }`}
                  >
                    {addedComboId === deal.id ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Đã Thêm Vào Giỏ Hàng!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Săn Ngay Combo Ưu Đãi</span>
                      </>
                    )}
                  </motion.button>
                </div>

              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default HotDealsShowcase;
