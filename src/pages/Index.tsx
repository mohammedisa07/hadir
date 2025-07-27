import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { CategorySidebar } from '@/components/CategorySidebar';
import { PosSystem } from '@/components/PosSystem';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useCart } from '@/hooks/useCart';
import { Coffee, Cookie, Sandwich, Salad, Wine, ChefHat } from "lucide-react";
// REMOVE: import { getMenuItems } from '../lib/api';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  itemCount: number;
  color: string;
}

const defaultCategories: Category[] = [
  { id: 'hotbeverages', name: 'HOT BEVERAGES', icon: ChefHat, itemCount: 0, color: 'bg-primary' },
  { id: 'coldbeverages', name: 'COLD BEVERAGES', icon: Wine, itemCount: 0, color: 'bg-cafe-gold' },
  { id: 'sparklings', name: 'SPARKLINGS', icon: Wine, itemCount: 0, color: 'bg-cafe-gold' },
  { id: 'vegsnacks', name: 'VEG SNACKS', icon: Salad, itemCount: 0, color: 'bg-success' },
  { id: 'nonvegsnacks', name: 'NON-VEG SNACKS', icon: Sandwich, itemCount: 0, color: 'bg-accent' },
  { id: 'vegfries', name: 'VEG FRIES', icon: Cookie, itemCount: 0, color: 'bg-cafe-cinnamon' },
  { id: 'nonvegfries', name: 'NON-VEG FRIES', icon: Sandwich, itemCount: 0, color: 'bg-accent' },
  { id: 'desserts', name: 'DESSERTS', icon: Cookie, itemCount: 0, color: 'bg-cafe-cinnamon' },
  { id: 'addons', name: 'ADD-ONS', icon: Cookie, itemCount: 0, color: 'bg-cafe-cinnamon' },
];

const defaultMenuItems = [
  // HOT BEVERAGES
  { id: '1', name: 'Cappuccino', price: 100, category: 'hotbeverages', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', isAvailable: true },
  { id: '2', name: 'Vennila Cappuccino', price: 130, category: 'hotbeverages', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80', isAvailable: true },
  { id: '3', name: 'Hazelnut Cappuccino', price: 130, category: 'hotbeverages', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', isAvailable: true },
  { id: '4', name: 'Latte', price: 120, category: 'hotbeverages', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80', isAvailable: true },
  { id: '5', name: 'Vennila Latte', price: 140, category: 'hotbeverages', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', isAvailable: true },
  { id: '6', name: 'Hazelnut Latte', price: 140, category: 'hotbeverages', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', isAvailable: true },
  { id: '7', name: 'Hot Mocha', price: 80, category: 'hotbeverages', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', isAvailable: true },
  { id: '8', name: 'Hot Chocolate', price: 100, category: 'hotbeverages', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', isAvailable: true },
  { id: '9', name: 'Americano', price: 80, category: 'hotbeverages', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', isAvailable: true },
  { id: '10', name: 'Espresso', price: 30, category: 'hotbeverages', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', isAvailable: true },
  { id: '11', name: 'Espresso Romano', price: 40, category: 'hotbeverages', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', isAvailable: true },
  { id: '80', name: 'Wippy Hot Mocha', price: 100, category: 'hotbeverages', image: '/placeholder.svg', isAvailable: true },
  // COLD BEVERAGES
  { id: '12', name: 'Cold Coffee', price: 120, category: 'coldbeverages', image: '/placeholder.svg', isAvailable: true },
  { id: '13', name: 'Hazelnut Frappe', price: 140, category: 'coldbeverages', image: '/placeholder.svg', isAvailable: true },
  { id: '14', name: 'Iced Latte', price: 120, category: 'coldbeverages', image: '/placeholder.svg', isAvailable: true },
  { id: '15', name: 'Iced Mocha', price: 120, category: 'coldbeverages', image: '/placeholder.svg', isAvailable: true },
  { id: '71', name: 'H3 Devils', price: 200, category: 'coldbeverages', image: '/placeholder.svg', isAvailable: true },
  { id: '72', name: 'Strawberry Frappe', price: 200, category: 'coldbeverages', image: '/placeholder.svg', isAvailable: true },
  { id: '73', name: 'Mango Frappe', price: 200, category: 'coldbeverages', image: '/placeholder.svg', isAvailable: true },
  { id: '74', name: 'Choco Frappy', price: 180, category: 'coldbeverages', image: '/placeholder.svg', isAvailable: true },
  { id: '75', name: 'Peanut Choco Frappe', price: 200, category: 'coldbeverages', image: '/placeholder.svg', isAvailable: true },
  // SPARKLINGS
  { id: '16', name: 'Iced Americano', price: 80, category: 'sparklings', image: '/placeholder.svg', isAvailable: true },
  { id: '17', name: 'Lemon Iced Tea', price: 80, category: 'sparklings', image: '/placeholder.svg', isAvailable: true },
  { id: '18', name: 'Strawberry Iced Tea', price: 120, category: 'sparklings', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', isAvailable: true },
  { id: '19', name: 'Mojito', price: 100, category: 'sparklings', image: '/placeholder.svg', isAvailable: true },
  { id: '20', name: 'Green Apple Mojito', price: 120, category: 'sparklings', image: '/placeholder.svg', isAvailable: true },
  { id: '21', name: 'Orange Mojito', price: 90, category: 'sparklings', image: '/placeholder.svg', isAvailable: true },
  { id: '22', name: 'Strawberry Mojito', price: 120, category: 'sparklings', image: '/placeholder.svg', isAvailable: true },
  { id: '23', name: 'Strawberry Basil Mojito', price: 130, category: 'sparklings', image: '/placeholder.svg', isAvailable: true },
  { id: '24', name: 'Blue Lady', price: 100, category: 'sparklings', image: '/placeholder.svg', isAvailable: true },
  // VEG SNACKS
  { id: '25', name: 'Cheese Garlic Bomb(Korean)', price: 60, category: 'vegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '26', name: 'Cheese Balls', price: 80, category: 'vegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '27', name: 'Avo Toast', price: 120, category: 'vegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '28', name: 'Chilli Garlic Bread', price: 120, category: 'vegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '29', name: 'Cheese Garlic Bread', price: 130, category: 'vegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '30', name: 'Veg Wrap', price: 140, category: 'vegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '31', name: 'Veg Burger', price: 140, category: 'vegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '32', name: 'Spicy Veg Burger', price: 150, category: 'vegsnacks', image: '/placeholder.svg', isAvailable: true },
  // NON-VEG SNACKS
  { id: '33', name: 'Golden Chicky Wrap', price: 150, category: 'nonvegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '34', name: 'Chicky Wrap', price: 140, category: 'nonvegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '35', name: 'Eggbell Wrap', price: 130, category: 'nonvegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '36', name: 'Spring Fry(Hot Dog)', price: 140, category: 'nonvegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '37', name: 'Chicky Cheese Garlic Bomb(Korean)', price: 100, category: 'nonvegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '38', name: 'Chicky Nuggets', price: 120, category: 'nonvegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '39', name: 'Chicky Burger', price: 120, category: 'nonvegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '40', name: 'Spicy Chicky Burger', price: 150, category: 'nonvegsnacks', image: '/placeholder.svg', isAvailable: true },
  { id: '41', name: 'Chicky Pops', price: 100, category: 'nonvegsnacks', image: '/placeholder.svg', isAvailable: true },
  // VEG FRIES
  { id: '42', name: 'French Fries', price: 70, category: 'vegfries', image: '/placeholder.svg', isAvailable: true },
  { id: '43', name: 'Cheesy Fries', price: 100, category: 'vegfries', image: '/placeholder.svg', isAvailable: true },
  { id: '44', name: 'Peri Peri Fries', price: 120, category: 'vegfries', image: '/placeholder.svg', isAvailable: true },
  { id: '45', name: 'Veg Loaded Fries', price: 150, category: 'vegfries', image: '/placeholder.svg', isAvailable: true },
  // NON-VEG FRIES
  { id: '46', name: 'Chicky Loaded Fries', price: 160, category: 'nonvegfries', image: '/placeholder.svg', isAvailable: true },
  { id: '47', name: 'Peri Peri Chicky Loaded Fries', price: 170, category: 'nonvegfries', image: '/placeholder.svg', isAvailable: true },
  { id: '48', name: 'Chicky Garlic Loaded Fries', price: 180, category: 'nonvegfries', image: '/placeholder.svg', isAvailable: true },
  { id: '49', name: 'Sausage Loaded Fries', price: 200, category: 'nonvegfries', image: '/placeholder.svg', isAvailable: true },
  // DESSERTS
  { id: '50', name: 'Vennila Scope', price: 30, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '51', name: 'Vennila Honey', price: 50, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '52', name: 'Affogato', price: 60, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '53', name: 'Coffee Crisp Bowl', price: 150, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '54', name: 'Honey Crisp Bowl', price: 170, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '55', name: 'Strawberry Crisp Bowl', price: 200, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '56', name: 'Orange Hon-Crisp Bowl', price: 180, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '57', name: 'Nutty Hon-Crisp Bowl', price: 200, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '58', name: 'Figgy Hon-Crisp Bowl', price: 200, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '59', name: 'Banana Hon-Crisp Bowl', price: 150, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '60', name: 'Brownie', price: 50, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '76', name: 'Mango Topped Ice Cream', price: 50, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '77', name: 'Strawberry Topped Ice Cream', price: 50, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '78', name: 'Brownie with Ice Cream', price: 60, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  { id: '79', name: 'Choco Topped Ice Cream', price: 50, category: 'desserts', image: '/placeholder.svg', isAvailable: true },
  // ADD-ONS
  { id: '61', name: 'Chocolate Sauce', price: 30, category: 'addons', image: '/placeholder.svg', isAvailable: true },
  { id: '62', name: 'Mango Sauce', price: 30, category: 'addons', image: '/placeholder.svg', isAvailable: true },
  { id: '63', name: 'Strawberry Sauce', price: 30, category: 'addons', image: '/placeholder.svg', isAvailable: true },
  { id: '64', name: 'Brownie', price: 30, category: 'addons', image: '/placeholder.svg', isAvailable: true },
  { id: '65', name: 'Biscoff', price: 30, category: 'addons', image: '/placeholder.svg', isAvailable: true },
  { id: '66', name: 'Orea', price: 30, category: 'addons', image: '/placeholder.svg', isAvailable: true },
  { id: '67', name: 'Fresh Cream', price: 30, category: 'addons', image: '/placeholder.svg', isAvailable: true },
  { id: '68', name: 'Vennila Scope', price: 30, category: 'addons', image: '/placeholder.svg', isAvailable: true },
  { id: '69', name: 'Cheese', price: 30, category: 'addons', image: '/placeholder.svg', isAvailable: true },
  { id: '70', name: 'Mayo', price: 30, category: 'addons', image: '/placeholder.svg', isAvailable: true },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  all: ChefHat,
  coffee: Coffee,
  pastries: Cookie,
  sandwiches: Sandwich,
  salads: Salad,
  beverages: Wine,
};

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userRole, setUserRole] = useState<'admin' | 'cashier'>(() => {
    const savedRole = localStorage.getItem('userRole');
    return (savedRole === 'admin' || savedRole === 'cashier') ? savedRole : 'cashier';
  });
  const [currentView, setCurrentView] = useState<'pos' | 'dashboard'>('pos');
  const [userName] = useState('Mohammed Haris T A');
  
  // Initialize user role in localStorage
  useEffect(() => {
    localStorage.setItem('userRole', userRole);
  }, [userRole]);

  // Debug: Log when userRole changes
  useEffect(() => {
    console.log('User role changed to:', userRole);
  }, [userRole]);

  // Ensure userRole is properly initialized and persisted
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole && (savedRole === 'admin' || savedRole === 'cashier') && savedRole !== userRole) {
      console.log('Restoring saved role:', savedRole);
      setUserRole(savedRole as 'admin' | 'cashier');
    }
  }, []);

  const [categories, setCategories] = useState(defaultCategories);
  const [menuItems, setMenuItems] = useState(defaultMenuItems);

  // Dynamically calculate itemCount for each category
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    itemCount: menuItems.filter(item =>
      item.category && item.category.trim().toLowerCase() === cat.id.trim().toLowerCase()
    ).length
  }));

  // Robust filtering logic
  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item =>
        item.category &&
        item.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
      );

  // Save menuItems to localStorage whenever they change
  useEffect(() => {
    // Only store image as a URL or empty string
    const safeMenuItems = menuItems.map(item => ({
      ...item,
      image: (typeof item.image === 'string' && item.image.startsWith('data:')) ? '' : (item.image || '')
    }));
    localStorage.setItem('menuItems', JSON.stringify(safeMenuItems));
  }, [menuItems]);
  const { getTotalItems, cart } = useCart();

  // Fetch menu items from backend on load
  // useEffect(() => {
  //   getMenuItems().then(setMenuItems);
  // }, []);

  // Update categories when menuItems change
  // useEffect(() => {
  //   const cats: Record<string, Category> = {
  //     all: { id: 'all', name: 'All Items', icon: ChefHat, itemCount: 0, color: 'bg-primary' },
  //     coffee: { id: 'coffee', name: 'Coffee & Tea', icon: Coffee, itemCount: 0, color: 'bg-cafe-espresso' },
  //     pastries: { id: 'pastries', name: 'Pastries', icon: Cookie, itemCount: 0, color: 'bg-cafe-cinnamon' },
  //     sandwiches: { id: 'sandwiches', name: 'Sandwiches', icon: Sandwich, itemCount: 0, color: 'bg-accent' },
  //     salads: { id: 'salads', name: 'Fresh Salads', icon: Salad, itemCount: 0, color: 'bg-success' },
  //     beverages: { id: 'beverages', name: 'Cold Drinks', icon: Wine, itemCount: 0, color: 'bg-cafe-gold' },
  //   };
  //   menuItems.forEach(item => {
  //     cats.all.itemCount++;
  //     if (cats[item.category]) cats[item.category].itemCount++;
  //   });
  //   setCategories(Object.values(cats));
  // }, [menuItems]);

  // Calculate today's sales from order history
  const [dailyCashEarned, setDailyCashEarned] = useState(0);
  useEffect(() => {
    const updateSales = () => {
      const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const today = new Date().toDateString();
      const total = orders.reduce((sum: number, order: any) => {
        const orderDate = new Date(order.timestamp).toDateString();
        if (orderDate === today) {
          return sum + (order.finalTotal || order.total || 0);
        }
        return sum;
      }, 0);
      setDailyCashEarned(total);
    };
    updateSales();
    const interval = setInterval(updateSales, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  const handleCashEarned = (amount: number) => {
    setDailyCashEarned(prev => prev + amount);
  };

  const resetTodaysSales = () => {
    setDailyCashEarned(0);
  };

  // Force re-render when cart changes to update cart count
  const cartItemCount = getTotalItems();

  return (
    <div className={`min-h-screen flex flex-col ${userRole === 'admin' ? 'admin-dark' : 'bg-background'}`}>
      <Navbar 
        userRole={userRole}
        onRoleChange={setUserRole}
        onViewChange={setCurrentView}
        currentView={currentView}
        userName={userName}
        dailyCashEarned={dailyCashEarned}
        cartItemCount={cartItemCount}
      />
      <div className="flex flex-1 overflow-hidden">
        {currentView === 'pos' && (
          <>
            <CategorySidebar 
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              userRole={userRole}
              categories={categoriesWithCounts}
              onCategoriesChange={setCategories}
              menuItems={menuItems}
            />
            <PosSystem 
              selectedCategory={selectedCategory} 
              userRole={userRole}
              onCashEarned={handleCashEarned}
              categories={categoriesWithCounts}
              menuItems={filteredMenuItems}
              setMenuItems={setMenuItems}
            />
          </>
        )}
        {currentView === 'dashboard' && userRole === 'admin' && (
          <div className="flex-1">
            <AnalyticsDashboard onResetTodaysSales={resetTodaysSales} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
