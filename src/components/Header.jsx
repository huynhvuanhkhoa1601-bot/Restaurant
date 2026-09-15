import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Sun, 
  Moon, 
  Heart, 
  Menu as MenuIcon, 
  X, 
  Sparkles, 
  UtensilsCrossed, 
  User, 
  Volume2, 
  VolumeX,
  Clock,
  PhoneCall,
  Flame,
  Crown,
  LogOut,
  LogIn,
  Plus,
  ArrowRight,
  TrendingUp,
  ReceiptText,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { foods, formatCurrency } from '../data/foods';
import { siteConfig } from '../data/siteConfig';

// Gợi ý tìm kiếm phổ biến
const POPULAR_SEARCHES = [
  { label: 'Pizza Hải Sản', icon: '🍕' },
  { label: 'Sushi Thập Cẩm', icon: '🍣' },
  { label: 'Phở Bò Wagyu', icon: '🍜' },
  { label: 'Burger Bò', icon: '🍔' },
  { label: 'Bít Tết Thăn', icon: '🥩' },
  { label: 'Tráng Miệng', icon: '🍰' },
];

const CATEGORY_MAP = {
  burger: '🍔 Burger',
  pizza: '🍕 Pizza',
  sushi: '🍣 Sushi',
  asian: '🍜 Món Á',
  steak: '🥩 Bít Tết',
  healthy: '🥗 Healthy',
  dessert: '🍰 Tráng Miệng'
};

// Hàm làm nổi bật từ khóa tìm kiếm
const highlightMatch = (text, query) => {
  if (!query || !query.trim()) return text;
  const cleanQuery = query.trim();
  const regex = new RegExp(`(${cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) => 
    part.toLowerCase() === cleanQuery.toLowerCase() ? (
      <span key={i} className="text-orange-600 dark:text-orange-400 font-extrabold bg-orange-100/60 dark:bg-orange-950/60 px-0.5 rounded">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const Header = () => {
  const { 
    darkMode, 
    toggleDarkMode, 
    soundEnabled, 
    toggleSound, 
    totalItemsCount, 
    cartSubtotal,
    openCart, 
    wishlist,
    searchQuery, 
    setSearchQuery,
    setSelectedCategory,
    openDetailModal,
    openReservation,
    addToCart,
    openProfile,
    openOrderHistory,
    openWishlist,
    selectedTable,
    diningMode,
    openTableQR,
  } = useCart();

  const { currentUser, isLoggedIn, isAdmin, openLogin, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Detect scroll for dynamic navbar blur & border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside click for search suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K để focus tìm kiếm, Escape để đóng
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered foods for live search suggestions dropdown
  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : foods.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6);

  // Món ăn nổi bật gợi ý khi chưa gõ từ khóa
  const topRecommendations = foods.filter(f => f.isBestSeller || f.rating >= 4.9).slice(0, 3);


  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white text-xs py-1.5 px-4 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>{siteConfig.topBanner.text}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-orange-100">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {siteConfig.topBanner.deliveryTime}</span>
            <span className="flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5" /> Hotline: {siteConfig.contact.hotlineDisplay || siteConfig.contact.hotline}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass shadow-md shadow-orange-950/5 py-3 border-b border-gray-200/50 dark:border-gray-800/60' 
          : 'bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md py-4 border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <a 
              href="#" 
              className="flex items-center gap-2.5 group shrink-0"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-500 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform duration-300">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-orange-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                    {siteConfig.brand.highlightWord}
                  </span>
                  <span className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">
                    {siteConfig.brand.subWord}
                  </span>
                  <span className="text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-500/20 px-1.5 py-0.5 rounded-full font-bold ml-0.5 uppercase tracking-wider">
                    {siteConfig.brand.badge}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-400 font-medium tracking-wider uppercase hidden sm:block">
                  {siteConfig.brand.tagline}
                </p>
              </div>
            </a>

            {/* 3-Dash Menu Button ("☰ Danh Mục") */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`px-3 py-2 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-bold transition-all border shrink-0 ${
                mobileMenuOpen
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20 ring-2 ring-orange-400/30'
                  : 'bg-gray-100/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 border-gray-200/80 dark:border-gray-700 hover:border-orange-400 hover:text-orange-500'
              }`}
              title="Khám phá toàn bộ danh mục & chức năng (Menu 3 dấu gạch)"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4 text-orange-500" />}
              <span className="font-extrabold hidden sm:inline">Danh Mục</span>
              <span className="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-300 px-1.5 py-0.5 rounded-full font-black">☰</span>
            </button>

            {/* Quick Link - only on extra wide 2xl screens */}
            <button 
              onClick={() => scrollToSection('menu')}
              className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors hidden 2xl:flex items-center gap-1 shrink-0 text-xs font-bold text-gray-700 dark:text-gray-300"
            >
              <span>Thực Đơn</span>
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-bounce-subtle" />
            </button>

            {/* Search Bar with Live Autocomplete - Rộng rãi, không bị đè ép */}
            <div 
              ref={searchContainerRef} 
              className="relative flex-1 min-w-[170px] max-w-sm sm:max-w-md xl:max-w-lg hidden sm:block"
            >
              <div className="relative group">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm món ngon, sushi, pizza..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      scrollToSection('menu');
                      setSearchFocused(false);
                    }
                  }}
                  className="w-full bg-gray-100/90 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 pl-9 pr-14 py-2 rounded-2xl text-xs sm:text-sm border border-transparent focus:border-orange-500 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-orange-500/15 outline-none transition-all duration-200 shadow-inner"
                />
                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-orange-500 absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
                
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery ? (
                    <button 
                      type="button"
                      onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                      className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-white flex items-center justify-center transition-colors"
                      title="Xóa tìm kiếm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : (
                    <kbd className="hidden lg:inline-flex items-center text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-gray-200/70 dark:bg-gray-700/60 px-1.5 py-0.5 rounded border border-gray-300/60 dark:border-gray-600/60 select-none">
                      ⌘K
                    </kbd>
                  )}
                </div>
              </div>

              {/* Live Search Autocomplete Dropdown */}
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="absolute top-full right-0 mt-2.5 w-[390px] sm:w-[450px] md:w-[480px] max-w-[calc(100vw-24px)] bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl shadow-black/25 border border-gray-100 dark:border-gray-800/90 overflow-hidden z-[100]"
                  >
                    {/* Trường hợp 1: Đang có từ khóa tìm kiếm */}
                    {searchQuery.trim() !== '' ? (
                      <>
                        {searchResults.length > 0 ? (
                          <>
                            {/* Header kết quả */}
                            <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800/80 dark:to-gray-800/40 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-orange-500" />
                                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                  Tìm thấy <span className="text-orange-600 dark:text-orange-400 font-black">{searchResults.length} món ăn</span> phù hợp
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  scrollToSection('menu');
                                  setSearchFocused(false);
                                }}
                                className="text-xs font-extrabold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1 hover:underline"
                              >
                                Xem trên thực đơn <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Danh sách món ăn kết quả */}
                            <div className="p-2 divide-y divide-gray-100 dark:divide-gray-800/60 max-h-[360px] overflow-y-auto custom-scrollbar">
                              {searchResults.map((food) => (
                                <div
                                  key={food.id}
                                  onClick={() => {
                                    openDetailModal(food);
                                    setSearchFocused(false);
                                  }}
                                  className="group flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-orange-50/80 dark:hover:bg-gray-800/70 cursor-pointer transition-all duration-200"
                                >
                                  {/* Ảnh món */}
                                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                                    <img 
                                      src={food.image} 
                                      alt={food.name}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                    />
                                    {food.isBestSeller && (
                                      <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-orange-600 to-orange-500 text-white text-[9px] font-black text-center py-0.5">
                                        HOT
                                      </span>
                                    )}
                                  </div>

                                  {/* Thông tin món */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                      {highlightMatch(food.name, searchQuery)}
                                    </h4>

                                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                      <span className="text-[11px] font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg text-gray-600 dark:text-gray-300">
                                        {CATEGORY_MAP[food.category] || food.category}
                                      </span>
                                      <span>•</span>
                                      <span className="text-amber-500 font-bold flex items-center gap-0.5">
                                        ★ {food.rating}
                                      </span>
                                      {food.prepTime && (
                                        <>
                                          <span>•</span>
                                          <span className="text-[11px] text-gray-400">{food.prepTime}</span>
                                        </>
                                      )}
                                    </div>

                                    <div className="flex items-baseline gap-1.5 mt-1">
                                      <span className="text-sm font-extrabold text-orange-600 dark:text-orange-400">
                                        {formatCurrency(food.price)}
                                      </span>
                                      {food.originalPrice && food.originalPrice > food.price && (
                                        <span className="text-[11px] text-gray-400 line-through">
                                          {formatCurrency(food.originalPrice)}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Nút thêm nhanh */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addToCart(food);
                                    }}
                                    title="Thêm nhanh vào giỏ hàng"
                                    className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-500 dark:hover:bg-orange-500 text-orange-600 hover:text-white dark:text-orange-400 dark:hover:text-white flex items-center justify-center transition-all duration-200 shrink-0 shadow-sm active:scale-95 group/btn"
                                  >
                                    <Plus className="w-4 h-4 transition-transform group-hover/btn:rotate-90" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Footer kết quả */}
                            <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900/90 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
                              <span>💡 Click vào món để xem chi tiết • <kbd className="font-bold text-gray-600 dark:text-gray-300">+</kbd> thêm giỏ</span>
                              <button
                                type="button"
                                onClick={() => {
                                  scrollToSection('menu');
                                  setSearchFocused(false);
                                }}
                                className="text-orange-500 font-bold hover:underline"
                              >
                                Xem tất cả ({foods.length})
                              </button>
                            </div>
                          </>
                        ) : (
                          /* Không tìm thấy kết quả */
                          <div className="p-6 text-center">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-orange-100/60 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center">
                              <Search className="w-7 h-7" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                              Không tìm thấy món "{searchQuery}"
                            </h4>
                            <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
                              Thử tìm theo từ khóa phổ biến bên dưới hoặc xem lại chính tả món ăn.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
                              {POPULAR_SEARCHES.map((item) => (
                                <button
                                  key={item.label}
                                  type="button"
                                  onClick={() => {
                                    setSearchQuery(item.label);
                                    searchInputRef.current?.focus();
                                  }}
                                  className="text-xs px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-orange-100 dark:bg-gray-800 dark:hover:bg-orange-950/50 text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors font-medium flex items-center gap-1"
                                >
                                  <span>{item.icon}</span>
                                  <span>{item.label}</span>
                                </button>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSearchQuery('');
                                scrollToSection('menu');
                                setSearchFocused(false);
                              }}
                              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
                            >
                              ← Xem toàn bộ thực đơn ({foods.length} món)
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Trường hợp 2: Khi người dùng bấm vào ô tìm kiếm nhưng chưa gõ chữ */
                      <div className="p-4">
                        {/* Gợi ý tìm kiếm nhanh */}
                        <div className="mb-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 mb-2.5">
                            <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                            <span>GỢI Ý TÌM KIẾM PHỔ BIẾN</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {POPULAR_SEARCHES.map((item) => (
                              <button
                                key={item.label}
                                type="button"
                                onClick={() => {
                                  setSearchQuery(item.label);
                                  searchInputRef.current?.focus();
                                }}
                                className="text-xs px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-orange-100 dark:bg-gray-800 dark:hover:bg-orange-950/50 text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors font-medium flex items-center gap-1.5"
                              >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Món ăn bán chạy gợi ý */}
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              MÓN BÁN CHẠY ĐƯỢC YÊU THÍCH
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                scrollToSection('menu');
                                setSearchFocused(false);
                              }}
                              className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline"
                            >
                              Xem tất cả →
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {topRecommendations.map((food) => (
                              <div
                                key={food.id}
                                onClick={() => {
                                  openDetailModal(food);
                                  setSearchFocused(false);
                                }}
                                className="group flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer transition-colors"
                              >
                                <img 
                                  src={food.image} 
                                  alt={food.name}
                                  className="w-11 h-11 rounded-xl object-cover shrink-0 ring-1 ring-black/5" 
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-orange-500 transition-colors">
                                    {food.name}
                                  </h4>
                                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                    <span className="font-extrabold text-orange-600 dark:text-orange-400">
                                      {formatCurrency(food.price)}
                                    </span>
                                    <span>•</span>
                                    <span className="text-amber-500 font-bold">★ {food.rating}</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(food);
                                  }}
                                  className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Table Indicator Pill if table is selected */}
              {selectedTable ? (
                <button
                  onClick={openTableQR}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-all shrink-0"
                  title={`Đang dùng món tại ${selectedTable.name}. Bấm để đổi bàn`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <QrCode className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bàn:</span>
                  <span>{selectedTable.code}</span>
                </button>
              ) : (
                <button
                  onClick={openTableQR}
                  className="hidden 2xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 transition-all shrink-0"
                  title="Gọi món tại bàn qua quét mã QR"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Quét Bàn</span>
                </button>
              )}

              {/* Quick Reservation Button (visible on wide screens) */}
              <button
                onClick={openReservation}
                className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 transition-all shrink-0"
                title="Đặt bàn tiệc trước tại KenRestaurant"
              >
                <span>🍽️ Đặt Bàn</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={openWishlist}
                title="Món ăn yêu thích"
                className="relative p-2 sm:p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden md:flex shrink-0"
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* User Account / Profile */}
              {isLoggedIn ? (
                <div className="relative group">
                  <button
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  >
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-orange-500/30"
                      />
                    ) : (
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-black ring-2 ${isAdmin ? 'bg-purple-600 ring-purple-400/40' : 'bg-orange-500 ring-orange-400/40'}`}>
                        {currentUser.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="hidden 2xl:flex flex-col items-start">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200 max-w-[90px] truncate">{currentUser.name}</span>
                        {isAdmin && <Crown className="w-3 h-3 text-purple-500" />}
                      </div>
                      <span className={`text-[10px] font-semibold ${isAdmin ? 'text-purple-500' : 'text-orange-500'}`}>
                        {isAdmin ? 'Quản Trị Viên' : 'Khách Hàng'}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown hiện ra khi đưa con trỏ chuột vào mục khách hàng */}
                  <div className="absolute right-0 top-full pt-2.5 w-72 hidden group-hover:block z-50 transition-all">
                    <div className="bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl shadow-black/25 border border-gray-100 dark:border-gray-800/80 p-2.5 overflow-hidden">
                      {/* Thẻ thông tin khách hàng */}
                      <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800/80 dark:to-gray-800/40 rounded-2xl mb-2 flex items-center gap-3 border border-orange-100/60 dark:border-gray-700/50">
                        {currentUser.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-orange-500/30 shrink-0"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm shrink-0 ${isAdmin ? 'bg-purple-600' : 'bg-orange-500'}`}>
                            {currentUser.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-gray-900 dark:text-white truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-gray-400 truncate">{currentUser.email}</p>
                          <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300' : 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300'}`}>
                            {isAdmin ? '👑 Quản Trị Viên' : '✨ Khách Hàng'}
                          </span>
                        </div>
                      </div>

                      {/* Danh sách các mục khi hover */}
                      <div className="space-y-1">
                        {/* 1. Hồ sơ khách hàng */}
                        <button
                          type="button"
                          onClick={openProfile}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-orange-50 dark:hover:bg-gray-800/80 text-left transition-colors group/item"
                        >
                          <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover/item:scale-110 transition-transform shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Hồ sơ khách hàng</p>
                            <p className="text-[10px] text-gray-400">Xem & chỉnh sửa thông tin cá nhân</p>
                          </div>
                        </button>

                        {/* 2. Lịch sử giao dịch */}
                        <button
                          type="button"
                          onClick={openOrderHistory}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50 dark:hover:bg-gray-800/80 text-left transition-colors group/item"
                        >
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover/item:scale-110 transition-transform shrink-0">
                            <ReceiptText className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Lịch sử giao dịch</p>
                            <p className="text-[10px] text-gray-400">Đơn hàng & hóa đơn đã đặt</p>
                          </div>
                        </button>

                        {/* 3. Món ăn yêu thích */}
                        <button
                          type="button"
                          onClick={openWishlist}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-rose-50 dark:hover:bg-gray-800/80 text-left transition-colors group/item"
                        >
                          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover/item:scale-110 transition-transform shrink-0">
                            <Heart className="w-4 h-4 fill-rose-500/20" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Món ăn yêu thích</p>
                            <p className="text-[10px] text-gray-400">{wishlist.length} món đã lưu</p>
                          </div>
                          {wishlist.length > 0 && (
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                              {wishlist.length}
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gray-100 dark:bg-gray-800 my-1.5" />

                      {/* Đăng xuất */}
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất tài khoản</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={openLogin}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200"
                >
                  <LogIn className="w-4 h-4 text-orange-500" />
                  <span className="hidden sm:inline">Đăng Nhập</span>
                </button>
              )}


              {/* Cart Drawer Trigger Button - Luôn hiển thị đầy đủ, không bị đè */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openCart}
                className="relative flex items-center gap-2 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 shrink-0"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce-subtle">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">
                  {totalItemsCount > 0 ? formatCurrency(cartSubtotal) : 'Giỏ hàng'}
                </span>
              </motion.button>

            </div>
          </div>
        </div>

        {/* Mobile Search Bar in dropdown if screen is small */}
        <div className="px-4 pt-2.5 sm:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm món ngon, burger, sushi, pizza..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pl-9 pr-8 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500/30"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Dine-in Table Active Notice Bar */}
        <AnimatePresence>
          {selectedTable && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs px-4 py-1.5 border-t border-emerald-400/30 flex items-center shadow-md overflow-hidden"
            >
              <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
                  <span className="truncate">
                    🍽️ Quý khách đang chọn món cho <strong>{selectedTable.name}</strong> ({selectedTable.area}) • Phục vụ trực tiếp tại bàn (0đ phí ship)
                  </span>
                </div>
                <button
                  onClick={openTableQR}
                  className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-lg font-extrabold text-[11px] transition-all ml-2 shrink-0 flex items-center gap-1 backdrop-blur-sm"
                >
                  <QrCode className="w-3 h-3" />
                  <span>Đổi Bàn / Quét Lại</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Universal 3-Dash Menu Dropdown Panel (Hiển thị khoa học trên mọi màn hình) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 py-5 shadow-2xl overflow-hidden"
            >
              <div className="max-w-7xl mx-auto space-y-4">
                
                {/* Account card if logged in */}
                {isLoggedIn && (
                  <div className="p-3.5 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-orange-200/60 dark:border-orange-800/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-black flex items-center justify-center text-sm shadow-md">
                        {currentUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{currentUser.name}</p>
                          <span className="text-[10px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-600 px-2 py-0.5 rounded-full">
                            {isAdmin ? '👑 Quản Trị Viên' : '✨ Khách Hàng'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setMobileMenuOpen(false); openProfile(); }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-orange-50 border border-gray-200 dark:border-gray-700"
                      >
                        👤 Hồ sơ
                      </button>
                      <button
                        onClick={() => { setMobileMenuOpen(false); openOrderHistory(); }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 text-xs font-bold text-emerald-600 hover:bg-emerald-50 border border-emerald-200 dark:border-emerald-800"
                      >
                        📦 Đơn hàng
                      </button>
                      <button
                        onClick={() => { setMobileMenuOpen(false); logout(); }}
                        className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-bold"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}

                {/* Main Navigation 4-Block Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => { setMobileMenuOpen(false); scrollToSection('menu'); }}
                    className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">🍕</span>
                      <span className="text-[10px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded-full">24+ Món</span>
                    </div>
                    <div className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-orange-500">
                      Thực Đơn Món Ngon
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      Món Á - Âu chuẩn vị 5 sao
                    </p>
                  </button>

                  <button
                    onClick={() => { setMobileMenuOpen(false); scrollToSection('promotions'); }}
                    className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">🎁</span>
                      <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full">Ưu Đãi</span>
                    </div>
                    <div className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-amber-500">
                      Voucher &amp; Khuyến Mãi
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      Giảm 50k &amp; Miễn phí ship
                    </p>
                  </button>

                  <button
                    onClick={() => { setMobileMenuOpen(false); scrollToSection('reviews'); }}
                    className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">⭐</span>
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">4.9★</span>
                    </div>
                    <div className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-emerald-500">
                      Đánh Giá Khách Hàng
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      Hàng ngàn thực khách tin chọn
                    </p>
                  </button>

                  <button
                    onClick={() => { setMobileMenuOpen(false); scrollToSection('story'); }}
                    className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">📖</span>
                      <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full">Ken</span>
                    </div>
                    <div className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-rose-500">
                      Về KenRestaurant
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      Sứ mệnh ẩm thực đỉnh cao
                    </p>
                  </button>
                </div>

                {/* Action Shortcuts: Gọi món quét mã bàn & Đặt bàn tiệc */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => { setMobileMenuOpen(false); openTableQR(); }}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold flex items-center justify-between shadow-md hover:brightness-105 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-black">
                          {selectedTable ? `Đang Ở ${selectedTable.name} (Bấm Để Đổi Bàn)` : '📱 Gọi Món Quét Mã Tại Bàn'}
                        </div>
                        <div className="text-[11px] text-emerald-100">
                          Phục vụ tại bàn • 0đ phí giao hàng
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    onClick={() => { setMobileMenuOpen(false); openReservation(); }}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold flex items-center justify-between shadow-md hover:brightness-105 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-black">
                          🍽️ Đặt Bàn Tiệc Ngay
                        </div>
                        <div className="text-[11px] text-orange-100">
                          Giữ chỗ 1 phút • Tặng kèm món tráng miệng
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>

                {/* Bottom Bar: Utilities (Sound, Dark mode) & Contact info */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleSound}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold transition-colors"
                    >
                      {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-orange-500" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span>{soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
                    </button>

                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold transition-colors"
                    >
                      {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-gray-500" />}
                      <span>{darkMode ? 'Giao diện: Tối' : 'Giao diện: Sáng'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 font-semibold text-orange-600 dark:text-orange-400">
                      <PhoneCall className="w-3.5 h-3.5" />
                      1900.6886
                    </span>
                    <span className="hidden sm:inline">
                      📍 133/50/4 Cống Lở, P.15, Q. Tân Bình
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
