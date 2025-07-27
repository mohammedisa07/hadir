import { useState, useEffect } from 'react';

interface MenuItem {
  id?: string;
  _id?: string;
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
  _id?: string;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on initialization
  useEffect(() => {
    const savedCart = localStorage.getItem('currentCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem('currentCart');
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('currentCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    const itemId = item.id || item._id || '';
    const existingItem = cart.find(cartItem => 
      cartItem.id === itemId || cartItem._id === itemId
    );
    if (existingItem) {
      setCart(prevCart => prevCart.map(cartItem => 
        (cartItem.id === itemId || cartItem._id === itemId)
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart(prevCart => [...prevCart, { ...item, id: itemId, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === id || item._id === id) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id && item._id !== id));
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