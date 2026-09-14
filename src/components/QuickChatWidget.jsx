import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { foods } from '../data/foods';

const QuickChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Chào bạn! Mình là Trợ Lý Ẩm Thực GourmetFeast 🧑‍🍳. Bạn đang muốn ăn món gì hôm nay (Burger, Sushi, Đồ Chay, hay cần săn Voucher)?'
    }
  ]);
  const [input, setInput] = useState('');
  const { openDetailModal, applyVoucher, openCart } = useCart();

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMsgs = [...messages, { sender: 'user', text: userText }];
    setMessages(newMsgs);
    setInput('');

    // Generate intelligent food recommendation response
    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('burger') || lower.includes('bò')) {
        reply = 'Bạn hãy thử ngay Gourmet Wagyu Truffle Burger (185.000đ) - món bán chạy nhất với bò Wagyu A5 sốt nấm truffle đen thơm lừng nhé!';
      } else if (lower.includes('sushi') || lower.includes('nhật') || lower.includes('sashimi')) {
        reply = 'Combo Sushi Sashimi Hoàng Gia (380.000đ) với cá hồi Nauy tươi rói và lươn Nhật nướng sốt Kabayaki là lựa chọn điểm 10!';
      } else if (lower.includes('chay') || lower.includes('healthy') || lower.includes('salad')) {
        reply = 'Bạn có thể chọn Pizza Bốn Vị Phô Mai Mật Ong Ý hoặc Salad Ức Gà Nướng Bơ Quả Quinoa (380 kcal) rất thanh nhẹ!';
      } else if (lower.includes('voucher') || lower.includes('mã') || lower.includes('giảm giá')) {
        reply = 'Hôm nay có mã FEAST50 giảm ngay 50.000đ (đơn từ 250k) và mã FREESHIP miễn phí giao hàng!';
      } else if (lower.includes('giao') || lower.includes('ship')) {
        reply = 'GourmetFeast giao siêu tốc bằng hộp giữ nhiệt chỉ trong 20-30 phút và miễn phí giao hàng cho đơn từ 200k!';
      } else {
        reply = 'GourmetFeast có hơn 20+ món ăn thượng hạng từ Burger, Pizza, Sushi đến Bò Bít Tết Black Angus. Bạn có thể nhấn vào món ăn trên menu để xem chi tiết nhé!';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-500 text-white shadow-2xl flex items-center justify-center relative ring-4 ring-white dark:ring-gray-800"
        title="Trợ lý ẩm thực AI"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="absolute bottom-16 left-0 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-96 z-50"
          >
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black">AI Chef Concierge</h4>
                  <p className="text-[10px] text-orange-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Sẵn sàng tư vấn món ngon
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      m.sender === 'user'
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800 flex gap-1.5 overflow-x-auto text-[10px]">
              <button
                onClick={() => setInput('Gợi ý món bán chạy nhất')}
                className="px-2.5 py-1 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 whitespace-nowrap text-gray-700 dark:text-gray-300 font-medium"
              >
                🔥 Món bán chạy?
              </button>
              <button
                onClick={() => setInput('Cho mình xin mã voucher')}
                className="px-2.5 py-1 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 whitespace-nowrap text-gray-700 dark:text-gray-300 font-medium"
              >
                🎁 Mã giảm giá?
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi món ngon, calo, ưu đãi..."
                className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-orange-500 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickChatWidget;
