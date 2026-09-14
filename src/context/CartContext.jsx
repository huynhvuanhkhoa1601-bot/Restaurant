import React, { createContext, useContext, useState, useEffect } from 'react';
import { foods as initialFoods, vouchers as initialVouchers } from '../data/foods';
import { ordersAPI, foodsAPI, vouchersAPI } from '../services/api';
import { supabase } from '../lib/supabase';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
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

  // Delivery fee logic: Free if >= 200,000 VND or with FREESHIP voucher, else 25,000 VND
  let deliveryFee = cartSubtotal > 0 ? (cartSubtotal >= 200000 ? 0 : 25000) : 0;

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

    const newOrder = {
      orderId,
      createdAt: now,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discount: voucherDiscount,
      tax,
      total: cartTotal,
      customer: orderData,
      status: 'confirmed',
      estimatedTime: '20-25 phút',
      driver: driverInfo
    };

    // 1. Lưu lên Supabase
    try {
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          customer_name: orderData.name || orderData.fullName || '',
          customer_phone: orderData.phone || '',
          customer_address: orderData.address || '',
          payment_method: orderData.paymentMethod || 'cod',
          notes: orderData.note || orderData.notes || '',
          subtotal: cartSubtotal,
          delivery_fee: deliveryFee,
          discount: voucherDiscount,
          tax,
          total: cartTotal,
          voucher_code: appliedVoucher?.code || null,
          status: 'confirmed',
          estimated_time: '20-25 phút',
          driver: driverInfo,
          created_at: now,
        });

      if (!orderError) {
        // Lưu chi tiết từng món lên Supabase
        const itemsToInsert = cart.map(item => ({
          order_id: orderId,
          food_id: item.id || '',
          food_name: item.name || '',
          quantity: item.quantity || 1,
          unit_price: item.unitPrice || item.price || 0,
          total_price: item.totalPrice || (item.unitPrice * item.quantity) || 0,
          selected_size: item.selectedSize?.name || '',
          selected_toppings: item.selectedToppings || [],
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsToInsert);

        if (!itemsError) {
          console.log('✅ Đơn hàng đã lưu lên Supabase thành công!');
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
        customer: orderData,
        items: cart,
        subtotal: cartSubtotal,
        deliveryFee,
        discount: voucherDiscount,
        tax,
        total: cartTotal,
        voucherCode: appliedVoucher?.code || null,
        notes: orderData.note || ''
      });
    } catch (_) {}

    setCurrentOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsTrackingOpen(true);
    playSound('success');
    showToast('Đơn hàng đã được lưu thành công!', 'success');
  };

  // User state mock
  const [currentUser, setCurrentUser] = useState({
    name: 'Khách hàng Thân thiết',
    email: 'khachhang@gourmetfeast.vn',
    phone: '0912.345.678',
    address: 'Toà nhà Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh, TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
