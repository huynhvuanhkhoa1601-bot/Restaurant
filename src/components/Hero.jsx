import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  ShieldCheck, 
  Clock, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Zap,
  Award
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { foods, formatCurrency } from '../data/foods';
import { siteConfig } from '../data/siteConfig';

const Hero = () => {
  const { addToCart, openDetailModal } = useCart();
  
  // Featured hero items: f1 (Wagyu Burger), f3 (Sashimi), f2 (Pizza Pesto)
  const heroDishes = [
    foods.find(f => f.id === 'f1') || foods[0],
    foods.find(f => f.id === 'f3') || foods[2],
    foods.find(f => f.id === 'f2') || foods[1],
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto carousel rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroDishes.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroDishes.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % heroDishes.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + heroDishes.length) % heroDishes.length);

  const activeDish = heroDishes[currentIndex];

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPromos = () => {
    const el = document.getElementById('promotions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24 bg-gradient-to-b from-orange-50/60 via-transparent to-transparent dark:from-orange-950/20 dark:via-transparent">
      
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-400/15 dark:bg-orange-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-rose-400/15 dark:bg-rose-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Highlights & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/80 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-300 text-xs sm:text-sm font-bold shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-orange-500 animate-spin-slow" />
              <span>{siteConfig.hero.topBadge}</span>
              <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                {siteConfig.hero.badgeDelivery}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.15]"
            >
              {siteConfig.hero.titleLine1}{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 bg-clip-text text-transparent underline decoration-orange-300 dark:decoration-orange-700 decoration-wavy decoration-2">
                {siteConfig.hero.titleHighlight}
              </span>{' '}
              {siteConfig.hero.titleLine2}
            </motion.h1>

            {/* Subtitle Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {siteConfig.hero.description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={scrollToMenu}
                className="flex items-center gap-2.5 bg-gradient-to-r from-orange-500 via-orange-600 to-rose-500 text-white px-7 py-4 rounded-2xl font-bold text-base shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-300 group"
              >
                <span>{siteConfig.hero.ctaMenuButton}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToPromos}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-4 rounded-2xl font-bold text-base border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-gray-700/50 shadow-sm transition-all duration-300"
              >
                <Flame className="w-5 h-5 text-orange-500" />
                <span>{siteConfig.hero.ctaVoucherButton}</span>
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/80 dark:border-gray-800/80 max-w-xl mx-auto lg:mx-0"
            >
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 text-orange-500 dark:text-orange-400 font-extrabold text-xl sm:text-2xl">
                  <span>{siteConfig.hero.stats.stat1.number}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{siteConfig.hero.stats.stat1.label}</p>
              </div>

              <div className="flex flex-col items-center lg:items-start border-x border-gray-200 dark:border-gray-800 px-3">
                <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-xl sm:text-2xl">
                  <span>{siteConfig.hero.stats.stat2.number}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{siteConfig.hero.stats.stat2.label}</p>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5 text-emerald-500 font-extrabold text-xl sm:text-2xl">
                  <span>{siteConfig.hero.stats.stat3.number}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{siteConfig.hero.stats.stat3.label}</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Hero Signature Interactive Food Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Outer Glow Ring */}
            <div className="relative w-full max-w-md">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDish.id}
                  initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.95, rotate: -1 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card rounded-3xl p-5 sm:p-6 shadow-2xl shadow-orange-500/10 border border-white/60 dark:border-gray-700/60 relative overflow-hidden"
                >
                  
                  {/* Floating Tags */}
                  <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
                    <span className="bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-white" /> BESTSELLER
                    </span>
                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {activeDish.prepTime}
                    </span>
                  </div>

                  {/* Food Image with Hover Zoom */}
                  <div 
                    onClick={() => openDetailModal(activeDish)}
                    className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden mb-5 cursor-pointer group shadow-inner"
                  >
                    <img 
                      src={activeDish.image} 
                      alt={activeDish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-bold bg-orange-500 px-3 py-1.5 rounded-xl">
                        🔍 Nhấn để xem chi tiết &amp; chọn topping
                      </span>
                    </div>
                  </div>

                  {/* Food Information */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                        {activeDish.category === 'burger' ? '🍔 Bò Wagyu Cao Cấp' : activeDish.category === 'sushi' ? '🍣 Sashimi Tươi Rói' : '🍕 Pizza Men Tự Nhiên'}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{activeDish.rating} ({activeDish.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 
                      onClick={() => openDetailModal(activeDish)}
                      className="text-xl font-extrabold text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 cursor-pointer transition-colors truncate mb-1"
                    >
                      {activeDish.name}
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                      {activeDish.description}
                    </p>

                    {/* Price and Add to Cart Button */}
                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <div className="text-xs text-gray-400 line-through">
                          {formatCurrency(activeDish.originalPrice)}
                        </div>
                        <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
                          {formatCurrency(activeDish.price)}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(activeDish)}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/30 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm Vào Giỏ</span>
                      </motion.button>
                    </div>

                  </div>

                </motion.div>
              </AnimatePresence>

              {/* Slider Navigation Dots and Controls */}
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="flex items-center gap-2">
                  {heroDishes.map((dish, idx) => (
                    <button
                      key={dish.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentIndex === idx 
                          ? 'w-8 bg-orange-500' 
                          : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
