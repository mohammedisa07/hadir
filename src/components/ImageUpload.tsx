import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  className?: string;
}

export const ImageUpload = ({ currentImage, onImageChange, className = "" }: ImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      onImageChange(result);
      toast({
        title: "Image uploaded",
        description: "Image has been successfully uploaded",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Image removed",
      description: "Image has been removed",
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Defensive: always use a string for imagePreview
  const safeImagePreview = typeof imagePreview === 'string' && imagePreview ? imagePreview : '';

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium">Item Image</Label>
      {safeImagePreview ? (
        <div className="relative w-full h-32 border border-border rounded-lg overflow-hidden bg-muted">
          <img 
            src={safeImagePreview || '/placeholder.svg'} 
            alt="Preview" 
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.src = '/placeholder.svg'; }}
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div 
          className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={handleButtonClick}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            Click to upload image
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG up to 5MB
          </p>
        </div>
      )}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={e => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const result = typeof ev.target?.result === 'string' ? ev.target.result : '';
              onImageChange(result);
            };
            reader.readAsDataURL(file);
          } else {
            onImageChange('');
          }
        }}
        className="hidden"
      />
      {!safeImagePreview && (
        <Button 
          variant="outline" 
          onClick={handleButtonClick}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      )}
    </div>
  );
};