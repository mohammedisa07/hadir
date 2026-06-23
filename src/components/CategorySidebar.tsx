import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Coffee, Cookie, Sandwich, Salad, Wine, ChefHat, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  iconName?: string;
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
function SortableCategoryItem({ category, isSelected, onCategorySelect }) {
  const sortable = useSortable({ id: category.id });
  const IconComponent = category.icon;
  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      {...sortable.attributes}
      {...sortable.listeners}
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

const iconOptions = [
  { value: 'salad', label: 'Veg', icon: Salad },
  { value: 'sandwich', label: 'Food', icon: Sandwich },
  { value: 'wine', label: 'Drink', icon: Wine },
  { value: 'coffee', label: 'Coffee', icon: Coffee },
  { value: 'cookie', label: 'Dessert', icon: Cookie },
  { value: 'chefhat', label: 'General', icon: ChefHat },
];

const colorOptions = [
  { value: 'bg-green-600 text-white', label: 'Green' },
  { value: 'bg-red-600 text-white', label: 'Red' },
  { value: 'bg-cafe-gold', label: 'Gold' },
  { value: 'bg-cafe-cinnamon', label: 'Cinnamon' },
  { value: 'bg-cafe-espresso', label: 'Espresso' },
  { value: 'bg-primary', label: 'Primary' },
];

const makeCategoryId = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 32);

export const CategorySidebar = ({ selectedCategory, onCategorySelect, userRole, categories = [], onCategoriesChange }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('salad');
  const [newCategoryColor, setNewCategoryColor] = useState('bg-green-600 text-white');
  const { toast } = useToast();

  const allItemsCategory = {
    id: 'all',
    name: 'All Items',
    icon: ChefHat,
    itemCount: categories.reduce((sum, cat) => sum + (cat.itemCount || 0), 0),
    color: 'bg-primary',
  };
  // Keep categories in the order they are provided (no sorting)
  const sidebarCategories = [allItemsCategory, ...categories];

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddCategory = () => {
    const name = newCategoryName.trim().toUpperCase();
    const id = makeCategoryId(newCategoryName);

    if (!name || !id) {
      toast({
        title: 'Category name required',
        description: 'Enter a name before adding a category.',
        variant: 'destructive',
      });
      return;
    }

    if (categories.some((category) => category.id === id)) {
      toast({
        title: 'Category already exists',
        description: 'Use a different category name.',
        variant: 'destructive',
      });
      return;
    }

    const iconOption = iconOptions.find((option) => option.value === newCategoryIcon) || iconOptions[0];
    const newCategory = {
      id,
      name,
      icon: iconOption.icon,
      iconName: iconOption.value,
      itemCount: 0,
      color: newCategoryColor,
    };

    onCategoriesChange?.([...categories, newCategory]);
    onCategorySelect(id);
    setNewCategoryName('');
    setNewCategoryIcon('salad');
    setNewCategoryColor('bg-green-600 text-white');
    setIsAddOpen(false);
    toast({
      title: 'Category added',
      description: `${name} is ready for new menu items.`,
    });
  };

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
      {userRole === 'admin' && (
        <div className="p-4 border-b border-border">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="Example: SHAKES"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {iconOptions.map((option) => {
                      const Icon = option.icon;
                      const selected = newCategoryIcon === option.value;
                      return (
                        <Button
                          key={option.value}
                          type="button"
                          variant={selected ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewCategoryIcon(option.value)}
                          className="justify-start"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {option.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={newCategoryColor === option.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewCategoryColor(option.value)}
                        className="justify-start"
                      >
                        <span className={`mr-2 h-4 w-4 rounded ${option.value}`} />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleAddCategory} className="w-full">
                  Add Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
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
                  const isSelected = selectedCategory === category.id;
                  return (
                    <SortableCategoryItem
                      key={category.id}
                      category={category}
                      isSelected={isSelected}
                      onCategorySelect={onCategorySelect}
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
