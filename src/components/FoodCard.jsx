import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Heart, 
  Clock, 
  Flame, 
  Plus, 
  Sparkles, 
  Check,
  Leaf,
  Layers
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../data/foods';

const FoodCard = ({ food, viewMode = 'grid' }) => {
  const { addToCart, openDetailModal, wishlist, toggleWishlist } = useCart();
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const isLiked = wishlist.includes(food.id);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(food);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const discountPercent = food.originalPrice 
    ? Math.round(((food.originalPrice - food.price) / food.originalPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -3 }}
        onClick={() => openDetailModal(food)}
        className="glass-card rounded-3xl p-4 sm:p-5 shadow-card hover:shadow-xl dark:shadow-card-dark transition-all duration-300 flex flex-col sm:flex-row items-center gap-5 cursor-pointer group border border-gray-100 dark:border-gray-800"
      >
        {/* Thumbnail */}
        <div className="relative w-full sm:w-48 h-44 sm:h-36 rounded-2xl overflow-hidden shrink-0">
          <img 
            src={food.image} 
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
          />
          {discountPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
              -{discountPercent}%
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(food.id);
            }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform shadow-md"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {food.isBestSeller && (
              <span className="text-[10px] font-extrabold bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 fill-orange-500" /> Bán chạy
              </span>
            )}
            {food.isVegetarian && (
              <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Leaf className="w-3 h-3" /> Món Chay
              </span>
            )}
            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold ml-auto">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{food.rating} ({food.reviewsCount})</span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors mb-1 truncate">
            {food.name}
          </h3>

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {food.description}
          </p>

          <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-orange-600 dark:text-orange-400">
                {formatCurrency(food.price)}
              </span>
              {food.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(food.originalPrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleQuickAdd}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isAddedRecently 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20'
              }`}
            >
              {isAddedRecently ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isAddedRecently ? 'Đã thêm!' : 'Thêm giỏ'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default Grid Card
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={() => openDetailModal(food)}
      className="glass-card rounded-3xl p-4 sm:p-5 shadow-card hover:shadow-2xl dark:shadow-card-dark transition-all duration-300 flex flex-col justify-between cursor-pointer group border border-gray-100/80 dark:border-gray-800/80 relative"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
          <img 
            src={food.image} 
            alt={food.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
          />

          {/* Gradient Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <span className="text-white text-[11px] font-bold bg-orange-500/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Layers className="w-3 h-3" /> Tùy chỉnh món &amp; topping
            </span>
          </div>

          {/* Badges Top Left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discountPercent > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                -{discountPercent}%
              </span>
            )}
            {food.isBestSeller && (
              <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Flame className="w-3 h-3 fill-white" /> Bán chạy
              </span>
            )}
            {food.isChefSpecial && (
              <span className="bg-purple-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Chef Pick
              </span>
            )}
          </div>

          {/* Wishlist Heart Top Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(food.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 dark:bg-gray-900/85 backdrop-blur-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:scale-110 active:scale-95 transition-all shadow-md z-10"
            title="Yêu thích món"
          >
            <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>

          {/* Prep time pill */}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-orange-400" />
            <span>{food.prepTime}</span>
          </div>
        </div>

        {/* Rating and Dietary Tags */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{food.rating}</span>
            <span className="text-[10px] text-gray-400 font-normal">({food.reviewsCount})</span>
          </div>

          <div className="flex items-center gap-1.5">
            {food.isSpicy > 0 && (
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                {'🌶️'.repeat(food.isSpicy)} {food.isSpicy > 1 ? 'Siêu Cay' : 'Cay vừa'}
              </span>
            )}
            {food.isVegetarian && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg">
                <Leaf className="w-3 h-3" /> Chay
              </span>
            )}
            {food.calories && (
              <span className="text-[10px] text-gray-400 font-semibold hidden sm:inline">
                🔥 {food.calories} kcal
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-1 mb-1.5">
          {food.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed font-normal">
          {food.description}
        </p>

        {/* Ingredients Quick Pill Preview */}
        {food.ingredients && food.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {food.ingredients.slice(0, 2).map((ing, i) => (
              <span key={i} className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                • {ing}
              </span>
            ))}
            {food.ingredients.length > 2 && (
              <span className="text-[10px] text-orange-500 font-bold px-1">
                +{food.ingredients.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Price & Add Button */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div>
          {food.originalPrice && (
            <div className="text-[11px] text-gray-400 line-through">
              {formatCurrency(food.originalPrice)}
            </div>
          )}
          <div className="text-lg font-black text-orange-600 dark:text-orange-400">
            {formatCurrency(food.price)}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleQuickAdd}
          className={`p-3 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
            isAddedRecently
              ? 'bg-emerald-500 text-white shadow-emerald-500/30'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'
          }`}
          title="Thêm nhanh vào giỏ"
        >
          {isAddedRecently ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </motion.button>
      </div>

    </motion.div>
  );
};

export default FoodCard;
