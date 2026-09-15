import React, { createContext, useContext, useState, useEffect } from 'react';
import { foods as initialFoods, vouchers as initialVouchers } from '../data/foods';
import { restaurantTables } from '../data/tables';
import { ordersAPI, foodsAPI, vouchersAPI } from '../services/api';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { currentUser: authUser } = useAuth();
  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('gourmet_theme');
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gourmet_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gourmet_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Sound effects toggle
  const [soundEnabled, setSoundEnabled] = useState(true);
  const toggleSound = () => setSoundEnabled(prev => !prev);

  const playSound = (type = 'click') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'cart') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (e) {
      // Audio context might fail on initial user interaction restriction
    }
  };

  // Cart state with localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('gourmet_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('gourmet_cart', JSON.stringify(cart));
  }, [cart]);

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('gourmet_wishlist');
      return saved ? JSON.parse(saved) : ['f1', 'f3'];
    } catch {
      return ['f1', 'f3'];
    }
  });

  useEffect(() => {
    localStorage.setItem('gourmet_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (foodId) => {
    setWishlist(prev => {
      const isExist = prev.includes(foodId);
      const updated = isExist ? prev.filter(id => id !== foodId) : [...prev, foodId];
      showToast(isExist ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích ❤️', 'info');
      return updated;
    });
  };

  const isWishlisted = (foodId) => wishlist.includes(foodId);

  // Voucher state
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  // Modal controls
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedFoodForDetail, setSelectedFoodForDetail] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Modals cho khách hàng: Hồ sơ, Lịch sử giao dịch, Món yêu thích
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Quản lý Bàn Ăn & Gọi Món Tại Bàn
  const [diningMode, setDiningMode] = useState('delivery'); // 'delivery' | 'dine_in'
  const [selectedTable, setSelectedTable] = useState(null);
  const [isTableQROpen, setIsTableQROpen] = useState(false);

  // Tự động nhận diện bàn qua URL param: ?table=B03 hoặc ?ban=3
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const tableParam = searchParams.get('table') || searchParams.get('ban');
      if (tableParam) {
        const found = restaurantTables.find(
          t => t.code.toLowerCase() === tableParam.toLowerCase() ||
               t.id.toLowerCase() === tableParam.toLowerCase() ||
               t.name.toLowerCase().includes(tableParam.toLowerCase())
        );
        if (found) {
          setSelectedTable(found);
          setDiningMode('dine_in');
          setTimeout(() => {
            showToast(`🎉 Chào mừng quý khách tại ${found.name} (${found.area})! Phí phục vụ tại bàn 0đ.`, 'success');
          }, 600);
          // Log phiên quét mã QR qua URL param lên Supabase
          supabase.from('table_sessions').insert({
            user_id: null,
            customer_name: null,
            customer_phone: null,
            table_code: found.code,
            table_name: found.name,
            table_area: found.area || null,
            table_floor: found.floor || null,
            session_type: 'url_param',
            created_at: new Date().toISOString(),
          }).then(() => {
            console.log(`✅ Logged table_session (url_param): ${found.name}`);
          }).catch(() => {});
        }
      }
    } catch (_) {}
  }, []);

  // Toast notification system
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'under100', '100-250', 'above250'
  const [dietaryFilter, setDietaryFilter] = useState([]); // ['vegetarian', 'spicy', 'bestseller']
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price-low', 'price-high', 'rating'

  // Cart operations
  const addToCart = (food, customConfig = {}) => {
    const selectedSize = customConfig.selectedSize || food.customizations?.sizes?.[0] || null;
    const selectedToppings = customConfig.selectedToppings || [];
    const notes = customConfig.notes || '';
    const quantity = customConfig.quantity || 1;

    const sizePrice = selectedSize ? selectedSize.priceOffset : 0;
    const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    const unitPrice = food.price + sizePrice + toppingsPrice;

    // Create a unique key based on food id and customizations
    const customKey = `${food.id}-${selectedSize?.name || 'default'}-${selectedToppings.map(t => t.id).sort().join(',')}-${notes}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === customKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].totalPrice = updated[existingIndex].quantity * unitPrice;
        return updated;
      } else {
        return [
          ...prev,
          {
            ...food,
            cartItemId: customKey,
            selectedSize,
            selectedToppings,
            notes,
            unitPrice,
            quantity,
            totalPrice: quantity * unitPrice
          }
        ];
      }
    });

    playSound('cart');
    showToast(`Đã thêm "${food.name}" vào giỏ hàng!`, 'success');
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Đã xóa món khỏi giỏ hàng', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Delivery fee logic: Free if >= 200,000 VND or with FREESHIP voucher, else 25,000 VND. Free (0đ) if dining at table!
  let deliveryFee = cartSubtotal > 0 ? (cartSubtotal >= 200000 ? 0 : 25000) : 0;
  if (diningMode === 'dine_in') {
    deliveryFee = 0;
  }

  let voucherDiscount = 0;
  if (appliedVoucher && cartSubtotal > 0) {
    if (appliedVoucher.minSpend && cartSubtotal < appliedVoucher.minSpend) {
      // Not met minimum spend
    } else if (appliedVoucher.discountType === 'shipping') {
      deliveryFee = 0;
      voucherDiscount = 25000;
    } else if (appliedVoucher.discountType === 'percent') {
      const calculated = (cartSubtotal * appliedVoucher.discount) / 100;
      voucherDiscount = appliedVoucher.maxDiscount ? Math.min(calculated, appliedVoucher.maxDiscount) : calculated;
    } else if (appliedVoucher.discountType === 'fixed') {
      voucherDiscount = Math.min(appliedVoucher.discount, cartSubtotal);
    }
  }

  const [vouchers, setVouchers] = useState(initialVouchers);
  const [foodsList, setFoodsList] = useState(initialFoods);

  useEffect(() => {
    vouchersAPI.getAll()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setVouchers(data);
      })
      .catch(() => {});

    foodsAPI.getAll()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setFoodsList(data);
      })
      .catch(() => {});
  }, []);

  const tax = cartSubtotal > 0 ? Math.round(cartSubtotal * 0.05) : 0; // 5% VAT
  const cartTotal = Math.max(0, cartSubtotal + deliveryFee + tax - voucherDiscount);

  // Voucher operations
  const applyVoucher = (code) => {
    const found = vouchers.find(v => v.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      showToast('Mã giảm giá không hợp lệ!', 'error');
      return false;
    }
    if (cartSubtotal < found.minSpend) {
      showToast(`Mã này yêu cầu đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN').format(found.minSpend)}đ`, 'error');
      return false;
    }
    setAppliedVoucher(found);
    playSound('success');
    showToast(`Áp dụng thành công mã ${found.code}!`, 'success');
    return true;
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    showToast('Đã hủy mã giảm giá', 'info');
  };

  // Open food detail modal
  const openDetailModal = (food) => {
    setSelectedFoodForDetail(food);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedFoodForDetail(null);
  };

  // Checkout and tracking
  const openCheckout = () => {
    if (cart.length === 0) {
      showToast('Giỏ hàng của bạn đang trống!', 'error');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => setIsCheckoutOpen(false);

  const placeOrder = async (orderData) => {
    const driverInfo = {
      name: 'Nguyễn Văn Hùng',
      phone: '0988.123.456',
      rating: 4.95,
      vehicle: 'Honda Wave - 29A1-889.99',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };

    const orderId = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const isDineIn = diningMode === 'dine_in' && selectedTable;
    const finalAddress = isDineIn
      ? `Dùng tại bàn: ${selectedTable.name} (${selectedTable.area})`
      : (orderData.address || '');

    const newOrder = {
      orderId,
      createdAt: now,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discount: voucherDiscount,
      tax,
      total: cartTotal,
      customer: {
        ...orderData,
        address: finalAddress,
        orderType: diningMode,
        tableNumber: selectedTable?.name || null,
        tableArea: selectedTable?.area || null
      },
      orderType: diningMode,
      tableNumber: selectedTable?.name || null,
      tableArea: selectedTable?.area || null,
      status: 'confirmed',
      estimatedTime: isDineIn 
        ? '10-15 phút' 
        : (orderData.deliveryType === 'scheduled' && orderData.scheduledTime 
            ? `Hẹn giao: ${orderData.scheduledTime}` 
            : '20-25 phút'),
      driver: isDineIn ? null : driverInfo
    };

    // 1. Lưu lên Supabase (với cơ chế tự tương thích schema)
    try {
      const orderPayloadFull = {
        id: orderId,
        user_id: authUser?.id || null,
        customer_name: orderData.name || orderData.fullName || 'Khách hàng',
        customer_phone: orderData.phone || '0901234567',
        customer_address: finalAddress || 'Toà nhà Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh, TP.HCM',
        payment_method: orderData.paymentMethod || 'cod',
        notes: isDineIn 
          ? `[DÙNG TẠI BÀN: ${selectedTable?.name || ''}] ${orderData.note || orderData.notes || ''}`.trim()
          : (orderData.note || orderData.notes || ''),
        delivery_type: isDineIn ? 'dine_in' : (orderData.deliveryType || 'now'),
        scheduled_time: orderData.deliveryType === 'scheduled' ? (orderData.scheduledTime || null) : null,
        subtotal: cartSubtotal,
        delivery_fee: deliveryFee,
        discount: voucherDiscount,
        tax,
        total: cartTotal,
        voucher_code: appliedVoucher?.code || null,
        status: 'confirmed',
        estimated_time: isDineIn 
          ? '10-15 phút' 
          : (orderData.deliveryType === 'scheduled' && orderData.scheduledTime 
              ? `Hẹn giao: ${orderData.scheduledTime}` 
              : '20-25 phút'),
        driver: isDineIn ? null : driverInfo,
        order_type: diningMode,
        table_number: selectedTable?.name || null,
        table_area: selectedTable?.area || null,
        created_at: now,
      };

      let { error: orderError } = await supabase
        .from('orders')
        .insert(orderPayloadFull);

      // Nếu Supabase chưa có cột order_type / table_number / driver, tự động loại bỏ cột mở rộng và lưu lại
      if (orderError && orderError.message?.includes('Could not find')) {
        console.warn('⚠️ Supabase đang dùng schema cơ bản, tự động tương thích...');
        const orderPayloadBasic = {
          id: orderId,
          user_id: authUser?.id || null,
          customer_name: orderData.name || orderData.fullName || 'Khách hàng',
          customer_phone: orderData.phone || '0901234567',
          customer_address: finalAddress || 'Toà nhà Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh, TP.HCM',
          payment_method: orderData.paymentMethod || 'cod',
          notes: isDineIn ? `[DÙNG TẠI BÀN ${selectedTable?.name} - ${selectedTable?.area}] ${orderData.note || ''}`.trim() : (orderData.note || ''),
          subtotal: cartSubtotal,
          delivery_fee: deliveryFee,
          discount: voucherDiscount,
          tax,
          total: cartTotal,
          voucher_code: appliedVoucher?.code || null,
          status: 'confirmed',
          estimated_time: isDineIn ? '10-15 phút' : '20-25 phút',
          created_at: now,
        };

        const retryRes = await supabase.from('orders').insert(orderPayloadBasic);
        orderError = retryRes.error;
      }

      if (!orderError) {
        // Lưu chi tiết từng món lên Supabase
        const itemsToInsert = cart.map(item => ({
          order_id: orderId,
          food_id: String(item.id || ''),
          food_name: item.name || 'Món ăn',
          quantity: item.quantity || 1,
          unit_price: item.unitPrice || item.price || 0,
          total_price: item.totalPrice || ((item.unitPrice || item.price || 0) * (item.quantity || 1)),
          selected_size: item.selectedSize?.name || '',
          selected_toppings: item.selectedToppings || [],
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsToInsert);

        if (!itemsError) {
          console.log('✅ Đơn hàng & món ăn đã lưu lên Supabase thành công!');
        } else {
          console.warn('⚠️ Lỗi lưu chi tiết món lên Supabase:', itemsError.message);
        }
      } else {
        console.warn('⚠️ Lỗi lưu đơn hàng lên Supabase:', orderError.message);
      }
    } catch (supErr) {
      console.warn('⚠️ Không thể kết nối Supabase, tiếp tục xử lý offline:', supErr.message);
    }

    // 2. Lưu lên backend SQLite (fallback)
    try {
      await ordersAPI.create({
        customer: { ...orderData, address: finalAddress },
        items: cart,
        subtotal: cartSubtotal,
        deliveryFee,
        discount: voucherDiscount,
        tax,
        total: cartTotal,
        voucherCode: appliedVoucher?.code || null,
        notes: orderData.note || '',
        orderType: diningMode,
        tableNumber: selectedTable?.name || null
      });
    } catch (_) {}

    // Lưu đơn hàng vào lịch sử giao dịch của khách hàng
    try {
      const savedOrders = JSON.parse(localStorage.getItem('ken_user_orders') || '[]');
      savedOrders.unshift({
        id: orderId,
        customerName: orderData.name || orderData.fullName || '',
        customerPhone: orderData.phone || '',
        customerAddress: finalAddress,
        orderType: diningMode,
        tableNumber: selectedTable?.name || null,
        items: cart,
        total: cartTotal,
        status: 'confirmed',
        createdAt: now,
        paymentMethod: orderData.paymentMethod || 'cod'
      });
      localStorage.setItem('ken_user_orders', JSON.stringify(savedOrders.slice(0, 20)));
    } catch (_) {}

    setCurrentOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsTrackingOpen(true);
    playSound('success');
    showToast(isDineIn ? `Gọi món tại ${selectedTable.name} thành công!` : 'Đơn hàng đã được lưu thành công!', 'success');
  };

  // User state mock (initially empty)
  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: ''
  });

  return (
    <CartContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        soundEnabled,
        toggleSound,
        playSound,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        totalItemsCount,
        deliveryFee,
        voucherDiscount,
        tax,
        cartTotal,
        vouchers,
        foodsList,
        setFoodsList,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        wishlist,
        toggleWishlist,
        isWishlisted,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isDetailModalOpen,
        selectedFoodForDetail,
        openDetailModal,
        closeDetailModal,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        placeOrder,
        isTrackingOpen,
        setIsTrackingOpen,
        currentOrder,
        setCurrentOrder,
        isReservationOpen,
        setIsReservationOpen,
        openReservation: () => setIsReservationOpen(true),
        closeReservation: () => setIsReservationOpen(false),
        isAuthOpen,
        setIsAuthOpen,
        currentUser,
        setCurrentUser,
        toast,
        showToast,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceFilter,
        setPriceFilter,
        dietaryFilter,
        setDietaryFilter,
        sortBy,
        setSortBy,
        isProfileOpen,
        setIsProfileOpen,
        openProfile: () => setIsProfileOpen(true),
        closeProfile: () => setIsProfileOpen(false),
        isOrderHistoryOpen,
        setIsOrderHistoryOpen,
        openOrderHistory: () => setIsOrderHistoryOpen(true),
        closeOrderHistory: () => setIsOrderHistoryOpen(false),
        isWishlistOpen,
        setIsWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
        diningMode,
        setDiningMode,
        selectedTable,
        setSelectedTable,
        isTableQROpen,
        setIsTableQROpen,
        openTableQR: () => setIsTableQROpen(true),
        closeTableQR: () => setIsTableQROpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
