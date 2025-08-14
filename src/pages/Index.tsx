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
  { id: '1', name: 'Cappuccino', price: 80, category: 'hotbeverages', image: 'https://i.pinimg.com/736x/f8/56/1e/f8561ea80e14bd1989b4fe87736e1468.jpg', isAvailable: true },
  { id: '2', name: 'Latte', price: 100, category: 'hotbeverages', image: 'https://i.pinimg.com/736x/f0/65/5f/f0655f2737da76be9b4ac435c65e3d9b.jpg', isAvailable: true },
  { id: '3', name: 'Hot Mocha', price: 70, category: 'hotbeverages', image: 'https://i.pinimg.com/736x/22/8b/72/228b72a03cb98c19063193cf0188a6a3.jpg', isAvailable: true },
  { id: '4', name: 'Wippy Hot Mocha', price: 90, category: 'hotbeverages', image: 'https://i.pinimg.com/1200x/80/af/5f/80af5f93e6c721249c7f4ef83f1583d1.jpg', isAvailable: true },
  { id: '5', name: 'Americano', price: 60, category: 'hotbeverages', image: 'https://i.pinimg.com/736x/de/72/1c/de721cf98ef9c6a06906e094fe337f4e.jpg', isAvailable: true },
  { id: '6', name: 'Hot Chocolate', price: 100, category: 'hotbeverages', image: 'https://i.pinimg.com/736x/92/4d/da/924ddab4f7ad7192b593baab3603c1d5.jpg', isAvailable: true },
  
  // COLD BEVERAGES
  { id: '7', name: 'Cold Coffee', price: 120, category: 'coldbeverages', image: 'https://i.pinimg.com/1200x/db/ae/64/dbae64ad1529f3f9b74b91b19f21620a.jpg', isAvailable: true },
  { id: '8', name: 'Iced Latte', price: 120, category: 'coldbeverages', image: 'https://i.pinimg.com/736x/1e/67/b7/1e67b7c6fcbd33018697e88fafdd8f7c.jpg', isAvailable: true },
  { id: '9', name: 'Iced Mocha', price: 120, category: 'coldbeverages', image: 'https://i.pinimg.com/1200x/c8/ad/10/c8ad107ac4da5b217944daaa25f78bea.jpg', isAvailable: true },
  { id: '10', name: 'H3 Devils', price: 200, category: 'coldbeverages', image: 'https://i.pinimg.com/736x/82/33/a0/8233a09ba26e0e430a47612b84d66bbd.jpg', isAvailable: true },
  { id: '11', name: 'Strawberry Frappe', price: 200, category: 'coldbeverages', image: 'https://i.pinimg.com/736x/1b/7e/be/1b7ebeb50c01ced69964ffef2ca9f7ee.jpg', isAvailable: true },
  { id: '12', name: 'Mango Frappe', price: 200, category: 'coldbeverages', image: 'https://i.pinimg.com/736x/44/0e/83/440e838cc4c2991fbefbf38a5f8fe3ee.jpg', isAvailable: true },
  { id: '13', name: 'Choco Frappe', price: 180, category: 'coldbeverages', image: 'https://i.pinimg.com/736x/8c/3c/fd/8c3cfd6d32b634ab37c6b6e874b69928.jpg', isAvailable: true },
  { id: '14', name: 'Peanut Choco Frappe', price: 200, category: 'coldbeverages', image: 'https://i.pinimg.com/1200x/dd/a1/67/dda1677e7f1a2473e3c9c26ded5d203b.jpg', isAvailable: true },
  
  // SPARKLINGS
  { id: '15', name: 'Iced Americano', price: 80, category: 'sparklings', image: 'https://i.pinimg.com/1200x/e8/06/81/e8068186818ad7f0223acf7732643d98.jpg', isAvailable: true },
  { id: '16', name: 'Mojito', price: 80, category: 'sparklings', image: 'https://i.pinimg.com/1200x/57/cd/dd/57cddd925ee9c23164c2cfb69faf0e92.jpg', isAvailable: true },
  { id: '17', name: 'Green Apple Mojito', price: 100, category: 'sparklings', image: 'https://i.pinimg.com/736x/a5/05/57/a50557d789ec53eb8dcbb7eb74b92882.jpg', isAvailable: true },
  { id: '18', name: 'Orange Mojito', price: 90, category: 'sparklings', image: 'https://i.pinimg.com/1200x/3f/b2/11/3fb211f15ee6b0cb9342e91bebf3e5ea.jpg', isAvailable: true },
  { id: '19', name: 'Strawberry Mojito', price: 140, category: 'sparklings', image: 'https://i.pinimg.com/1200x/5c/da/e5/5cdae51c7ea99515926e457c128ee225.jpg', isAvailable: true },
  { id: '20', name: 'Strawberry Basil Mojito', price: 150, category: 'sparklings', image: 'https://i.pinimg.com/736x/dc/2a/85/dc2a85137fee62793d865c037aeb06d1.jpg', isAvailable: true },
  { id: '21', name: 'Blue Lady', price: 120, category: 'sparklings', image: 'https://i.pinimg.com/1200x/4d/c1/17/4dc117d0e99a89100aec3f47d6737f18.jpg', isAvailable: true },
  
  // VEG SNACKS
  { id: '22', name: 'Cheese Balls', price: 70, category: 'vegsnacks', image: 'https://i.pinimg.com/736x/2b/f1/24/2bf124a8ae1c13c73d9ddb3e05176c18.jpg', isAvailable: true },
  { id: '23', name: 'Veg Wrap', price: 120, category: 'vegsnacks', image: 'https://i.pinimg.com/1200x/b5/9e/76/b59e76ba0980d92413a0ed8add3b5f90.jpg', isAvailable: true },
  { id: '24', name: 'Veg Burger', price: 130, category: 'vegsnacks', image: 'https://i.pinimg.com/736x/dc/41/0c/dc410c7fc60c5847d07243482a4fb1ad.jpg', isAvailable: true },
  { id: '25', name: 'Spicy Veg Burger', price: 140, category: 'vegsnacks', image: 'https://i.pinimg.com/736x/2e/cd/ff/2ecdffe0cff2de575ec82f0f188debac.jpg', isAvailable: true },
  { id: '26', name: 'Paneer Burger', price: 150, category: 'vegsnacks', image: 'https://i.pinimg.com/736x/dc/41/0c/dc410c7fc60c5847d07243482a4fb1ad.jpg', isAvailable: true },
  { id: '27', name: 'Spicy Paneer Burger', price: 160, category: 'vegsnacks', image: 'https://i.pinimg.com/736x/2e/cd/ff/2ecdffe0cff2de575ec82f0f188debac.jpg', isAvailable: true },
  { id: '28', name: 'Veg Nuggets', price: 80, category: 'vegsnacks', image: 'https://i.pinimg.com/736x/d4/29/e8/d429e802340dd3ea7465182adfba959f.jpg', isAvailable: true },
  { id: '29', name: 'Smiles', price: 80, category: 'vegsnacks', image: 'https://i.pinimg.com/736x/7c/af/e9/7cafe93e17792d26f12919260b380f2a.jpg', isAvailable: true },
  { id: '30', name: 'Veg Finger', price: 90, category: 'vegsnacks', image: 'https://i.pinimg.com/1200x/7c/16/ca/7c16caad0186eca4c385123aaf56bf64.jpg', isAvailable: true },
  { id: '31', name: 'Veg Sandwich', price: 100, category: 'vegsnacks', image: 'https://i.pinimg.com/1200x/b5/9e/76/b59e76ba0980d92413a0ed8add3b5f90.jpg', isAvailable: true },
  { id: '32', name: 'Fried Cheese Corn Momos', price: 100, category: 'vegsnacks', image: 'https://i.pinimg.com/736x/7f/4b/12/7f4b1201b6c8da63a419ab23435a156e.jpg', isAvailable: true },
  { id: '33', name: 'Fried Paneer Momos', price: 110, category: 'vegsnacks', image: 'https://i.pinimg.com/736x/7f/4b/12/7f4b1201b6c8da63a419ab23435a156e.jpg', isAvailable: true },
  
  // NON-VEG SNACKS
  { id: '34', name: 'Chicky Wrap', price: 140, category: 'nonvegsnacks', image: 'https://i.pinimg.com/1200x/b3/36/d1/b336d18b22b9263a02d7f0fe17f42d4c.jpg', isAvailable: true },
  { id: '35', name: 'Eggbell Wrap', price: 130, category: 'nonvegsnacks', image: 'https://i.pinimg.com/736x/3a/79/1d/3a791dbf354995dbbd437a4623690642.jpg', isAvailable: true },
  { id: '36', name: 'Spring Fry', price: 120, category: 'nonvegsnacks', image: 'https://i.pinimg.com/736x/2e/61/58/2e615816d7a6a2d7a2d28bb4b1f79f4e.jpg', isAvailable: true },
  { id: '37', name: 'Chicky Cheese Ball', price: 120, category: 'nonvegsnacks', image: 'https://i.pinimg.com/736x/c8/cd/a9/c8cda9673f5e3a4ade8369db5bc22894.jpg', isAvailable: true },
  { id: '38', name: 'Chicky Nuggets', price: 100, category: 'nonvegsnacks', image: 'https://i.pinimg.com/736x/d4/29/e8/d429e802340dd3ea7465182adfba959f.jpg', isAvailable: true },
  { id: '39', name: 'Chicky Burger', price: 150, category: 'nonvegsnacks', image: 'https://i.pinimg.com/736x/7f/ca/38/7fca38e9d231422f59433ffa7411f3cd.jpg', isAvailable: true },
  { id: '40', name: 'Spicy Chicky Burger', price: 160, category: 'nonvegsnacks', image: 'https://i.pinimg.com/1200x/8b/5e/0b/8b5e0b79be294df37ed82917b60861c9.jpg', isAvailable: true },
  { id: '41', name: 'Chicky Pops', price: 80, category: 'nonvegsnacks', image: 'https://i.pinimg.com/1200x/7c/16/ca/7c16caad0186eca4c385123aaf56bf64.jpg', isAvailable: true },
  { id: '42', name: 'Chicky Fingers', price: 100, category: 'nonvegsnacks', image: 'https://i.pinimg.com/1200x/7c/16/ca/7c16caad0186eca4c385123aaf56bf64.jpg', isAvailable: true },
  { id: '43', name: 'Chicky Sandwich', price: 120, category: 'nonvegsnacks', image: 'https://i.pinimg.com/1200x/b3/36/d1/b336d18b22b9263a02d7f0fe17f42d4c.jpg', isAvailable: true },
  
  // VEG FRIES
  { id: '44', name: 'French Fries', price: 70, category: 'vegfries', image: 'https://i.pinimg.com/736x/7c/af/e9/7cafe93e17792d26f12919260b380f2a.jpg', isAvailable: true },
  { id: '45', name: 'Cheesy Fries', price: 100, category: 'vegfries', image: 'https://i.pinimg.com/736x/fe/00/47/fe00473ee205b8562ffbf6ec8f06682f.jpg', isAvailable: true },
  { id: '46', name: 'Peri Peri Fries', price: 120, category: 'vegfries', image: 'https://i.pinimg.com/736x/fe/00/47/fe00473ee205b8562ffbf6ec8f06682f.jpg', isAvailable: true },
  { id: '47', name: 'Veg Loaded Fries', price: 150, category: 'vegfries', image: 'https://i.pinimg.com/736x/23/7d/5e/237d5ed01014de9bc47b366119ce3a77.jpg', isAvailable: true },
  
  // NON-VEG FRIES
  { id: '48', name: 'Chicky Loaded Fries', price: 160, category: 'nonvegfries', image: 'https://i.pinimg.com/736x/86/9c/52/869c528679862d37f1cce6027939a39f.jpg', isAvailable: true },
  { id: '49', name: 'Peri Peri Chicky Loaded Fries', price: 170, category: 'nonvegfries', image: 'https://i.pinimg.com/1200x/b1/9f/5b/b19f5ba8ffd27b07a7ab1044b1e174ae.jpg', isAvailable: true },
  { id: '50', name: 'Chicky Garlic Loaded Fries', price: 180, category: 'nonvegfries', image: 'https://i.pinimg.com/1200x/b5/19/bb/b519bb5ff1996d4ef64b5f126a26e46e.jpg', isAvailable: true },
  { id: '51', name: 'Sausage Loaded Fries', price: 200, category: 'nonvegfries', image: 'https://i.pinimg.com/1200x/a1/18/6e/a1186e7835954ec02cf3f4edcb5abed3.jpg', isAvailable: true },
  
  // DESSERTS - YUMMY CUPS
  { id: '52', name: 'Vennila Scope', price: 30, category: 'desserts', image: 'https://i.pinimg.com/1200x/36/40/1c/36401c4cf41352071947d62c40afaa19.jpg', isAvailable: true },
  { id: '53', name: 'Vennila Honey', price: 40, category: 'desserts', image: 'https://i.pinimg.com/1200x/03/dc/85/03dc852b6e8c72737baa73a8cd12bc74.jpg', isAvailable: true },
  { id: '54', name: 'Brownie', price: 50, category: 'desserts', image: 'https://i.pinimg.com/1200x/3f/b0/eb/3fb0eb836ff71a4bb8c0a32824e58a85.jpg', isAvailable: true },
  { id: '55', name: 'Mango Topped Ice Cream', price: 50, category: 'desserts', image: 'https://i.pinimg.com/1200x/ae/38/58/ae3858a073993023932bcf972bace1fe.jpg', isAvailable: true },
  { id: '56', name: 'Strawberry Topped Ice Cream', price: 50, category: 'desserts', image: 'https://i.pinimg.com/1200x/c0/4a/30/c04a309a82b8026a6f2e8a356fac37ea.jpg', isAvailable: true },
  { id: '57', name: 'Brownie with Ice Cream', price: 80, category: 'desserts', image: 'https://i.pinimg.com/1200x/8f/8a/16/8f8a16aacb8e5b550dd34961dc3d932d.jpg', isAvailable: true },
  { id: '58', name: 'Choco Topped Ice Cream', price: 50, category: 'desserts', image: 'https://i.pinimg.com/1200x/99/cf/42/99cf42f264127766fc5626f81d321efe.jpg', isAvailable: true },
  { id: '59', name: 'Affogato', price: 60, category: 'desserts', image: 'https://i.pinimg.com/736x/3e/72/a4/3e72a46e744028f3f3087adebdcb6e15.jpg', isAvailable: true },
  
  // PREMIUM CUPS
  { id: '60', name: 'Coffee Crisp Bowl', price: 150, category: 'desserts', image: 'https://i.pinimg.com/1200x/a7/db/00/a7db005dbdb7be6cacb77d736e99c054.jpg', isAvailable: true },
  { id: '61', name: 'Banana Hon-Crisp Bowl', price: 150, category: 'desserts', image: 'https://i.pinimg.com/736x/83/82/2d/83822d410173f2ef2de7b82a7ebde00a.jpg', isAvailable: true },
  { id: '62', name: 'Falooda', price: 150, category: 'desserts', image: 'https://i.pinimg.com/1200x/a7/db/00/a7db005dbdb7be6cacb77d736e99c054.jpg', isAvailable: true },
  { id: '63', name: 'Honey Crisp Bowl', price: 170, category: 'desserts', image: 'https://i.pinimg.com/736x/95/3e/71/953e71d10118e233e6e90ab4f919e4d0.jpg', isAvailable: true },
  { id: '64', name: 'Orange Hon-Crisp Bowl', price: 180, category: 'desserts', image: 'https://i.pinimg.com/1200x/27/c9/ed/27c9edf110be7d2fc38ec5ffdf992545.jpg', isAvailable: true },
  { id: '65', name: 'Strawberry Crisp Bowl', price: 200, category: 'desserts', image: 'https://i.pinimg.com/736x/02/ca/31/02ca31e9169188bb65b452bdab3e77eb.jpg', isAvailable: true },
  { id: '66', name: 'Nutty Hon-Crisp Bowl', price: 200, category: 'desserts', image: 'https://i.pinimg.com/736x/b1/4d/27/b14d27738e9ba1d4375553722469994f.jpg', isAvailable: true },
  { id: '67', name: 'Figgy Hon-Crisp Bowl', price: 200, category: 'desserts', image: 'https://i.pinimg.com/1200x/40/d4/9d/40d49d59a7152f609118e2b720145b64.jpg', isAvailable: true },
  
  // ADD-ONS - 20rs/-
  { id: '68', name: 'Chocolate Sauce', price: 20, category: 'addons', image: 'https://i.pinimg.com/736x/86/ac/70/86ac7052f9acf98e1b77a60fea5b28b6.jpg', isAvailable: true },
  { id: '69', name: 'Mango Sauce', price: 20, category: 'addons', image: 'https://i.pinimg.com/1200x/e8/aa/cf/e8aacf2b9fdf2e4f54b3f915162fc638.jpg', isAvailable: true },
  { id: '70', name: 'Strawberry Sauce', price: 20, category: 'addons', image: 'https://i.pinimg.com/1200x/32/c2/a2/32c2a2cc40b48348f5cb6d6578e8efae.jpg', isAvailable: true },
  { id: '71', name: 'Brownie', price: 20, category: 'addons', image: 'https://i.pinimg.com/1200x/3f/b0/eb/3fb0eb836ff71a4bb8c0a32824e58a85.jpg', isAvailable: true },
  { id: '72', name: 'Biscoff', price: 20, category: 'addons', image: 'https://i.pinimg.com/1200x/4f/77/27/4f7727f267edb731b1e7be749a6b643e.jpg', isAvailable: true },
  { id: '73', name: 'Orea', price: 20, category: 'addons', image: 'https://i.pinimg.com/1200x/d8/76/fc/d876fc2380c6af9d6b4ffeb3c799848a.jpg', isAvailable: true },
  { id: '74', name: 'Fresh Cream', price: 20, category: 'addons', image: 'https://i.pinimg.com/1200x/10/1b/12/101b12bb1461e61f9de2c1eb840db9fe.jpg', isAvailable: true },
  { id: '75', name: 'Vennila Scope', price: 20, category: 'addons', image: 'https://i.pinimg.com/1200x/36/40/1c/36401c4cf41352071947d62c40afaa19.jpg', isAvailable: true },
  { id: '76', name: 'Cheese', price: 20, category: 'addons', image: 'https://i.pinimg.com/1200x/a9/e5/15/a9e5153870538e36ffe90553ef5ffeb6.jpg', isAvailable: true },
  { id: '77', name: 'Mayo', price: 20, category: 'addons', image: 'https://i.pinimg.com/1200x/f1/88/39/f18839bd715a7e845831ae52cbac18dc.jpg', isAvailable: true },
  { id: '78', name: 'Small Water Bottle', price: 10, category: 'addons', image: 'https://i.pinimg.com/736x/f4/5e/d5/f45ed52b28cf16c2cf7840f31794c83b.jpg', isAvailable: true },
  { id: '79', name: 'Big Water Bottle', price: 20, category: 'addons', image: 'https://i.pinimg.com/736x/35/d3/fb/35d3fb719e4c55f8051d14be92eace47.jpg', isAvailable: true },
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
