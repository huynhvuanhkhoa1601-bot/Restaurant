/**
 * =========================================================================
 * 🌐 API SERVICE LAYER - TƯƠNG TÁC VỚI DATABASE BACKEND
 * =========================================================================
 */

const API_BASE = '/api';

// Helper gửi request kèm Token xác thực
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('kenrestaurant_token') || sessionStorage.getItem('kenrestaurant_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || 'Có lỗi xảy ra khi xử lý yêu cầu');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

// 🔐 AUTH APIs
export const authAPI = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  getMe: () => request('/auth/me'),

  updateProfile: (profile) => request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profile)
  })
};

// 🍽️ FOODS & CATEGORIES APIs
export const foodsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.dietary && params.dietary !== 'all') query.append('dietary', params.dietary);

    const qs = query.toString();
    return request(`/foods${qs ? `?${qs}` : ''}`);
  },

  getById: (id) => request(`/foods/${id}`),

  create: (food) => request('/foods', {
    method: 'POST',
    body: JSON.stringify(food)
  })
};

export const categoriesAPI = {
  getAll: () => request('/categories')
};

// 🎟️ VOUCHERS APIs
export const vouchersAPI = {
  getAll: () => request('/vouchers')
};

// 🛒 ORDERS APIs
export const ordersAPI = {
  create: (orderData) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),

  getById: (orderId) => request(`/orders/${orderId}`),

  getMyOrders: () => request('/orders/user/my-orders')
};

// 📅 RESERVATIONS APIs
export const reservationsAPI = {
  create: (reservationData) => request('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservationData)
  })
};

// ⭐ REVIEWS APIs
export const reviewsAPI = {
  getAll: () => request('/reviews'),

  create: (reviewData) => request('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  })
};
