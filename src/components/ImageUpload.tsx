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

export const ImageUpload = ({ currentImage, onImageChange, className = "" }) => {
  const [imagePreview, setImagePreview] = useState(currentImage || "");
  const [isLinkMode, setIsLinkMode] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  // Defensive: always use a string for imagePreview
  const safeImagePreview = typeof imagePreview === 'string' && imagePreview ? imagePreview : '';

  const handleButtonClick = () => {
    if (!isLinkMode) fileInputRef.current?.click();
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (linkInput && (linkInput.startsWith('http://') || linkInput.startsWith('https://'))) {
      setImagePreview(linkInput);
      setImageError(false);
      onImageChange(linkInput);
    }
  };

  // Reset error when link changes
  const handleLinkInputChange = (e) => {
    setLinkInput(e.target.value);
    setImageError(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium">Item Image</Label>
      <div className="flex space-x-2">
        <Button type="button" variant={!isLinkMode ? "default" : "outline"} size="sm" onClick={() => setIsLinkMode(false)}>
          Upload File
        </Button>
        <Button type="button" variant={isLinkMode ? "default" : "outline"} size="sm" onClick={() => setIsLinkMode(true)}>
          Upload via Link
        </Button>
      </div>
      {isLinkMode ? (
        <form onSubmit={handleLinkSubmit} className="flex space-x-2">
          <Input
            type="url"
            placeholder="Paste image URL here"
            value={linkInput}
            onChange={handleLinkInputChange}
            className="flex-1"
          />
          <Button type="submit" size="sm">Set</Button>
        </form>
      ) : null}
      {safeImagePreview ? (
        <div className="relative w-full h-32 border border-border rounded-lg overflow-hidden bg-muted">
          <img 
            src={safeImagePreview || '/placeholder.svg'} 
            alt="Preview" 
            className="w-full h-full object-cover"
            onError={e => { setImageError(true); e.currentTarget.src = '/placeholder.svg'; }}
            onLoad={() => setImageError(false)}
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={() => { setImagePreview(""); setLinkInput(""); setImageError(false); onImageChange(""); }}
          >
            <X className="h-3 w-3" />
          </Button>
          {imageError && <div className="text-red-500 text-xs absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded">Image could not be loaded. Please check the link.</div>}
        </div>
      ) : (
        !isLinkMode && (
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
        )
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
              setImagePreview(result);
              setImageError(false);
              onImageChange(result);
            };
            reader.readAsDataURL(file);
          } else {
            setImagePreview("");
            setImageError(false);
            onImageChange("");
          }
        }}
        className="hidden"
      />
      {!safeImagePreview && !isLinkMode && (
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