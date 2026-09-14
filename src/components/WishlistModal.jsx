import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Heart, Plus, Trash2, ShoppingBag, 
  ArrowRight, Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { foods, formatCurrency } from '../data/foods';

const WishlistModal = () => {
  const { 
    isWishlistOpen, closeWishlist, 
    wishlist, toggleWishlist, 
    addToCart, openDetailModal, 
    showToast 
  } = useCart();

  if (!isWishlistOpen) return null;

  // Lọc danh sách món ăn yêu thích
  const favoritedFoods = foods.filter(food => wishlist.includes(food.id));

  const handleAddToCart = (food) => {
    addToCart(food);
    if (showToast) {
      showToast(`Đã thêm "${food.name}" vào giỏ hàng!`, 'success');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeWishlist}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative bg-white dark:bg-[#0f172a] rounded-3xl w-full max-w-2xl shadow-2xl z-10 border border-gray-100 dark:border-gray-800 overflow-hidden max-h-[88vh] flex flex-col"
        >
          {/* Top gradient bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500" />

          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Heart className="w-6 h-6 fill-rose-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    Món Ăn Yêu Thích
                  </h3>
                  <span className="text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full">
                    {favoritedFoods.length} món
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Những món ăn thượng hạng bạn đã lưu để thưởng thức
                </p>
              </div>
            </div>

            <button
              onClick={closeWishlist}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content List */}
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            {favoritedFoods.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoritedFoods.map((food) => (
                  <div
                    key={food.id}
                    className="group bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-3 border border-gray-100 dark:border-gray-700/60 hover:border-rose-500/40 transition-all flex flex-col justify-between"
                  >
                    <div 
                      onClick={() => {
                        openDetailModal(food);
                        closeWishlist();
                      }}
                      className="cursor-pointer"
                    >
                      <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-gray-200 dark:bg-gray-700">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(food.id);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 text-rose-500 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                          title="Bỏ thích món này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-rose-500 transition-colors">
                        {food.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span className="text-amber-500 font-bold">★ {food.rating}</span>
                        <span>•</span>
                        <span>{food.prepTime || '15-20 phút'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                      <div>
                        <span className="text-xs text-gray-400">Giá món</span>
                        <p className="text-sm font-black text-orange-600 dark:text-orange-400">
                          {formatCurrency(food.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(food)}
                        className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm Giỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-3xl bg-rose-100/60 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="text-base font-extrabold text-gray-900 dark:text-white mb-1">
                  Chưa có món ăn yêu thích nào
                </h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-5">
                  Hãy nhấn vào biểu tượng trái tim ở các món ăn để lưu lại những món bạn thích nhất!
                </p>
                <button
                  onClick={closeWishlist}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-extrabold shadow-lg shadow-rose-500/25"
                >
                  Khám Phá Món Ngon →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WishlistModal;
