import React from 'react';
import { motion } from 'framer-motion';
import { categories } from '../data/foods';
import { useCart } from '../context/CartContext';

const Categories = () => {
  const { selectedCategory, setSelectedCategory } = useCart();

  return (
    <section className="py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Danh Mục Ẩm Thực</span>
            <span className="text-xs bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-extrabold px-2 py-0.5 rounded-full">
              {categories.length - 1} Loại Món
            </span>
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            Nhấn vào danh mục để lọc nhanh
          </span>
        </div>

        {/* Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 shrink-0 border ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200/80 dark:border-gray-700/80 hover:border-orange-300 dark:hover:border-orange-500/50 hover:bg-orange-50/50 dark:hover:bg-gray-700/50 shadow-sm'
                }`}
              >
                <span className="text-base sm:text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {cat.count}
                </span>
              </motion.button>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Categories;
