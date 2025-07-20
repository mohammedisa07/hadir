import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RefreshCw, Download, RotateCcw, ChevronDown, Calendar, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PasswordDialog } from "../PasswordDialog";

interface DashboardHeaderProps {
  onRefresh: () => void;
  onResetData: () => void;
  onResetTodaysSales: () => void;
}

export const DashboardHeader = ({ onRefresh, onResetData, onResetTodaysSales }: DashboardHeaderProps) => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'resetAll' | 'resetToday' | null>(null);
  const { toast } = useToast();

  const handleResetRequest = (action: 'resetAll' | 'resetToday') => {
    setPendingAction(action);
    setShowPasswordDialog(true);
  };

  const executeResetAction = () => {
    if (pendingAction === 'resetAll') {
      // Clear all sales data
      localStorage.removeItem('orderHistory');
      onResetData();
      
      toast({
        title: "All Data Reset",
        description: "All sales data has been cleared.",
        variant: "destructive"
      });
    } else if (pendingAction === 'resetToday') {
      // Filter out today's orders
      const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const filteredOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.timestamp);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() !== today.getTime();
      });
      
      localStorage.setItem('orderHistory', JSON.stringify(filteredOrders));
      onResetTodaysSales();
      
      toast({
        title: "Today's Sales Reset",
        description: "Today's sales data has been cleared.",
        variant: "destructive"
      });
    }
    
    setPendingAction(null);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img 
          src="/lovable-uploads/ed8ea1fe-f3dd-493c-8d69-b86879fcac83.png" 
          alt="H3 Logo" 
          className="h-12 w-auto"
        />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights and analytics for H3 Cafe</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="destructive" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Sales
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleResetRequest('resetToday')}>
              <Calendar className="mr-2 h-4 w-4" />
              Reset Today's Sales
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleResetRequest('resetAll')}>
              <Database className="mr-2 h-4 w-4" />
              Reset All Sales Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSuccess={executeResetAction}
        title="Admin Authentication Required"
        description="Please enter the admin password to proceed with the reset operation."
      />
    </div>
  );
};