const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Auth
export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export function logout() {
  localStorage.removeItem('token');
}

// Menu
export async function getMenuItems() {
  const res = await fetch(`${API_BASE}/menu`);
  return res.json();
}

export async function addMenuItem(item) {
  const res = await fetch(`${API_BASE}/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return res.json();
}

export async function updateMenuItem(id, item) {
  const res = await fetch(`${API_BASE}/menu/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return res.json();
}

export async function deleteMenuItem(id) {
  const res = await fetch(`${API_BASE}/menu/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

// Orders
export async function placeOrder(items: any[]) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ items })
  });
  return res.json();
}

export async function getMyOrders() {
  const res = await fetch(`${API_BASE}/orders/my`, {
    headers: authHeaders()
  });
  return res.json();
}

export async function getOrder(id: string) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    headers: authHeaders()
  });
  return res.json();
}

export async function getAllOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  return res.json();
}

// Receipts
export async function getMyReceipts() {
  const res = await fetch(`${API_BASE}/receipts/my`, {
    headers: authHeaders()
  });
  return res.json();
}

export async function getReceipt(id: string) {
  const res = await fetch(`${API_BASE}/receipts/${id}`, {
    headers: authHeaders()
  });
  return res.json();
} 