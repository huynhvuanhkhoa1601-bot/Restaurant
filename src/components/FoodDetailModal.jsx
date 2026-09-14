import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Clock, 
  Flame, 
  Plus, 
  Minus, 
  Sparkles, 
  Check, 
  Leaf, 
  ShieldCheck, 
  Utensils 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../data/foods';

const FoodDetailModal = () => {
  const { 
    isDetailModalOpen, 
    selectedFoodForDetail, 
    closeDetailModal, 
    addToCart,
    wishlist,
    toggleWishlist
  } = useCart();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Initialize modal state when opened
  useEffect(() => {
    if (selectedFoodForDetail) {
      const defaultSize = selectedFoodForDetail.customizations?.sizes?.[0] || null;
      setSelectedSize(defaultSize);
      setSelectedToppings([]);
      setNotes('');
      setQuantity(1);
    }
  }, [selectedFoodForDetail]);

  if (!isDetailModalOpen || !selectedFoodForDetail) return null;

  const food = selectedFoodForDetail;
  const isLiked = wishlist.includes(food.id);

  const toggleTopping = (topping) => {
    setSelectedToppings(prev => {
      const exists = prev.some(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  // Calculate dynamic unit price and total price
  const sizePrice = selectedSize ? selectedSize.priceOffset : 0;
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = food.price + sizePrice + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(food, {
      selectedSize,
      selectedToppings,
      notes,
      quantity
    });
    closeDetailModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        
        {/* Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDetailModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden z-10 border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={closeDetailModal}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Modal Content */}
          <div className="overflow-y-auto p-6 space-y-6">
            
            {/* Top Media & Hero */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden shadow-md">
              <img 
                src={food.image} 
                alt={food.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-1">
                    {food.isBestSeller && (
                      <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        🔥 BESTSELLER
                      </span>
                    )}
                    {food.isChefSpecial && (
                      <span className="bg-purple-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        ⭐ CHEF'S CHOICE
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black">{food.name}</h2>
                </div>
              </div>
            </div>

            {/* Quick Meta Stats */}
            <div className="flex items-center justify-between gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl">
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-gray-900 dark:text-white">{food.rating}</span>
                <span>({food.reviewsCount} đánh giá)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{food.prepTime}</span>
              </div>
              <div>
                🔥 <span>{food.calories} kcal</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Mô Tả Hương Vị
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                {food.description}
              </p>
            </div>

            {/* Ingredients List */}
            {food.ingredients && food.ingredients.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Nguyên Liệu Chính
                </h4>
                <div className="flex flex-wrap gap-2">
                  {food.ingredients.map((ing, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 px-3 py-1.5 rounded-xl font-medium border border-orange-100 dark:border-orange-900/40"
                    >
                      ✓ {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Size Customizations */}
            {food.customizations?.sizes && (
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    1. Chọn Kích Cỡ / Khẩu Phần
                  </h4>
                  <span className="text-[11px] text-orange-500 font-bold bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 rounded-md">
                    Bắt buộc chọn 1
                  </span>
                </div>
                <div className="space-y-2">
                  {food.customizations.sizes.map((size, idx) => {
                    const isSelected = selectedSize?.name === size.name;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedSize(size)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-400'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {size.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                          {size.priceOffset > 0 ? `+${formatCurrency(size.priceOffset)}` : 'Mặc định'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Extra Toppings */}
            {food.customizations?.toppings && (
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    2. Topping &amp; Món Thêm (Tùy chọn)
                  </h4>
                  <span className="text-[11px] text-gray-400">Có thể chọn nhiều</span>
                </div>
                <div className="space-y-2">
                  {food.customizations.toppings.map(topping => {
                    const isChecked = selectedToppings.some(t => t.id === topping.id);
                    return (
                      <div
                        key={topping.id}
                        onClick={() => toggleTopping(topping)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-400'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {topping.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                          +{formatCurrency(topping.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions Note */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Ghi Chú Cho Nhà Bếp
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: Không lấy hành lá, làm chín kỹ, thêm ớt tươi, ít đá..."
                rows={2}
                className="w-full bg-gray-50 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-xs outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
              />
            </div>

          </div>

          {/* Modal Footer with Live Price & Add Button */}
          <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800/90 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
            
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-1.5 shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors text-gray-700 dark:text-gray-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold text-sm text-gray-900 dark:text-white w-5 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors text-gray-700 dark:text-gray-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Total Price & Add Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-between bg-gradient-to-r from-orange-500 via-orange-600 to-rose-500 text-white px-5 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
            >
              <span>Thêm Vào Giỏ Hàng</span>
              <span className="text-base font-black bg-white/20 px-3 py-1 rounded-xl">
                {formatCurrency(totalPrice)}
              </span>
            </motion.button>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FoodDetailModal;
