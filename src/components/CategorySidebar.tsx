import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Coffee, Cookie, Sandwich, Salad, Wine, ChefHat, Edit3, Trash2, Save, X, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  itemCount: number;
  color: string;
}

interface CategorySidebarProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  userRole: 'admin' | 'cashier';
  categories?: Category[];
  onCategoriesChange?: (categories: Category[]) => void;
  menuItems?: any[];
}

const defaultCategories: Category[] = [
  { id: 'all', name: 'All Items', icon: ChefHat, itemCount: 24, color: 'bg-primary' },
  { id: 'coffee', name: 'Coffee & Tea', icon: Coffee, itemCount: 12, color: 'bg-cafe-espresso' },
  { id: 'pastries', name: 'Pastries', icon: Cookie, itemCount: 8, color: 'bg-cafe-cinnamon' },
  { id: 'sandwiches', name: 'Sandwiches', icon: Sandwich, itemCount: 6, color: 'bg-accent' },
  { id: 'salads', name: 'Fresh Salads', icon: Salad, itemCount: 4, color: 'bg-success' },
  { id: 'beverages', name: 'Cold Drinks', icon: Wine, itemCount: 10, color: 'bg-cafe-gold' },
];

// Sortable Category Item (for admin)
function SortableCategoryItem({ category, isSelected, onCategorySelect, listeners, attributes, setNodeRef, style }) {
  const IconComponent = category.icon;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      key={category.id}
      className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted/50'
      }`}
      onClick={() => onCategorySelect(category.id)}
    >
      <div className="flex items-center space-x-3 flex-1">
        {category.id !== 'all' && (
          <GripVertical className="h-4 w-4 mr-2 cursor-grab text-muted-foreground opacity-60 group-hover:opacity-100" />
        )}
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-foreground/20' : category.color} transition-colors`}>
          <IconComponent className={`h-4 w-4 ${isSelected ? 'text-primary-foreground' : 'text-white'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>{category.name}</p>
          <p className={`text-sm ${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{category.itemCount} items</p>
        </div>
      </div>
      <Badge variant={isSelected ? "secondary" : "outline"} className="h-6 text-xs">{category.itemCount}</Badge>
    </div>
  );
}

export const CategorySidebar = ({ selectedCategory, onCategorySelect, userRole, categories = [], onCategoriesChange }) => {
  const allItemsCategory = {
    id: 'all',
    name: 'All Items',
    icon: ChefHat,
    itemCount: categories.reduce((sum, cat) => sum + (cat.itemCount || 0), 0),
    color: 'bg-primary',
  };
  const sidebarCategories = [allItemsCategory, ...categories];

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      if (active.id === 'all' || over.id === 'all') return;
      const oldIndex = categories.findIndex(cat => cat.id === active.id);
      const newIndex = categories.findIndex(cat => cat.id === over.id);
      const newCategories = arrayMove(categories, oldIndex, newIndex);
      if (onCategoriesChange) {
        onCategoriesChange(newCategories);
      }
    }
  };

  return (
    <div className="w-80 min-w-[16rem] max-w-xs bg-card border-r border-border h-full flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {userRole === 'admin' ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sidebarCategories.map(cat => cat.id)} strategy={verticalListSortingStrategy}>
                {sidebarCategories.map(category => {
                  if (category.id === 'all') {
                    const IconComponent = category.icon;
                    const isSelected = selectedCategory === category.id;
                    return (
                      <div
                        key={category.id}
                        className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          isSelected ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => onCategorySelect(category.id)}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-foreground/20' : category.color} transition-colors`}>
                            <IconComponent className={`h-4 w-4 ${isSelected ? 'text-primary-foreground' : 'text-white'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>{category.name}</p>
                            <p className={`text-sm ${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{category.itemCount} items</p>
                          </div>
                        </div>
                        <Badge variant={isSelected ? "secondary" : "outline"} className="h-6 text-xs">{category.itemCount}</Badge>
                      </div>
                    );
                  }
                  const sortable = useSortable({ id: category.id });
                  const isSelected = selectedCategory === category.id;
                  return (
                    <SortableCategoryItem
                      key={category.id}
                      category={category}
                      isSelected={isSelected}
                      onCategorySelect={onCategorySelect}
                      {...sortable}
                      style={{
                        transform: CSS.Transform.toString(sortable.transform),
                        transition: sortable.transition,
                      }}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          ) : (
            sidebarCategories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <div
                  key={category.id}
                  className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onCategorySelect(category.id)}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-foreground/20' : category.color} transition-colors`}>
                      <IconComponent className={`h-4 w-4 ${isSelected ? 'text-primary-foreground' : 'text-white'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>{category.name}</p>
                      <p className={`text-sm ${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{category.itemCount} items</p>
                    </div>
                  </div>
                  <Badge variant={isSelected ? "secondary" : "outline"} className="h-6 text-xs">{category.itemCount}</Badge>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
      {/* Footer with total items and categories */}
      <div className="p-4 border-t border-border bg-muted/30 text-center">
        <p className="text-sm text-muted-foreground">
          All items: <span className="font-medium text-foreground">{sidebarCategories[0].itemCount}</span>
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Categories: <span className="font-medium text-foreground">{sidebarCategories.length - 1}</span>
        </p>
      </div>
    </div>
  );
};