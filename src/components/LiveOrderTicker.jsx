import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Clock, Sparkles, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '../data/foods';

const orderEvents = [
  {
    name: 'Anh Khoa (Tân Bình)',
    item: 'Gourmet Wagyu Truffle Burger',
    time: 'Cách đây 1 phút',
    badge: 'Đã giao 18P ⚡',
    avatar: '/images/avatar-anh-khoa.jpg'
  },
  {
    name: 'Quỳnh Giao (Quận 1)',
    item: 'Combo Sushi Sashimi Hoàng Gia',
    time: 'Cách đây 3 phút',
    badge: 'Mã KHOA -50k 🎁',
    avatar: '/images/avatar-quynh-giao.jpg'
  },
  {
    name: 'Thiên Kỳ (Bình Thạnh)',
    item: 'Pizza Hải Sản Pesto Ý',
    time: 'Cách đây 5 phút',
    badge: 'Freeship 🚚',
    avatar: '/images/avatar-thien-ky.jpg'
  },
  {
    name: 'Anh Pha (Gò Vấp)',
    item: 'Cơm Tấm Sườn Bì Chả Đặc Biệt',
    time: 'Cách đây 7 phút',
    badge: 'Best Seller 🔥',
    avatar: '/images/avatar-anh-pha.jpg'
  }
];

const LiveOrderTicker = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [liveViewers, setLiveViewers] = useState(38);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % orderEvents.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setLiveViewers(prev => Math.max(25, Math.min(65, prev + Math.floor(Math.random() * 5) - 2)));
    }, 3000);
    return () => clearInterval(viewerInterval);
  }, []);

  const currentEvent = orderEvents[currentIdx];

  return (
    <div className="bg-gradient-to-r from-gray-900 via-orange-950/70 to-gray-900 text-white py-2.5 px-4 border-y border-orange-500/20 shadow-inner overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        
        {/* Left: Live Activity Ticker */}
        <div className="flex items-center gap-2.5 min-h-[28px] overflow-hidden">
          <span className="flex items-center gap-1 font-extrabold text-orange-400 uppercase tracking-wider text-[11px] bg-orange-500/20 px-2 py-0.5 rounded-full shrink-0 border border-orange-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Vừa Đặt Món</span>
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-2 font-medium"
            >
              <img 
                src={currentEvent.avatar} 
                alt={currentEvent.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-orange-400 shrink-0" 
              />
              <span className="font-bold text-white truncate max-w-[120px] sm:max-w-none">
                {currentEvent.name}
              </span>
              <span className="text-gray-400 hidden md:inline">vừa đặt</span>
              <span className="font-extrabold text-orange-400 underline decoration-orange-500/50 decoration-wavy underline-offset-2 truncate max-w-[150px] sm:max-w-none">
                {currentEvent.item}
              </span>
              <span className="text-[10px] bg-orange-500/20 text-orange-300 font-bold px-2 py-0.5 rounded-full shrink-0 hidden sm:inline">
                {currentEvent.badge}
              </span>
              <span className="text-gray-400 text-[10px] shrink-0">
                ({currentEvent.time})
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Live Realtime Visitors Counter */}
        <div className="flex items-center gap-4 text-gray-400 text-[11px] shrink-0">
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span><strong className="text-white font-mono">{liveViewers}</strong> người đang xem thực đơn</span>
          </div>
          <div className="hidden lg:flex items-center gap-1 text-amber-300">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Bếp đang hoạt động 100% công suất</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveOrderTicker;
