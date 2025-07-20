import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit3, Save, X } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "@/hooks/use-toast";

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

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  itemCount: number;
  color: string;
}

interface MenuItemFormProps {
  item?: MenuItem;
  onSave: (item: Omit<MenuItem, 'id'> & { id?: string }) => void;
  trigger?: React.ReactNode;
  categories?: Category[];
}

export const MenuItemForm = ({ item, onSave, trigger, categories }: MenuItemFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: item?.name || '',
    price: item?.price || 0,
    category: item?.category || 'coffee',
    image: item?.image || '',
    description: item?.description || '',
    isPopular: item?.isPopular || false,
    isAvailable: item?.isAvailable !== false,
  });
  const { toast } = useToast();

  const defaultCategories = [
    { value: 'coffee', label: 'Coffee' },
    { value: 'pastries', label: 'Pastries' },
    { value: 'sandwiches', label: 'Sandwiches' },
    { value: 'salads', label: 'Salads' },
    { value: 'beverages', label: 'Beverages' },
  ];

  // Convert categories prop to the format needed for the select
  const categoryOptions = categories?.map(cat => ({
    value: cat.id,
    label: cat.name
  })) || defaultCategories;

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for the item",
        variant: "destructive",
      });
      return;
    }

    if (formData.price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    onSave({ ...formData, id: item?.id });
    setIsOpen(false);
    toast({
      title: item ? "Item updated" : "Item added",
      description: `${formData.name} has been ${item ? 'updated' : 'added'} successfully`,
    });
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      {item ? <Edit3 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
      {item ? 'Edit Item' : 'Add Item'}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter item name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter item description"
              rows={3}
            />
          </div>

          <ImageUpload
            currentImage={formData.image}
            onImageChange={(imageUrl) => setFormData({ ...formData, image: imageUrl || '' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="popular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
              />
              <Label htmlFor="popular" className="text-sm">Mark as Popular</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
              />
              <Label htmlFor="available" className="text-sm">Available</Label>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              {item ? 'Update Item' : 'Add Item'}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};