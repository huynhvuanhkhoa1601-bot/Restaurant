import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, 
  Grid3X3, 
  LayoutGrid, 
  List, 
  Search, 
  X, 
  Flame, 
  Sparkles, 
  Star, 
  ArrowUpDown,
  Filter,
  RefreshCw,
  Utensils
} from 'lucide-react';
import FoodCard from './FoodCard';
import { foods } from '../data/foods';
import { useCart } from '../context/CartContext';

const FoodList = () => {
  const { 
    selectedCategory, 
    setSelectedCategory,
    searchQuery, 
    setSearchQuery,
    priceFilter, 
    setPriceFilter,
    dietaryFilter, 
    setDietaryFilter,
    sortBy, 
    setSortBy
  } = useCart();

  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'grid-dense', 'list'
  const [showFilters, setShowFilters] = useState(false);

  // Price presets
  const priceOptions = [
    { id: 'all', label: 'Tất cả mức giá' },
    { id: 'under100', label: 'Dưới 100.000đ' },
    { id: '100-250', label: '100k - 250k' },
    { id: 'above250', label: 'Trên 250.000đ' },
  ];

  // Dietary tags
  const dietaryOptions = [
    { id: 'bestseller', label: '🔥 Bán Chạy Nhất' },
    { id: 'chef', label: '⭐ Đầu Bếp Khuyên Dùng' },
    { id: 'vegetarian', label: '🥗 Món Ăn Chay' },
    { id: 'spicy', label: '🌶️ Món Cay' },
  ];

  const toggleDietary = (id) => {
    setDietaryFilter(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceFilter('all');
    setDietaryFilter([]);
    setSortBy('popular');
  };

  // Filter & Sort Logic
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      // Category filter
      if (selectedCategory !== 'all' && food.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchName = food.name.toLowerCase().includes(query);
        const matchDesc = food.description.toLowerCase().includes(query);
        const matchCat = food.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      // Price filter
      if (priceFilter === 'under100' && food.price >= 100000) return false;
      if (priceFilter === '100-250' && (food.price < 100000 || food.price > 250000)) return false;
      if (priceFilter === 'above250' && food.price <= 250000) return false;

      // Dietary filter
      if (dietaryFilter.includes('bestseller') && !food.isBestSeller) return false;
      if (dietaryFilter.includes('chef') && !food.isChefSpecial) return false;
      if (dietaryFilter.includes('vegetarian') && !food.isVegetarian) return false;
      if (dietaryFilter.includes('spicy') && food.isSpicy === 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: popular / best seller first
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, priceFilter, dietaryFilter, sortBy]);

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery.trim() !== '' || priceFilter !== 'all' || dietaryFilter.length > 0;

  return (
    <section id="menu" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-xs sm:text-sm tracking-wider uppercase mb-1">
              <Utensils className="w-4 h-4" />
              <span>Thực Đơn Đa Dạng Chuẩn 5 Sao</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Khám Phá Món Ngon Hảo Hạng
            </h2>
          </div>

          {/* Quick Controls: Filter toggle & View modes */}
          <div className="flex items-center gap-3 flex-wrap">
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-orange-400'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Bộ Lọc</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-orange-500 pr-8 cursor-pointer shadow-sm"
              >
                <option value="popular">⭐ Phổ biến &amp; Bán chạy</option>
                <option value="rating">🏆 Đánh giá cao nhất</option>
                <option value="price-low">💵 Giá từ thấp đến cao</option>
                <option value="price-high">💎 Giá từ cao đến thấp</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-700 text-orange-500 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Lưới 3 Cột"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid-dense')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid-dense' 
                    ? 'bg-white dark:bg-gray-700 text-orange-500 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Lưới 4 Cột"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-700 text-orange-500 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Danh Sách"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Collapsible Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white dark:bg-gray-800/90 rounded-3xl p-6 border border-gray-200/80 dark:border-gray-700/80 shadow-xl space-y-5">
                
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-orange-500" />
                    <span>Bộ Lọc Nâng Cao</span>
                  </h4>
                  {hasActiveFilters && (
                    <button
                      onClick={resetAllFilters}
                      className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Xóa tất cả bộ lọc</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Price Filter Pills */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2.5">
                      Khoảng Giá
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {priceOptions.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setPriceFilter(p.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            priceFilter === p.id
                              ? 'bg-orange-500 text-white shadow-sm'
                              : 'bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dietary Filter Tags */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2.5">
                      Đặc Tính Món Ăn
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {dietaryOptions.map(d => {
                        const isChecked = dietaryFilter.includes(d.id);
                        return (
                          <button
                            key={d.id}
                            onClick={() => toggleDietary(d.id)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                              isChecked
                                ? 'bg-orange-500 text-white shadow-sm'
                                : 'bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <span>{d.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count Bar */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium mb-6">
          <div>
            Hiển thị <span className="font-bold text-gray-900 dark:text-white">{filteredFoods.length}</span> món ăn
            {searchQuery && (
              <span> cho từ khóa "<strong className="text-orange-500">{searchQuery}</strong>"</span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-orange-600 dark:text-orange-400 hover:underline font-bold"
            >
              Đặt lại mặc định
            </button>
          )}
        </div>

        {/* Food Items Layout Grid */}
        {filteredFoods.length > 0 ? (
          <motion.div 
            layout
            className={`grid gap-6 ${
              viewMode === 'grid-dense'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                : viewMode === 'list'
                ? 'grid-cols-1 max-w-4xl mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            <AnimatePresence>
              {filteredFoods.map(food => (
                <FoodCard 
                  key={food.id} 
                  food={food} 
                  viewMode={viewMode === 'list' ? 'list' : 'grid'} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty Search State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-4 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-4xl mb-4">
              🍳
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Không tìm thấy món ăn phù hợp
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Rất tiếc chúng tôi chưa tìm thấy món ăn khớp với bộ lọc của bạn. Hãy thử từ khóa khác hoặc xóa bộ lọc!
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all"
            >
              Xem Tất Cả Món Ăn
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default FoodList;
