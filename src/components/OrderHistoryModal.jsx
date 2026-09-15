import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ReceiptText, Clock, MapPin, CheckCircle2, 
  Truck, ArrowRight, ShoppingBag, RotateCcw, AlertCircle, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../data/foods';

const OrderHistoryModal = () => {
  const { currentUser } = useAuth();
  const { 
    isOrderHistoryOpen, closeOrderHistory, 
    setCurrentOrder, setIsTrackingOpen, 
    addToCart, showToast 
  } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders from REST API and Supabase
  useEffect(() => {
    if (!isOrderHistoryOpen) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        let foundOrders = [];

        // 1. Kiểm tra đơn hàng đã lưu trong localStorage của khách hàng
        try {
          const cachedOrders = JSON.parse(localStorage.getItem('ken_user_orders') || '[]');
          if (Array.isArray(cachedOrders) && cachedOrders.length > 0) {
            foundOrders = [...cachedOrders];
          }
        } catch (_) {}

        // 2. Lấy đơn hàng từ Supabase theo số điện thoại hoặc tên khách hàng
        if (currentUser?.phone || currentUser?.name) {
          try {
            const filters = [];
            if (currentUser.phone) filters.push(`customer_phone.eq.${currentUser.phone}`);
            if (currentUser.name) filters.push(`customer_name.ilike.%${currentUser.name}%`);

            if (filters.length > 0) {
              const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .or(filters.join(','))
                .order('created_at', { ascending: false });

              if (!error && data && data.length > 0) {
                const existingIds = new Set(foundOrders.map(o => o.id));
                data.forEach(ord => {
                  if (!existingIds.has(ord.id)) {
                    foundOrders.push({
                      id: ord.id,
                      customerName: ord.customer_name,
                      customerPhone: ord.customer_phone,
                      customerAddress: ord.customer_address,
                      items: ord.order_items || [],
                      total: ord.total || 0,
                      status: ord.status || 'confirmed',
                      createdAt: ord.created_at,
                      paymentMethod: ord.payment_method || 'cod'
                    });
                  }
                });
              }
            }
          } catch (supErr) {
            console.warn('Supabase order history fetch:', supErr);
          }
        }

        // 3. Fallback lấy từ REST API / SQLite
        try {
          const res = await ordersAPI.getMyOrders();
          if (res && res.orders && res.orders.length > 0) {
            const existingIds = new Set(foundOrders.map(o => o.id));
            res.orders.forEach(ro => {
              if (!existingIds.has(ro.id)) {
                foundOrders.push(ro);
              }
            });
          }
        } catch (apiErr) {
          console.warn('REST API my orders:', apiErr);
        }

        setOrders(foundOrders);
      } catch (err) {
        console.error('Lỗi lấy lịch sử đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isOrderHistoryOpen, currentUser]);

  if (!isOrderHistoryOpen) return null;

  const handleTrackOrder = (order) => {
    setCurrentOrder(order);
    closeOrderHistory();
    setIsTrackingOpen(true);
  };

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        addToCart({
          id: item.food_id || item.id,
          name: item.food_name || item.name,
          price: item.unit_price || item.price,
          image: item.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
          selectedSize: item.selected_size,
          selectedToppings: item.selected_toppings,
        });
      });
      if (showToast) {
        showToast(`Đã thêm lại ${order.items.length} món vào giỏ hàng!`, 'success');
      }
      closeOrderHistory();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Đã xác nhận', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' };
      case 'preparing':
        return { label: 'Đang nấu', color: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300' };
      case 'shipping':
        return { label: 'Đang giao hàng', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' };
      case 'delivered':
      case 'completed':
        return { label: 'Đã giao thành công', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' };
      case 'cancelled':
        return { label: 'Đã hủy', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' };
      default:
        return { label: 'Đang xử lý', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' };
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
          onClick={closeOrderHistory}
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
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ReceiptText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  Lịch Sử Giao Dịch & Đơn Hàng
                </h3>
                <p className="text-xs text-gray-400">
                  Theo dõi trạng thái và chi tiết các đơn bạn đã đặt
                </p>
              </div>
            </div>

            <button
              onClick={closeOrderHistory}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Orders List */}
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold text-gray-400">Đang tải lịch sử giao dịch...</p>
              </div>
            ) : orders.length > 0 ? (
              orders.map((order) => {
                const statusBadge = getStatusBadge(order.status);
                const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : 'Gần đây';

                return (
                  <div
                    key={order.id}
                    className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 sm:p-5 border border-gray-200/70 dark:border-gray-700/60 hover:border-emerald-500/40 transition-colors"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                            Mã: #{order.id}
                          </span>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusBadge.color}`}>
                            {statusBadge.label}
                          </span>
                          {(order.tableNumber || (order.customerAddress && order.customerAddress.startsWith('Dùng tại bàn:'))) && (
                            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              🍽️ {order.tableNumber || 'Tại Bàn'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{orderDate}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-400">Tổng tiền</span>
                        <p className="text-base font-black text-orange-600 dark:text-orange-400">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>

                    {/* Delivery address */}
                    {order.customerAddress && (
                      <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3 bg-white/70 dark:bg-gray-900/50 p-2.5 rounded-xl">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="truncate">{order.customerAddress}</span>
                      </div>
                    )}

                    {/* Order Items Preview */}
                    {order.items && order.items.length > 0 && (
                      <div className="space-y-1.5 mb-4">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
                            <span className="truncate font-medium max-w-[70%]">
                              • {item.food_name || item.name} <span className="text-gray-400">x{item.quantity || 1}</span>
                            </span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency((item.unit_price || item.price || 0) * (item.quantity || 1))}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-[11px] text-gray-400 italic">
                            + {order.items.length - 3} món ăn khác...
                          </p>
                        )}
                      </div>
                    )}

                    {/* Order Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-3 py-2 rounded-xl bg-gray-200/80 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Đặt Lại
                      </button>
                      <button
                        onClick={() => handleTrackOrder(order)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/30"
                      >
                        <Eye className="w-3.5 h-3.5" /> Chi Tiết & Theo Dõi
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty state */
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-extrabold text-gray-900 dark:text-white mb-1">
                  Chưa có giao dịch nào
                </h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-5">
                  Bạn chưa đặt món ăn nào tại KenRestaurant. Hãy khám phá ngay thực đơn thượng hạng với nhiều ưu đãi!
                </p>
                <button
                  onClick={closeOrderHistory}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25"
                >
                  Khám Phá Thực Đơn Ngay →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderHistoryModal;
