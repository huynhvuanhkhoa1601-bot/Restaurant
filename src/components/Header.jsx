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
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { foods, formatCurrency } from '../data/foods';
import { siteConfig } from '../data/siteConfig';

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
  } = useCart();

  const { currentUser, isLoggedIn, isAdmin, openLogin, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

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

  // Filtered foods for live search suggestions dropdown
  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : foods.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

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

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <button 
                onClick={() => scrollToSection('menu')}
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5"
              >
                <span>Thực Đơn</span>
                <Flame className="w-3.5 h-3.5 text-orange-500 animate-bounce-subtle" />
              </button>
              <button 
                onClick={() => scrollToSection('promotions')}
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Khuyến Mãi
              </button>
              <button 
                onClick={() => scrollToSection('reviews')}
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Đánh Giá
              </button>
              <button 
                onClick={() => scrollToSection('story')}
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Về Chúng Tôi
              </button>
              <button 
                onClick={openReservation}
                className="text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/50 px-3 py-1.5 rounded-xl transition-all border border-orange-200 dark:border-orange-800/40 text-xs font-bold"
              >
                🍽️ Đặt Bàn Ngay
              </button>
            </nav>

            {/* Search Bar with Live Autocomplete */}
            <div ref={searchContainerRef} className="relative flex-1 max-w-xs md:max-w-sm hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm món ngon, burger, sushi, pizza..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full bg-gray-100/90 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 pl-10 pr-9 py-2 rounded-2xl text-xs sm:text-sm border border-transparent focus:border-orange-500 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all duration-200"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Live Search Autocomplete Dropdown */}
              <AnimatePresence>
                {searchFocused && searchQuery.trim() !== '' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 max-h-96 overflow-y-auto"
                  >
                    <div className="p-2">
                      <div className="text-[11px] font-bold text-gray-400 px-3 py-1.5 uppercase tracking-wider">
                        Kết quả tìm kiếm ({searchResults.length})
                      </div>
                      {searchResults.length > 0 ? (
                        searchResults.map(food => (
                          <div
                            key={food.id}
                            onClick={() => {
                              openDetailModal(food);
                              setSearchFocused(false);
                            }}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800/60 cursor-pointer transition-colors"
                          >
                            <img 
                              src={food.image} 
                              alt={food.name}
                              className="w-12 h-12 rounded-xl object-cover" 
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {food.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                <span className="font-bold text-orange-600 dark:text-orange-400">
                                  {formatCurrency(food.price)}
                                </span>
                                <span>•</span>
                                <span>⭐ {food.rating}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
                          Không tìm thấy món "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                title={soundEnabled ? "Tắt âm thanh tương tác" : "Bật âm thanh tương tác"}
                className="p-2 sm:p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:flex"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-orange-500" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                title={darkMode ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
                className="p-2 sm:p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-spin-slow" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => scrollToSection('menu')}
                title="Món ăn yêu thích"
                className="relative p-2 sm:p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden md:flex"
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
                    <div className="hidden xl:flex flex-col items-start">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200 max-w-[90px] truncate">{currentUser.name}</span>
                        {isAdmin && <Crown className="w-3 h-3 text-purple-500" />}
                      </div>
                      <span className={`text-[10px] font-semibold ${isAdmin ? 'text-purple-500' : 'text-orange-500'}`}>
                        {isAdmin ? 'Quản Trị Viên' : 'Khách Hàng'}
                      </span>
                    </div>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 hidden group-hover:block z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Đăng Xuất
                    </button>
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


              {/* Cart Drawer Trigger Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openCart}
                className="relative flex items-center gap-2 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300"
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>

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

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-4 mt-2 shadow-2xl"
            >
              <div className="flex flex-col gap-3 font-semibold text-gray-700 dark:text-gray-200">
                <button
                  onClick={() => scrollToSection('menu')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                >
                  <span>🔥 Thực đơn món ngon</span>
                  <span className="text-xs bg-orange-100 dark:bg-orange-900/40 text-orange-600 px-2 py-0.5 rounded-full font-bold">24+ Món</span>
                </button>
                <button
                  onClick={() => scrollToSection('promotions')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                >
                  <span>🎁 Voucher &amp; Ưu đãi</span>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Giảm 50k</span>
                </button>
                <button
                  onClick={() => scrollToSection('reviews')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                >
                  <span>⭐ Đánh giá khách hàng</span>
                </button>
                <button
                  onClick={() => scrollToSection('story')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                >
                  <span>📖 Về GourmetFeast</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); openReservation(); }}
                  className="p-3 rounded-xl bg-orange-500 text-white font-bold text-center shadow-lg shadow-orange-500/30 mt-2"
                >
                  🍽️ Đặt Bàn Ngay
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
