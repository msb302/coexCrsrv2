import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response.data;
  },
  (error) => {
    const { response } = error;
    
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: response?.status,
      data: response?.data,
      message: error.message
    });
    
    // Handle authentication errors
    if (response && response.status === 401) {
      // Clear credentials
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not on auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    // Create a more user-friendly error message
    const errorMessage = 
      response && response.data && response.data.message 
        ? response.data.message 
        : response && response.status === 500
          ? 'Server error. Please try again later.'
          : 'Network error. Please check your connection.';
    
    return Promise.reject(new Error(errorMessage));
  }
);

// API service methods
const apiService = {
  // Auth token methods
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
  
  clearAuthToken: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },
  
  // Auth endpoints
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  
  // Products endpoints
  getProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  
  // Orders endpoints
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  
  // Payments endpoints
  getPayments: () => api.get('/payments'),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  createPayment: (formData) => api.post('/payments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updatePaymentStatus: (id, status) => api.put(`/payments/${id}/status`, { status }),
  
  // Delivery endpoints
  getDeliveries: () => api.get('/delivery'),
  getDeliveryById: (id) => api.get(`/delivery/${id}`),
  createDelivery: (deliveryData) => api.post('/delivery', deliveryData),
  confirmDelivery: (id, confirmationData) => api.put(`/delivery/${id}/confirm`, confirmationData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  // Admin endpoints
  getUsers: () => api.get('/auth/users'),
  updateCreditLimit: (id, creditLimit) => api.put(`/auth/users/${id}/credit-limit`, { creditLimit }),

  // Notification endpoints
  getNotifications: () => api.get('/notifications'),
  markNotificationAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllNotificationsAsRead: () => api.put('/notifications/read-all'),
  clearAllNotifications: () => api.delete('/notifications'),
};

export default apiService;