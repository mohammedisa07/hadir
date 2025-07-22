import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  Download, 
  Trash2, 
  Settings,
  Coffee,
  BarChart3,
  Package,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuickActionsProps {
  onRefresh?: () => void;
  onResetData?: () => void;
  onExport?: () => void;
  onNavigateToMenu?: () => void;
  onNavigateToAnalytics?: () => void;
}

export const QuickActions = ({ 
  onRefresh, 
  onResetData, 
  onExport, 
  onNavigateToMenu, 
  onNavigateToAnalytics 
}: QuickActionsProps) => {
  const { toast } = useToast();

  // Add state for modals
  const [showCashierModal, setShowCashierModal] = useState(false);
  const [showAdminPwModal, setShowAdminPwModal] = useState(false);

  // Cashier management state
  const [cashiers, setCashiers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cashiers') || '[]');
    } catch { return []; }
  });
  const [newCashier, setNewCashier] = useState({ username: '', password: '' });

  const addCashier = () => {
    if (!newCashier.username || !newCashier.password) return;
    const updated = [...cashiers, { ...newCashier }];
    setCashiers(updated);
    localStorage.setItem('cashiers', JSON.stringify(updated));
    setNewCashier({ username: '', password: '' });
  };
  const removeCashier = (username: string) => {
    const updated = cashiers.filter(c => c.username !== username);
    setCashiers(updated);
    localStorage.setItem('cashiers', JSON.stringify(updated));
  };

  // Admin password change state
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwError, setPwError] = useState('');
  const handleAdminPwChange = () => {
    const stored = localStorage.getItem('adminPassword') || 'Haris1234';
    if (oldPw !== stored) {
      setPwError('Old password incorrect');
      return;
    }
    if (!newPw) {
      setPwError('New password required');
      return;
    }
    localStorage.setItem('adminPassword', newPw);
    setOldPw(''); setNewPw(''); setPwError('');
    setShowAdminPwModal(false);
    toast({ title: 'Password Changed', description: 'Admin password updated.' });
  };

  // Export data to CSV
  const exportToCSV = () => {
    try {
      const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
      
      // Create CSV content for orders
      const orderHeaders = 'Order ID,Date,Time,Customer Name,Phone,Total,Tax,Payment Method,Items\n';
      const orderRows = orders.map((order: any) => {
        const items = order.items.map((item: any) => `${item.name}(${item.quantity})`).join(';');
        return [
          order.id,
          new Date(order.timestamp).toLocaleDateString(),
          new Date(order.timestamp).toLocaleTimeString(),
          order.customerDetails.name,
          order.customerDetails.phone,
          order.finalTotal,
          order.tax || 0,
          order.paymentMethod,
          items
        ].join(',');
      }).join('\n');
      
      const csvContent = orderHeaders + orderRows;
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `cafe-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Export error:', error);
      return false;
    }
  };

  // Export data to PDF
  const exportToPDF = () => {
    try {
      const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text("Hadir's Cafe - Sales Report", 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
      
      // Summary stats
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.finalTotal, 0);
      const totalOrders = orders.length;
      
      doc.text(`Total Orders: ${totalOrders}`, 20, 50);
      doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`, 20, 60);
      
      // Recent orders
      doc.text('Recent Orders:', 20, 80);
      let yPosition = 90;
      
      orders.slice(0, 15).forEach((order: any, index: number) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(10);
        doc.text(
          `${order.id} - ${new Date(order.timestamp).toLocaleDateString()} - ₹${order.finalTotal} - ${order.customerDetails.name}`,
          20, 
          yPosition
        );
        yPosition += 10;
      });
      
      doc.save(`cafe-report-${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF export error:', error);
      return false;
    }
  };

  // Create backup of all data
  const createBackup = () => {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        orderHistory: localStorage.getItem('orderHistory') || '[]',
        menuItems: localStorage.getItem('menuItems') || '[]',
        dailyCashEarned: localStorage.getItem('dailyCashEarned') || '0',
        lastCashReset: localStorage.getItem('lastCashReset') || '',
        orderCounter: localStorage.getItem('orderCounter') || '1'
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { 
        type: 'application/json;charset=utf-8;' 
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `cafe-backup-${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Backup error:', error);
      return false;
    }
  };

  // Clear all today's sales
  const resetTodaysSales = () => {
    localStorage.setItem('dailyCashEarned', '0');
    localStorage.setItem('lastCashReset', new Date().toDateString());
    onRefresh?.();
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'refresh':
        onRefresh?.();
        toast({
          title: "Data Refreshed",
          description: "Dashboard data has been updated",
        });
        break;
        
      case 'export-csv':
        if (exportToCSV()) {
          toast({
            title: "CSV Export Complete",
            description: "Your data has been exported to CSV format",
          });
        } else {
          toast({
            title: "Export Failed",
            description: "Unable to export data. Please try again.",
            variant: "destructive"
          });
        }
        break;
        
      case 'export-pdf':
        if (exportToPDF()) {
          toast({
            title: "PDF Export Complete",
            description: "Your sales report has been generated",
          });
        } else {
          toast({
            title: "Export Failed",
            description: "Unable to generate PDF. Please try again.",
            variant: "destructive"
          });
        }
        break;
        
      case 'backup':
        if (createBackup()) {
          toast({
            title: "Backup Created",
            description: "Data backup has been downloaded successfully",
          });
        } else {
          toast({
            title: "Backup Failed",
            description: "Unable to create backup. Please try again.",
            variant: "destructive"
          });
        }
        break;
        
      case 'reset-today':
        if (confirm('Reset today\'s sales? This will clear daily cash earnings.')) {
          resetTodaysSales();
          toast({
            title: "Today's Sales Reset",
            description: "Daily cash earnings have been cleared",
            variant: "destructive"
          });
        }
        break;
        
      case 'reset-all':
        if (confirm('Are you sure you want to reset ALL data? This cannot be undone.')) {
          // Clear all relevant localStorage keys
          localStorage.removeItem('orderHistory');
          localStorage.removeItem('menuItems');
          localStorage.removeItem('cashiers');
          localStorage.removeItem('adminPassword');
          localStorage.removeItem('dailyCashEarned');
          localStorage.removeItem('lastCashReset');
          localStorage.removeItem('orderCounter');
          localStorage.removeItem('user');
          localStorage.removeItem('dailySales');
          // Add any other relevant keys here
          onResetData?.();
          toast({
            title: "All Data Reset",
            description: "All dashboard data has been cleared",
            variant: "destructive"
          });
          setTimeout(() => window.location.reload(), 500);
        }
        break;
        
      case 'menu-settings':
        // This would navigate to menu management - requires routing setup
        toast({
          title: "Menu Settings",
          description: "Use the POS system to manage menu items and availability",
        });
        break;
        
      case 'staff-management':
        toast({
          title: "Staff Management",
          description: "Staff management requires backend integration. Connect to Supabase for user management.",
        });
        break;
        
      case 'analytics':
        toast({
          title: "Analytics View",
          description: "You're already viewing the analytics dashboard",
        });
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-primary" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickAction('refresh')}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickAction('export-csv')}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>CSV</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickAction('export-pdf')}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>PDF</span>
          </Button>

          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => handleQuickAction('backup')}
            className="flex items-center space-x-2"
          >
            <Package className="h-4 w-4" />
            <span>Backup</span>
          </Button>
        </div>

        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => handleQuickAction('staff-management')}
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Staff
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => handleQuickAction('menu-settings')}
          >
            <Coffee className="h-4 w-4 mr-2" />
            Menu Settings
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => handleQuickAction('analytics')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        <div className="pt-2 border-t space-y-2">
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={() => handleQuickAction('reset-today')}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Today's Sales
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={() => handleQuickAction('reset-all')}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Reset All Data
          </Button>
        </div>
      </CardContent>
      <Dialog open={showCashierModal} onOpenChange={setShowCashierModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Manage Cashiers</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input placeholder="Username" value={newCashier.username} onChange={e => setNewCashier({ ...newCashier, username: e.target.value })} />
              <Input placeholder="Password" type="password" value={newCashier.password} onChange={e => setNewCashier({ ...newCashier, password: e.target.value })} />
              <Button onClick={addCashier}>Add</Button>
            </div>
            <ul className="space-y-1">
              {cashiers.map((c, i) => (
                <li key={i} className="flex items-center justify-between border p-2 rounded">
                  <span>{c.username}</span>
                  <Button variant="destructive" size="sm" onClick={() => removeCashier(c.username)}>Remove</Button>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showAdminPwModal} onOpenChange={setShowAdminPwModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Admin Password</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label>Old Password</Label>
            <Input type="password" value={oldPw} onChange={e => { setOldPw(e.target.value); setPwError(''); }} />
            <Label>New Password</Label>
            <Input type="password" value={newPw} onChange={e => { setNewPw(e.target.value); setPwError(''); }} />
            {pwError && <div className="text-destructive text-sm">{pwError}</div>}
            <div className="flex justify-end"><Button onClick={handleAdminPwChange}>Change Password</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};