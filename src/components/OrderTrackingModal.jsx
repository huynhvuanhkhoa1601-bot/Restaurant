import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Clock, 
  Star, 
  PackageCheck,
  ShieldCheck,
  Utensils,
  Bell
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../data/foods';

const OrderTrackingModal = () => {
  const { isTrackingOpen, setIsTrackingOpen, currentOrder, showToast } = useCart();
  const [currentStep, setCurrentStep] = useState(1); // 0: Placed, 1: Preparing, 2: Delivering/Serving, 3: Completed
  const [etaMinutes, setEtaMinutes] = useState(12);

  useEffect(() => {
    if (!isTrackingOpen) return;

    // Simulate order progression
    const timer1 = setTimeout(() => setCurrentStep(1), 2000);
    const timer2 = setTimeout(() => {
      setCurrentStep(2);
      setEtaMinutes(5);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isTrackingOpen]);

  if (!isTrackingOpen || !currentOrder) return null;

  const isDineIn = currentOrder.orderType === 'dine_in' || 
                   currentOrder.customer?.orderType === 'dine_in' || 
                   !!currentOrder.tableNumber;
  const tableTitle = currentOrder.tableNumber || currentOrder.customer?.tableNumber || 'Bàn Ăn';

  const steps = isDineIn ? [
    { title: 'Tiếp nhận', icon: <CheckCircle2 className="w-5 h-5" /> },
    { title: 'Bếp nấu', icon: <ChefHat className="w-5 h-5" /> },
    { title: 'Mang ra bàn', icon: <Utensils className="w-5 h-5" /> },
    { title: 'Hoàn tất', icon: <PackageCheck className="w-5 h-5" /> },
  ] : [
    { title: 'Tiếp nhận đơn', icon: <CheckCircle2 className="w-5 h-5" /> },
    { title: 'Đang chế biến', icon: <ChefHat className="w-5 h-5" /> },
    { title: 'Đang giao hàng', icon: <Bike className="w-5 h-5" /> },
    { title: 'Giao hoàn tất', icon: <PackageCheck className="w-5 h-5" /> },
  ];

  const handleCallStaff = () => {
    if (showToast) {
      showToast(`Đã rung chuông gọi nhân viên phục vụ tới ${tableTitle}!`, 'success');
    } else {
      alert(`Đã rung chuông gọi nhân viên phục vụ tới ${tableTitle}!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsTrackingOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden z-10 border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]"
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-rose-500 text-white p-6 relative">
          <button
            onClick={() => setIsTrackingOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full w-fit mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isDineIn ? `🍽️ Gọi Món Tại ${tableTitle}` : '🛵 Giao Tận Nơi'} • #{currentOrder.orderId}</span>
          </div>

          <h2 className="text-2xl font-black mb-1">
            {isDineIn
              ? (currentStep >= 2 ? `Món Đang Được Bưng Đến ${tableTitle}!` : 'Bếp KenRestaurant Đang Nấu Món Nóng')
              : (currentStep === 2 ? 'Tài Xế Đang Giao Đến Bạn!' : 'Đang Chuẩn Bị Món Ăn Nóng Hổi')}
          </h2>
          <p className="text-xs text-orange-100 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {isDineIn 
                ? `Thời gian phục vụ dự kiến: khoảng ${etaMinutes} phút`
                : `Thời gian dự kiến nhận hàng: ${etaMinutes} phút nữa`}
            </span>
          </p>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Progress Timeline Stepper */}
          <div className="relative flex justify-between items-start">
            <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 dark:bg-gray-700 -z-0">
              <div 
                className="h-full bg-orange-500 transition-all duration-700" 
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={idx} className="flex flex-col items-center text-center z-10 w-20">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCurrent 
                      ? 'bg-orange-500 text-white ring-4 ring-orange-200 dark:ring-orange-950/60 shadow-lg'
                      : isCompleted
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    {step.icon}
                  </div>
                  <h5 className={`text-[11px] font-extrabold mt-2 ${
                    isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h5>
                </div>
              );
            })}
          </div>

          {/* DINE-IN SERVICE CARD OR DRIVER CARD */}
          {isDineIn ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-300 dark:border-emerald-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                      Phục Vụ Trực Tiếp Tại {tableTitle}
                    </h4>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      0đ Ship
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Đầu bếp đang nấu theo yêu cầu • Nhân viên sẽ dọn món tới bàn
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCallStaff}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all shrink-0"
              >
                <Bell className="w-4 h-4 animate-bounce" />
                <span className="hidden sm:inline">Gọi Nhân Viên</span>
              </button>
            </div>
          ) : (
            <>
              {/* Delivery Map Mockup */}
              <div className="relative h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M 50 110 Q 150 30 250 80 T 450 60" 
                    fill="none" 
                    stroke="#f97316" 
                    strokeWidth="4" 
                    strokeDasharray="6 6"
                    className="animate-pulse"
                  />
                </svg>

                <div className="absolute bottom-6 left-8 flex flex-col items-center">
                  <div className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md mb-1">
                    KenRestaurant
                  </div>
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg">
                    🍴
                  </div>
                </div>

                <motion.div 
                  animate={{ x: [0, 80, 160], y: [0, -20, 10] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute top-12 left-1/3 flex flex-col items-center"
                >
                  <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md mb-1 animate-bounce">
                    Shipper ({etaMinutes}p)
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-300/40">
                    <Bike className="w-5 h-5" />
                  </div>
                </motion.div>

                <div className="absolute top-4 right-8 flex flex-col items-center">
                  <div className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md mb-1">
                    Địa chỉ của bạn
                  </div>
                  <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Driver Profile Card */}
              {currentOrder.driver && (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <img 
                      src={currentOrder.driver.avatar} 
                      alt={currentOrder.driver.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                          {currentOrder.driver.name}
                        </h4>
                        <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {currentOrder.driver.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {currentOrder.driver.vehicle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${currentOrder.driver.phone}`}
                      className="w-10 h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md transition-colors"
                      title="Gọi cho tài xế"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Order Details Accordion */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span>Chi tiết các món ({currentOrder.items?.length || 0})</span>
              <span>Tổng: {formatCurrency(currentOrder.total)}</span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {currentOrder.items?.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 dark:border-gray-800/50"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-bold text-orange-500">{item.quantity}x</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white shrink-0">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            {/* Destination Info */}
            <div className="pt-2 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>
                <strong>{isDineIn ? 'Bàn phục vụ:' : 'Địa chỉ giao:'}</strong> {currentOrder.customer?.address || 'Tại quán'}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Món ăn được đảm bảo tươi ngon 100%</span>
          </div>

          <button
            onClick={() => setIsTrackingOpen(false)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Đã Hiểu
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default OrderTrackingModal;
