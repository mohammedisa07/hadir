import { useState, useEffect } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Coffee, BarChart3, Settings, LogOut, User, Shield, DollarSign, ShoppingCart } from "lucide-react";
import { PasswordDialog } from "./PasswordDialog";
import { Link } from "react-router-dom";
interface NavbarProps {
  userRole: 'admin' | 'cashier';
  onRoleChange: (role: 'admin' | 'cashier') => void;
  onViewChange: (view: 'pos' | 'dashboard') => void;
  currentView: 'pos' | 'dashboard';
  userName: string;
  dailyCashEarned: number;
  cartItemCount?: number;
}
export const Navbar = ({
  userRole,
  onRoleChange,
  onViewChange,
  currentView,
  userName,
  dailyCashEarned,
  cartItemCount = 0
}: NavbarProps) => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  // Reset order counter at midnight
  React.useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    const timer = setTimeout(() => {
      localStorage.setItem('orderCounter', '1');
      // Also clear daily sales for new day tracking
      const currentSales = JSON.parse(localStorage.getItem('dailySales') || '{}');
      const newDate = new Date().toDateString();
      if (!currentSales[newDate]) {
        localStorage.setItem('dailySales', JSON.stringify({
          ...currentSales,
          [newDate]: 0
        }));
      }
      window.location.reload();
    }, timeUntilMidnight);
    return () => clearTimeout(timer);
  }, []);

  const handleRoleSwitch = () => {
    if (userRole === 'cashier') {
      // Switching to admin requires password
      setShowPasswordDialog(true);
    } else {
      // Switching to cashier doesn't require password
      onRoleChange('cashier');
    }
  };

  const handlePasswordSuccess = () => {
    onRoleChange('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };
  return <nav className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      {/* Brand Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center p-1">
            <img src="/lovable-uploads/ed8ea1fe-f3dd-493c-8d69-b86879fcac83.png" alt="H3 Cafe Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Hadir's Cafe</h1>
            <p className="text-sm text-muted-foreground italic">love at first sip</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-2">
        <Button variant={currentView === 'pos' ? 'default' : 'ghost'} onClick={() => onViewChange('pos')} className="flex items-center space-x-2">
          <Coffee className="h-4 w-4" />
          <span>POS System</span>
        </Button>
        
        {userRole === 'admin' && <Button variant={currentView === 'dashboard' ? 'default' : 'ghost'} onClick={() => onViewChange('dashboard')} className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Admin Dashboard</span>
          </Button>}
        
        <Link to="/cart">
          <Button variant="ghost" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4" />
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </Link>
        
        <Badge variant="outline" className="flex items-center space-x-2 bg-success/10 text-success border-success/20">
          <DollarSign className="h-3 w-3" />
          <span>Today: ₹{Math.round(dailyCashEarned)}</span>
        </Badge>
      </div>

      {/* User Section */}
      <div className="flex items-center space-x-4">
        <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="flex items-center space-x-1">
          {userRole === 'admin' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
          <span className="capitalize">{userRole}</span>
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center space-x-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleRoleSwitch}>
              <User className="mr-2 h-4 w-4" />
              Switch to {userRole === 'admin' ? 'Cashier' : 'Admin'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSuccess={handlePasswordSuccess}
        title="Admin Access Required"
        description="Please enter the admin password to switch to admin role."
      />
    </nav>;
};