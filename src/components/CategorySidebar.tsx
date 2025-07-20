import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Coffee, Cookie, Sandwich, Salad, Wine, ChefHat, Edit3, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
}

const defaultCategories: Category[] = [
  { id: 'all', name: 'All Items', icon: ChefHat, itemCount: 24, color: 'bg-primary' },
  { id: 'coffee', name: 'Coffee & Tea', icon: Coffee, itemCount: 12, color: 'bg-cafe-espresso' },
  { id: 'pastries', name: 'Pastries', icon: Cookie, itemCount: 8, color: 'bg-cafe-cinnamon' },
  { id: 'sandwiches', name: 'Sandwiches', icon: Sandwich, itemCount: 6, color: 'bg-accent' },
  { id: 'salads', name: 'Fresh Salads', icon: Salad, itemCount: 4, color: 'bg-success' },
  { id: 'beverages', name: 'Cold Drinks', icon: Wine, itemCount: 10, color: 'bg-cafe-gold' },
];

export const CategorySidebar = ({ selectedCategory, onCategorySelect, userRole, categories: propCategories, onCategoriesChange }: CategorySidebarProps) => {
  const [categories, setCategories] = useState<Category[]>(propCategories || defaultCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Update local state when prop changes
  useEffect(() => {
    if (propCategories) {
      setCategories(propCategories);
    }
  }, [propCategories]);

  // Notify parent of changes
  useEffect(() => {
    if (onCategoriesChange) {
      onCategoriesChange(categories);
    }
  }, [categories, onCategoriesChange]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addNewCategory = () => {
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: `New Category`,
      icon: ChefHat,
      itemCount: 0,
      color: 'bg-muted'
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    
    // Immediately open edit dialog for the new category
    setEditingCategory(newCategory);
    setEditName(newCategory.name);
    setIsEditDialogOpen(true);
  };

  const deleteCategory = (categoryId: string) => {
    if (categoryId === 'all') return; // Don't allow deleting "All Items"
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    if (selectedCategory === categoryId) {
      onCategorySelect('all');
    }
    toast({
      title: "Category deleted",
      description: "Category has been removed successfully",
    });
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setIsEditDialogOpen(true);
  };

  const saveCategory = () => {
    if (!editingCategory || !editName.trim()) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid category name",
        variant: "destructive",
      });
      return;
    }

    const updatedCategories = categories.map(cat =>
      cat.id === editingCategory.id
        ? { ...cat, name: editName.trim() }
        : cat
    );
    setCategories(updatedCategories);
    setIsEditDialogOpen(false);
    setEditingCategory(null);
    setEditName("");
    
    toast({
      title: "Category updated",
      description: "Category name has been updated successfully",
    });
  };

  const cancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingCategory(null);
    setEditName("");
  };

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Categories</h2>
          {userRole === 'admin' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={addNewCategory}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {filteredCategories.map((category) => {
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
                    <p className={`font-medium truncate ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {category.name}
                    </p>
                    <p className={`text-sm ${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {category.itemCount} items
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Badge 
                    variant={isSelected ? "secondary" : "outline"} 
                    className="h-6 text-xs"
                  >
                    {category.itemCount}
                  </Badge>
                  
                  {userRole === 'admin' && category.id !== 'all' && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-muted"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(category);
                        }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCategory(category.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Total Categories: <span className="font-medium text-foreground">{categories.length}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total Items: <span className="font-medium text-foreground">
              {categories.reduce((sum, cat) => sum + cat.itemCount, 0)}
            </span>
          </p>
        </div>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter category name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveCategory();
                  } else if (e.key === 'Escape') {
                    cancelEdit();
                  }
                }}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={saveCategory} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};