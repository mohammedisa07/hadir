import { useState, useEffect } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  isPopular?: boolean;
  isAvailable?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on initialization
  useEffect(() => {
    const savedCart = localStorage.getItem('currentCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('currentCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('currentCart');
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice
  };
};