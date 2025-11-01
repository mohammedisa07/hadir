
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Minus,
  Star,
  Settings,
  Image as ImageIcon,
  GripVertical,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MenuItemForm } from "./MenuItemForm";
import { useCart } from "@/hooks/useCart";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from "react";
// REMOVE: import { addMenuItem, updateMenuItem, deleteMenuItem, getMenuItems } from '../lib/api';

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

interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
  _id?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  itemCount: number;
  color: string;
}

interface PosSystemProps {
  selectedCategory: string;
  userRole: 'admin' | 'cashier';
  onCashEarned: (amount: number) => void;
  categories?: Category[];
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const initialMenuItems: MenuItem[] = [
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

// Sortable Item Component
const SortableMenuItem = ({ item, onEdit, onToggleAvailability, userRole, onAddToCart, onUpdateQuantity, categories, cartQuantity = 0 }: {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onToggleAvailability: (id: string) => void;
  userRole: 'admin' | 'cashier';
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, change: number) => void;
  categories?: Category[];
  cartQuantity?: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: item.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-md transition-all duration-200 group relative overflow-hidden h-full ${
        !item.isAvailable ? 'opacity-50 grayscale' : ''
      } ${userRole === 'admin' ? 'admin-card' : ''}`}
      onClick={() => item.isAvailable && onAddToCart(item)}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Drag Handle for Admin */}
        {userRole === 'admin' && (
          <div 
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/80 rounded p-1 cursor-grab"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        {/* Image */}
        <div className="relative h-32 bg-muted overflow-hidden flex-shrink-0">
          <img 
            src={item.image || '/placeholder.svg'} 
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={e => { e.currentTarget.src = '/placeholder.svg'; }}
          />
          {/* Out of Stock Overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-white text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-1" />
                <span className="text-sm font-semibold">Out of Stock</span>
              </div>
            </div>
          )}
          
          {/* Admin Controls */}
          {userRole === 'admin' && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
              <Button 
                size="sm" 
                variant={item.isAvailable ? "destructive" : "default"}
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAvailability(item.id || item._id || '');
                }}
              >
                <AlertTriangle className="h-3 w-3" />
              </Button>
              <MenuItemForm 
                item={item} 
                onSave={onEdit}
                categories={categories}
                trigger={
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                }
              />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  {item.isPopular && (
                    <Badge variant="secondary" className="text-xs bg-cafe-gold text-white flex-shrink-0">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                )}
                {!item.isAvailable && (
                  <Badge variant="destructive" className="text-xs">
                    Unavailable
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-lg font-bold text-primary">₹{item.price}</span>
            {item.isAvailable && (
              <div className="flex items-center space-x-2">
                {cartQuantity > 0 && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-6 w-6 p-0 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateQuantity(item.id || item._id || '', -1);
                      }}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Badge variant="secondary" className="h-6 px-2 text-xs font-semibold min-w-[24px] flex items-center justify-center">
                      {cartQuantity}
                    </Badge>
                  </>
                )}
                <Button 
                  size="sm" 
                  className="h-6 w-6 p-0 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(item);
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PosSystem = ({ selectedCategory, userRole, onCashEarned, categories = [], menuItems, setMenuItems }: PosSystemProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  
  const { addToCart, cart, updateQuantity } = useCart();
  const { toast } = useToast();

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter menu items based on category and search
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || (item.category && item.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase());
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const availabilityFilter = showOutOfStock ? true : item.isAvailable;
    return matchesCategory && matchesSearch && availabilityFilter;
  }).slice().sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

  // Get only out of stock items
  const outOfStockItems = menuItems.filter(item => 
    !item.isAvailable && 
    (selectedCategory === 'all' || (item.category && item.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase())) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice().sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

  // New functions for enhanced features
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id || item._id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id || item._id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      );
      // Only store image as a URL or empty string
      const safeMenuItems = updated.map(item => ({
        ...item,
        image: (typeof item.image === 'string' && item.image.startsWith('data:')) ? '' : (item.image || '')
      }));
      localStorage.setItem('menuItems', JSON.stringify(safeMenuItems));
      return updated;
    });
    toast({
      title: "Item availability updated",
      description: "Menu item status has been changed",
    });
  };

  const handleMenuItemSave = (itemData: Omit<MenuItem, 'id'> & { id?: string }) => {
    if (itemData.id) {
      // Update existing item
      setMenuItems(prev => {
        const updated = prev.map(item =>
          item.id === itemData.id ? { ...itemData, id: itemData.id } as MenuItem : item
        );
        // Only store image as a URL or empty string
        const safeMenuItems = updated.map(item => ({
          ...item,
          image: (typeof item.image === 'string' && item.image.startsWith('data:')) ? '' : (item.image || '')
        }));
        localStorage.setItem('menuItems', JSON.stringify(safeMenuItems));
        return updated;
      });
    } else {
      // Add new item
      const newItem: MenuItem = {
        ...itemData,
        id: `item-${Date.now()}`,
      };
      setMenuItems(prev => {
        const updated = [...prev, newItem];
        // Only store image as a URL or empty string
        const safeMenuItems = updated.map(item => ({
          ...item,
          image: (typeof item.image === 'string' && item.image.startsWith('data:')) ? '' : (item.image || '')
        }));
        localStorage.setItem('menuItems', JSON.stringify(safeMenuItems));
        return updated;
      });
    }
  };

  // Optionally, add a delete handler if you support deleting menu items
  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      // Only store image as a URL or empty string
      const safeMenuItems = updated.map(item => ({
        ...item,
        image: (typeof item.image === 'string' && item.image.startsWith('data:')) ? '' : (item.image || '')
      }));
      localStorage.setItem('menuItems', JSON.stringify(safeMenuItems));
      return updated;
    });
  };

  return (
    <div className={`flex-1 flex flex-col overflow-hidden ${userRole === 'admin' ? 'admin-dark' : ''}`}>
      <div className="p-6 flex-shrink-0">
        {/* Search Bar & Admin Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {userRole === 'admin' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOutOfStock(!showOutOfStock)}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  {showOutOfStock ? 'Hide' : 'Show'} Out of Stock
                </Button>
                <MenuItemForm onSave={handleMenuItemSave} categories={categories} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Grid with Drag & Drop */}
      <ScrollArea className="flex-1 px-6 pb-6">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={filteredItems.map(item => item.id || item._id || '')}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {filteredItems.map((item) => {
                // Find the cart item for this menu item
                const cartItem = cart.find(cartItem => (cartItem.id && cartItem.id === item.id) || (cartItem._id && cartItem._id === item._id));
                const cartQuantity = cartItem ? cartItem.quantity : 0;
                
                return (
                  <SortableMenuItem
                    key={item.id || item._id || ''}
                    item={item}
                    onEdit={handleMenuItemSave}
                    onToggleAvailability={toggleItemAvailability}
                    userRole={userRole}
                    onAddToCart={addToCart}
                    onUpdateQuantity={updateQuantity}
                    categories={categories}
                    cartQuantity={cartQuantity}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

        {/* Out of Stock Section */}
        {outOfStockItems.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-semibold text-destructive">Out of Stock Items</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {outOfStockItems.map((item) => {
                const cartItem = cart.find(cartItem => cartItem.id === item.id || cartItem._id === item._id);
                const cartQuantity = cartItem ? cartItem.quantity : 0;
                
                return (
                  <SortableMenuItem
                    key={item.id || item._id || ''}
                    item={item}
                    onEdit={handleMenuItemSave}
                    onToggleAvailability={toggleItemAvailability}
                    userRole={userRole}
                    onAddToCart={addToCart}
                    onUpdateQuantity={updateQuantity}
                    categories={categories}
                    cartQuantity={cartQuantity}
                  />
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
