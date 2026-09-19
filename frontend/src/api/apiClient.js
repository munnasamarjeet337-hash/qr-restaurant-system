import axios from 'axios';

// Detect API Base URL:
// 1. If VITE_API_URL is set, use it.
// 2. In dev (port 5173 or 3000), construct http://<current_hostname>:5000/api
// 3. Otherwise, use relative /api
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname || 'localhost';
    if (window.location.port === '5173' || window.location.port === '3000') {
      return `http://${hostname}:5000/api`;
    }
  }
  return '/api';
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Categories & Menu
export const getCategories = async () => {
  const res = await apiClient.get('/categories');
  return res.data;
};

export const getMenuItems = async (params = {}) => {
  const res = await apiClient.get('/menu', { params });
  return res.data;
};

export const getMenuItemById = async (id) => {
  const res = await apiClient.get(`/menu/${id}`);
  return res.data;
};

// Tables
export const getTables = async () => {
  const res = await apiClient.get('/tables');
  return res.data;
};

export const getTableDetails = async (tableNumber) => {
  const res = await apiClient.get(`/tables/${tableNumber}`);
  return res.data;
};

export const requestTableBill = async (tableNumber) => {
  const res = await apiClient.post(`/tables/${tableNumber}/request-bill`);
  return res.data;
};

export const settleTableBill = async (tableNumber) => {
  const res = await apiClient.post(`/tables/${tableNumber}/settle`);
  return res.data;
};

// Orders
export const createOrder = async (orderPayload) => {
  const res = await apiClient.post('/orders', orderPayload);
  return res.data;
};

export const getOrders = async (params = {}) => {
  const res = await apiClient.get('/orders', { params });
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await apiClient.patch(`/orders/${orderId}/status`, { status });
  return res.data;
};

// QR Code
export const generateQrCodeApi = async (url, table) => {
  const res = await apiClient.get('/qr/generate', { params: { url, table } });
  return res.data;
};

// Admin reset
export const resetDemoDatabase = async () => {
  const res = await apiClient.post('/tables/admin/reset');
  return res.data;
};
