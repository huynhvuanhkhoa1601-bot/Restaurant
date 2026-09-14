import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Toast = () => {
  const { toast } = useCart();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-orange-500 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/20 bg-emerald-50/95 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200',
    error: 'border-rose-500/20 bg-rose-50/95 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200',
    info: 'border-orange-500/20 bg-orange-50/95 dark:bg-orange-950/80 text-orange-900 dark:text-orange-200'
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-xl backdrop-blur-md border ${borders[toast.type] || borders.info}`}
        >
          {icons[toast.type] || icons.info}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Toast;
