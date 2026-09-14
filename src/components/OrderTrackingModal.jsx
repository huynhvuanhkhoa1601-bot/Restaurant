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
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../data/foods';

const OrderTrackingModal = () => {
  const { isTrackingOpen, setIsTrackingOpen, currentOrder } = useCart();
  const [currentStep, setCurrentStep] = useState(1); // 0: Placed, 1: Preparing, 2: Delivering, 3: Completed
  const [etaMinutes, setEtaMinutes] = useState(18);

  useEffect(() => {
    if (!isTrackingOpen) return;

    // Simulate order progression
    const timer1 = setTimeout(() => setCurrentStep(1), 2000);
    const timer2 = setTimeout(() => {
      setCurrentStep(2);
      setEtaMinutes(12);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isTrackingOpen]);

  if (!isTrackingOpen || !currentOrder) return null;

  const steps = [
    { title: 'Tiếp nhận đơn', desc: 'Nhà hàng đã xác nhận', icon: <CheckCircle2 className="w-5 h-5" /> },
    { title: 'Đang chế biến', desc: 'Đầu bếp 5 sao chuẩn bị', icon: <ChefHat className="w-5 h-5" /> },
    { title: 'Đang giao hàng', desc: 'Tài xế đang trên đường', icon: <Bike className="w-5 h-5" /> },
    { title: 'Giao hoàn tất', desc: 'Thưởng thức ngon miệng!', icon: <PackageCheck className="w-5 h-5" /> },
  ];

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
            <span>Mã Đơn: #{currentOrder.orderId}</span>
          </div>

          <h2 className="text-2xl font-black mb-1">
            {currentStep === 2 ? 'Tài Xế Đang Giao Đến Bạn!' : 'Đang Chuẩn Bị Món Ăn Nóng Hổi'}
          </h2>
          <p className="text-xs text-orange-100 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Thời gian dự kiến nhận hàng: <strong>{etaMinutes} phút nữa</strong></span>
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

          {/* Simulated Map View with Animated Delivery Vehicle */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-emerald-950/10">
            {/* Map Background Pattern */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Mock Route Line */}
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

            {/* Restaurant Pin */}
            <div className="absolute bottom-6 left-8 flex flex-col items-center">
              <div className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md mb-1">
                Nhà hàng GourmetFeast
              </div>
              <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg">
                🍴
              </div>
            </div>

            {/* Driver Marker */}
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

            {/* Customer Home Pin */}
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
              <button
                onClick={() => alert(`Đang mở khung trò chuyện với tài xế ${currentOrder.driver.name}`)}
                className="w-10 h-10 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-md transition-colors"
                title="Nhắn tin"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Danh Sách Món Đã Đặt ({currentOrder.items.length})
            </h4>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-orange-500">{item.quantity}x</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 flex justify-between text-sm font-extrabold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700">
              <span>Tổng thanh toán:</span>
              <span className="text-orange-600 dark:text-orange-400">
                {formatCurrency(currentOrder.total)}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/90 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setIsTrackingOpen(false)}
            className="w-full py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-md"
          >
            Đóng Trình Theo Dõi
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default OrderTrackingModal;
