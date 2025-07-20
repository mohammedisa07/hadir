import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { CategorySidebar } from '@/components/CategorySidebar';
import { PosSystem } from '@/components/PosSystem';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useCart } from '@/hooks/useCart';
import { Coffee, Cookie, Sandwich, Salad, Wine, ChefHat } from "lucide-react";

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

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userRole, setUserRole] = useState<'admin' | 'cashier'>('admin');
  const [currentView, setCurrentView] = useState<'pos' | 'dashboard'>('pos');
  const [userName] = useState('Mohammed Haris T A');
  const [dailyCashEarned, setDailyCashEarned] = useState(0);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const { getTotalItems } = useCart();

  // Reset daily cash at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const lastReset = localStorage.getItem('lastCashReset');
      const today = now.toDateString();
      
      if (lastReset !== today) {
        setDailyCashEarned(0);
        localStorage.setItem('lastCashReset', today);
        localStorage.setItem('dailyCashEarned', '0');
      } else {
        const savedCash = localStorage.getItem('dailyCashEarned');
        if (savedCash) {
          setDailyCashEarned(parseFloat(savedCash));
        }
      }
    };

    checkMidnight();
    
    // Check every minute for midnight reset
    const interval = setInterval(checkMidnight, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCashEarned = (amount: number) => {
    const newTotal = dailyCashEarned + amount;
    setDailyCashEarned(newTotal);
    localStorage.setItem('dailyCashEarned', newTotal.toString());
  };

  const resetTodaysSales = () => {
    setDailyCashEarned(0);
    localStorage.setItem('dailyCashEarned', '0');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar 
        userRole={userRole}
        onRoleChange={setUserRole}
        onViewChange={setCurrentView}
        currentView={currentView}
        userName={userName}
        dailyCashEarned={dailyCashEarned}
        cartItemCount={getTotalItems()}
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
            />
            <PosSystem 
              selectedCategory={selectedCategory} 
              userRole={userRole}
              onCashEarned={handleCashEarned}
              categories={categories}
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
