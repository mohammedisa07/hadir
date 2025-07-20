import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Coffee, 
  Users, 
  ShoppingCart,
  Clock,
  Calendar,
  Award,
  RefreshCw,
  Download,
  AlertTriangle,
  Package,
  TrendingDown,
  Percent,
  FileText,
  BarChart3
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { DashboardHeader } from "./admin/DashboardHeader";
import { TaxSettings } from "./admin/TaxSettings";
import { ExportOptions } from "./admin/ExportOptions";
import { DateComparison } from "./admin/DateComparison";
import { ProductSalesAnalysis } from "./admin/ProductSalesAnalysis";
import { QuickStats } from "./admin/QuickStats";
import { QuickActions } from "./admin/QuickActions";

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

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  isAvailable?: boolean;
}

interface AnalyticsDashboardProps {
  onResetTodaysSales?: () => void;
}

export const AnalyticsDashboard = ({ onResetTodaysSales }: AnalyticsDashboardProps = {}) => {
  const [comparisonStartDate, setComparisonStartDate] = useState<Date | undefined>(new Date());
  const [comparisonEndDate, setComparisonEndDate] = useState<Date | undefined>(new Date());

  // Get real data from localStorage
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

  const getStoredMenuItems = (): MenuItem[] => {
    try {
      const items = localStorage.getItem('menuItems') || '[]';
      return JSON.parse(items);
    } catch {
      return [];
    }
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setOrders(getStoredOrders());
    setMenuItems(getStoredMenuItems());
  };

  const resetData = () => {
    setOrders([]);
    setMenuItems(getStoredMenuItems());
  };

  const resetTodaysSales = () => {
    refreshData();
    onResetTodaysSales?.();
  };

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setComparisonStartDate(start);
    setComparisonEndDate(end);
  };

  // Filter orders for today's data
  const getTodaysOrders = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= today;
    });
  };

  // Filter orders for comparison period if dates are selected
  const getComparisonOrders = () => {
    if (!comparisonStartDate || !comparisonEndDate) return [];
    
    const start = new Date(comparisonStartDate);
    const end = new Date(comparisonEndDate);
    end.setHours(23, 59, 59, 999);
    
    return orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= start && orderDate <= end;
    });
  };

  const currentOrders = getTodaysOrders();
  const compareOrders = getComparisonOrders();

  // Calculate statistics
  const calculateStats = (orderList: Order[]) => {
    const revenue = orderList.reduce((sum, order) => sum + order.finalTotal, 0);
    const totalTax = orderList.reduce((sum, order) => sum + order.tax, 0);
    const totalOrders = orderList.length;
    const uniqueCustomers = new Set(orderList.map(order => order.customerDetails.phone)).size;
    const avgOrder = totalOrders > 0 ? revenue / totalOrders : 0;
    
    return { revenue, totalTax, totalOrders, uniqueCustomers, avgOrder };
  };

  const currentStats = calculateStats(currentOrders);
  const compareStats = calculateStats(compareOrders);

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const revenueChange = calculateChange(currentStats.revenue, compareStats.revenue);
  const ordersChange = calculateChange(currentStats.totalOrders, compareStats.totalOrders);
  const customersChange = calculateChange(currentStats.uniqueCustomers, compareStats.uniqueCustomers);

  const getComparisonLabel = () => {
    if (!comparisonStartDate || !comparisonEndDate) return "No comparison";
    if (comparisonStartDate.toDateString() === comparisonEndDate.toDateString()) {
      return comparisonStartDate.toLocaleDateString();
    }
    return `${comparisonStartDate.toLocaleDateString()} - ${comparisonEndDate.toLocaleDateString()}`;
  };

  // Get top selling items
  const getTopItems = () => {
    const itemStats: { [key: string]: { name: string; sales: number; revenue: number; category: string } } = {};
    
    currentOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemStats[item.id]) {
          itemStats[item.id] = { name: item.name, sales: 0, revenue: 0, category: item.category };
        }
        itemStats[item.id].sales += item.quantity;
        itemStats[item.id].revenue += item.price * item.quantity;
      });
    });

    return Object.values(itemStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  // Get out of stock items
  const outOfStockItems = menuItems.filter(item => !item.isAvailable);

  // Generate hourly data for charts
  const getHourlyData = () => {
    const hourlyStats: { [key: string]: { orders: number; revenue: number } } = {};
    
    for (let i = 8; i <= 22; i++) {
      const hour = i <= 12 ? `${i} AM` : `${i - 12} PM`;
      if (i === 12) hourlyStats['12 PM'] = { orders: 0, revenue: 0 };
      else hourlyStats[hour] = { orders: 0, revenue: 0 };
    }

    currentOrders.forEach(order => {
      const hour = order.timestamp.getHours();
      const hourKey = hour <= 12 ? `${hour} AM` : `${hour - 12} PM`;
      if (hour === 12) {
        const key = '12 PM';
        if (hourlyStats[key]) {
          hourlyStats[key].orders++;
          hourlyStats[key].revenue += order.finalTotal;
        }
      } else if (hourlyStats[hourKey]) {
        hourlyStats[hourKey].orders++;
        hourlyStats[hourKey].revenue += order.finalTotal;
      }
    });

    return Object.entries(hourlyStats).map(([hour, stats]) => ({
      hour,
      orders: stats.orders,
      revenue: Math.round(stats.revenue)
    }));
  };

  // Get daily comparison data for charts
  const getDailyComparisonData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentWeekData = days.map(day => ({ day, current: 0, previous: 0 }));
    
    // This is simplified - in real app you'd get actual week data
    currentOrders.slice(0, 7).forEach((order, index) => {
      if (currentWeekData[index]) {
        currentWeekData[index].current += order.finalTotal;
      }
    });
    
    compareOrders.slice(0, 7).forEach((order, index) => {
      if (currentWeekData[index]) {
        currentWeekData[index].previous += order.finalTotal;
      }
    });

    return currentWeekData;
  };

  const hourlyData = getHourlyData();
  const topItems = getTopItems();
  const dailyComparisonData = getDailyComparisonData();

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (change < 0) return <TrendingUp className="h-4 w-4 text-destructive rotate-180" />;
    return <div className="h-4 w-4" />;
  };

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <DashboardHeader onRefresh={refreshData} onResetData={resetData} onResetTodaysSales={resetTodaysSales} />

      {/* Admin Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaxSettings />
        <ExportOptions />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{Math.round(currentStats.revenue)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getTrendIcon(revenueChange)}
              <span>{formatChange(revenueChange)} vs {getComparisonLabel()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tax</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{Math.round(currentStats.totalTax)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>Tax collected</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{currentStats.totalOrders}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getTrendIcon(ordersChange)}
              <span>{formatChange(ordersChange)} vs {getComparisonLabel()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{currentStats.uniqueCustomers}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getTrendIcon(customersChange)}
              <span>{formatChange(customersChange)} vs {getComparisonLabel()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{Math.round(currentStats.avgOrder)}</div>
            <div className="flex items-center space-x-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>Per order value</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Out of Stock Alert */}
      {outOfStockItems.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>Out of Stock Items ({outOfStockItems.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {outOfStockItems.map(item => (
                <Badge key={item.id} variant="destructive" className="justify-center">
                  <Package className="mr-1 h-3 w-3" />
                  {item.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Middle Section with Date Comparison and Quick Components */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickStats />
        
        <DateComparison onDateRangeChange={handleDateRangeChange} />
        
        <QuickActions 
          onRefresh={refreshData} 
          onResetData={resetData}
        />
      </div>

      {/* Product Sales Analysis */}
      <ProductSalesAnalysis />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Revenue Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, '']} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stackId="1" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.6}
                  name="Current Period"
                />
                <Area 
                  type="monotone" 
                  dataKey="previous" 
                  stackId="2" 
                  stroke="hsl(var(--muted-foreground))" 
                  fill="hsl(var(--muted-foreground))" 
                  fillOpacity={0.3}
                  name="Previous Period"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Hourly Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="orders" fill="hsl(var(--primary))" name="Orders" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  name="Revenue (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-cafe-gold" />
              <span>Top Selling Items</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.length > 0 ? topItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-cafe-gold text-white' :
                      index === 1 ? 'bg-muted text-foreground' :
                      index === 2 ? 'bg-cafe-cinnamon text-white' :
                      'bg-secondary text-secondary-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.sales} sold • {item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">₹{Math.round(item.revenue)}</p>
                    <Badge variant="default" className="text-xs">
                      Top Seller
                    </Badge>
                  </div>
                </div>
              )) : (
                <p className="text-center text-muted-foreground py-8">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Recent Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {currentOrders.length > 0 ? currentOrders
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .slice(0, 10)
                  .map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.timestamp.toLocaleTimeString()} • {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                      <p className="text-xs text-muted-foreground">{order.customerDetails.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹{Math.round(order.finalTotal)}</p>
                      <Badge variant="outline" className="text-xs bg-success text-success-foreground">
                        {order.paymentMethod}
                      </Badge>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-muted-foreground py-8">No orders yet today</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Hourly Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
              {hourlyData.filter(data => data.orders > 0).map((data) => (
                <div key={data.hour} className="text-center p-2 rounded bg-muted/30">
                  <p className="text-xs font-medium text-muted-foreground">{data.hour}</p>
                  <p className="text-sm font-bold text-primary">{data.orders}</p>
                  <p className="text-xs text-cafe-cinnamon">₹{data.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Percent className="h-5 w-5 text-primary" />
              <span>Payment Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['cash', 'card', 'upi'].map(method => {
                const methodOrders = currentOrders.filter(order => order.paymentMethod === method);
                const percentage = currentOrders.length > 0 ? (methodOrders.length / currentOrders.length) * 100 : 0;
                return (
                  <div key={method} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{method}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{Math.round(percentage)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Quick Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Items Sold</span>
                <span className="font-medium">
                  {currentOrders.reduce((sum, order) => 
                    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Items/Order</span>
                <span className="font-medium">
                  {currentOrders.length > 0 ? 
                    Math.round(currentOrders.reduce((sum, order) => 
                      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                    ) / currentOrders.length) : 0
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Peak Hour</span>
                <span className="font-medium">
                  {hourlyData.reduce((max, current) => 
                    current.orders > max.orders ? current : max, { hour: 'N/A', orders: 0 }
                  ).hour}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};