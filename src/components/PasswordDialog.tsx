import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  description?: string;
}

const ADMIN_PASSWORD = "Haris1234";

export const PasswordDialog = ({ isOpen, onClose, onSuccess, title, description }: PasswordDialogProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      onSuccess();
      onClose();
      setPassword('');
      setError('');
      toast({
        title: "Access Granted",
        description: "Admin operation authorized",
        variant: "default"
      });
    } else {
      setError('Incorrect password');
      toast({
        title: "Access Denied",
        description: "Incorrect admin password",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>{title}</span>
          </DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Admin Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter admin password"
              autoFocus
            />
            {error && (
              <div className="flex items-center space-x-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Confirm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};