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
  { id: 'all', name: 'All Items', icon: ChefHat, itemCount: 24, color: 'bg-primary' },
  { id: 'coffee', name: 'Coffee & Tea', icon: Coffee, itemCount: 12, color: 'bg-cafe-espresso' },
  { id: 'pastries', name: 'Pastries', icon: Cookie, itemCount: 8, color: 'bg-cafe-cinnamon' },
  { id: 'sandwiches', name: 'Sandwiches', icon: Sandwich, itemCount: 6, color: 'bg-accent' },
  { id: 'salads', name: 'Fresh Salads', icon: Salad, itemCount: 4, color: 'bg-success' },
  { id: 'beverages', name: 'Cold Drinks', icon: Wine, itemCount: 10, color: 'bg-cafe-gold' },
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

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('menuItems');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Espresso', price: 180, category: 'coffee', isPopular: true, isAvailable: true, description: 'Rich and bold', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop' },
      { id: '2', name: 'Cappuccino', price: 220, category: 'coffee', isPopular: true, isAvailable: true, description: 'Creamy with milk foam', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop' },
      { id: '3', name: 'Latte', price: 250, category: 'coffee', isAvailable: true, description: 'Smooth and milky', image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop' },
      { id: '4', name: 'Americano', price: 200, category: 'coffee', isAvailable: true, description: 'Classic black coffee', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop' },
      { id: '5', name: 'Croissant', price: 150, category: 'pastries', isAvailable: true, description: 'Buttery and flaky', image: 'https://images.unsplash.com/photo-1555507036-ab794f4ade0a?w=400&h=300&fit=crop' },
      { id: '6', name: 'Chocolate Muffin', price: 180, category: 'pastries', isPopular: true, isAvailable: true, description: 'Rich chocolate flavor', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop' },
      { id: '7', name: 'Club Sandwich', price: 350, category: 'sandwiches', isAvailable: true, description: 'Triple layer delight', image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop' },
      { id: '8', name: 'Caesar Salad', price: 280, category: 'salads', isAvailable: true, description: 'Fresh romaine with dressing', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
      { id: '9', name: 'Iced Tea', price: 120, category: 'beverages', isAvailable: true, description: 'Refreshing cold brew', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
      { id: '10', name: 'Fresh Orange Juice', price: 160, category: 'beverages', isAvailable: true, description: 'Freshly squeezed', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop' },
    ];
  });
  // Save menuItems to localStorage whenever they change
  useEffect(() => {
    // Only store image as a URL or empty string
    const safeMenuItems = menuItems.map(item => ({
      ...item,
      image: (typeof item.image === 'string' && item.image.startsWith('data:')) ? '' : (item.image || '')
    }));
    localStorage.setItem('menuItems', JSON.stringify(safeMenuItems));
  }, [menuItems]);
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(cat => cat && typeof cat.id === 'string')) {
          // Map icon property to correct React component
          return parsed.map(cat => ({
            ...cat,
            icon: iconMap[cat.id] || ChefHat,
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load categories from localStorage:', e);
    }
    // fallback to defaults
    const cats: Record<string, Category> = {
      all: { id: 'all', name: 'All Items', icon: ChefHat, itemCount: 0, color: 'bg-primary' },
      coffee: { id: 'coffee', name: 'Coffee & Tea', icon: Coffee, itemCount: 0, color: 'bg-cafe-espresso' },
      pastries: { id: 'pastries', name: 'Pastries', icon: Cookie, itemCount: 0, color: 'bg-cafe-cinnamon' },
      sandwiches: { id: 'sandwiches', name: 'Sandwiches', icon: Sandwich, itemCount: 0, color: 'bg-accent' },
      salads: { id: 'salads', name: 'Fresh Salads', icon: Salad, itemCount: 0, color: 'bg-success' },
      beverages: { id: 'beverages', name: 'Cold Drinks', icon: Wine, itemCount: 0, color: 'bg-cafe-gold' },
    };
    menuItems.forEach(item => {
      cats.all.itemCount++;
      if (cats[item.category]) cats[item.category].itemCount++;
    });
    return Object.values(cats);
  });
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
              categories={categories}
              onCategoriesChange={setCategories}
              menuItems={menuItems}
            />
            <PosSystem 
              selectedCategory={selectedCategory} 
              userRole={userRole}
              onCashEarned={handleCashEarned}
              categories={categories}
              menuItems={menuItems}
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
