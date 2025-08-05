import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Papa from 'papaparse';

interface Order {
  id: string;
  items: Array<{ id: string; name: string; price: number; quantity: number; category: string }>;
  total: number;
  subtotal: number;
  tax: number;
  finalTotal: number;
  discount?: number;
  taxRate?: number;
  paymentMethod: 'cash' | 'card' | 'upi';
  timestamp: Date;
  cashier: string;
  customerDetails: {
    name: string;
    phone: string;
    email?: string;
  };
}

export const ExportOptions = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const { toast } = useToast();

  const getStoredOrders = (): Order[] => {
    try {
      const orders = localStorage.getItem('orderHistory') || '[]';
      return JSON.parse(orders).map((order: any) => ({
        ...order,
        timestamp: new Date(order.timestamp)
      }));
    } catch {
      return [];
    }
  };

  const exportMonthlyData = () => {
    const orders = getStoredOrders();
    const [year, month] = selectedMonth.split('-');
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate.getFullYear() === parseInt(year) && 
             orderDate.getMonth() === parseInt(month) - 1;
    });

    if (monthlyOrders.length === 0) {
      toast({
        title: "No Data Found",
        description: "No orders found for the selected month.",
        variant: "destructive"
      });
      return;
    }

    // Generate CSV content
    const csvHeaders = [
      'Order ID', 'Date', 'Time', 'Customer Name', 'Customer Phone', 
      'Items', 'Total Amount', 'Payment Method', 'Cashier'
    ];

    const csvRows = monthlyOrders.map(order => [
      order.id,
      order.timestamp.toLocaleDateString(),
      order.timestamp.toLocaleTimeString(),
      order.customerDetails.name,
      order.customerDetails.phone,
      order.items.map(item => `${item.name} (${item.quantity}x)`).join('; '),
      order.finalTotal.toFixed(2),
      order.paymentMethod.toUpperCase(),
      order.cashier
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${monthlyOrders.length} orders for ${selectedMonth}`,
    });
  };

  // Export all orders as CSV
  const exportAllOrders = () => {
    const orders = getStoredOrders();
    if (orders.length === 0) {
      toast({
        title: "No Data Found",
        description: "No orders found to export.",
        variant: "destructive"
      });
      return;
    }
    const csvHeaders = [
      'Order ID', 'Date', 'Time', 'Customer Name', 'Customer Phone', 
      'Items', 'Total Amount', 'Payment Method', 'Cashier'
    ];
    const csvRows = orders.map(order => [
      order.id,
      order.timestamp.toLocaleDateString(),
      order.timestamp.toLocaleTimeString(),
      order.customerDetails.name,
      order.customerDetails.phone,
      order.items.map(item => `${item.name} (${item.quantity}x)`).join('; '),
      order.finalTotal.toFixed(2),
      order.paymentMethod.toUpperCase(),
      order.cashier
    ]);
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `all_orders.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export Successful",
      description: `Exported ${orders.length} orders as all_orders.csv`,
    });
  };

  // Import orders from CSV
  const importOrdersFromCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        try {
          const orders = results.data.map((row: any) => ({
            id: row['Order ID'],
            timestamp: new Date(row['Date'] + ' ' + row['Time']),
            customerDetails: {
              name: row['Customer Name'],
              phone: row['Customer Phone'],
            },
            items: (row['Items'] || '').split(';').map((item: string) => {
              const match = item.match(/(.+) \((\d+)x\)/);
              if (!match) return null;
              return { name: match[1].trim(), quantity: parseInt(match[2]), price: 0, category: '' };
            }).filter(Boolean),
            finalTotal: parseFloat(row['Total Amount']),
            paymentMethod: (row['Payment Method'] || '').toLowerCase(),
            cashier: row['Cashier'],
            // Add other fields as needed
          }));
          localStorage.setItem('orderHistory', JSON.stringify(orders));
          toast({
            title: "Import Successful",
            description: `Imported ${orders.length} orders from CSV.`
          });
          window.location.reload();
        } catch (e) {
          toast({
            title: "Import Failed",
            description: "There was an error importing the CSV file.",
            variant: "destructive"
          });
        }
      },
      error: function() {
        toast({
          title: "Import Failed",
          description: "There was an error reading the CSV file.",
          variant: "destructive"
        });
      }
    });
  };

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      options.push({ value, label });
    }
    
    return options;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5 text-primary" />
          <span>Export Sales Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Month</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {generateMonthOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={exportMonthlyData} className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Export Monthly Report
        </Button>
        <Button onClick={exportAllOrders} className="w-full" variant="secondary">
          <FileText className="mr-2 h-4 w-4" />
          Export All Orders
        </Button>
        <div className="flex flex-col space-y-2 pt-2">
          <label className="text-sm font-medium">Import Orders from CSV</label>
          <input
            type="file"
            accept=".csv"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                importOrdersFromCSV(e.target.files[0]);
              }
            }}
            className="border rounded px-2 py-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};