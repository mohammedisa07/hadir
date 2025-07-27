const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper function for API calls with better error handling
async function apiCall(url: string, options: RequestInit = {}) {
  try {
    console.log(`Making API call to: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`API Response from ${url}:`, data);
    return data;
  } catch (error) {
    console.error(`API Call failed for ${url}:`, error);
    throw error;
  }
}

// Auth
export async function register(name: string, email: string, password: string) {
  return apiCall(`${API_BASE}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

export async function login(email: string, password: string) {
  const data = await apiCall(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export function logout() {
  localStorage.removeItem('token');
}

// Menu
export async function getMenuItems() {
  return apiCall(`${API_BASE}/menu`);
}

export async function addMenuItem(item) {
  return apiCall(`${API_BASE}/menu`, {
    method: 'POST',
    body: JSON.stringify(item)
  });
}

export async function updateMenuItem(id, item) {
  return apiCall(`${API_BASE}/menu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item)
  });
}

export async function deleteMenuItem(id) {
  return apiCall(`${API_BASE}/menu/${id}`, {
    method: 'DELETE'
  });
}

// Orders
export async function placeOrder(items: any[]) {
  return apiCall(`${API_BASE}/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ items })
  });
}

export async function getMyOrders() {
  return apiCall(`${API_BASE}/orders/my`, {
    headers: authHeaders()
  });
}

export async function getOrder(id: string) {
  return apiCall(`${API_BASE}/orders/${id}`, {
    headers: authHeaders()
  });
}

export async function getAllOrders() {
  return apiCall(`${API_BASE}/orders`);
}

// Receipts
export async function getMyReceipts() {
  return apiCall(`${API_BASE}/receipts/my`, {
    headers: authHeaders()
  });
}

export async function getReceipt(id: string) {
  return apiCall(`${API_BASE}/receipts/${id}`, {
    headers: authHeaders()
  });
} 