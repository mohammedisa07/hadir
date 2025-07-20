import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  TrendingUp, 
  Users, 
  Coffee,
  Star,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";

interface Order {
  id: string;
  items: Array<{ quantity: number }>;
  finalTotal: number;
  timestamp: Date;
  customerDetails: { phone: string };
}

export const QuickStats = () => {
  const [todayStats, setTodayStats] = useState({
    orders: 0,
    revenue: 0,
    customers: 0,
    avgOrder: 0,
    peakHour: 'N/A',
    topItem: 'N/A'
  });

  useEffect(() => {
    loadTodayStats();
  }, []);

  const loadTodayStats = () => {
    try {
      const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]').map((order: any) => ({
        ...order,
        timestamp: new Date(order.timestamp)
      }));

      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const todayOrders: Order[] = orders.filter((order: Order) => 
        new Date(order.timestamp) >= todayStart
      );

      const revenue = todayOrders.reduce((sum, order) => sum + order.finalTotal, 0);
      const customers = new Set(todayOrders.map(order => order.customerDetails.phone)).size;
      const avgOrder = todayOrders.length > 0 ? revenue / todayOrders.length : 0;

      // Calculate peak hour
      const hourlyStats: { [key: number]: number } = {};
      todayOrders.forEach(order => {
        const hour = order.timestamp.getHours();
        hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
      });

      const peakHour = Object.entries(hourlyStats).reduce((max, [hour, count]) => 
        count > max.count ? { hour: parseInt(hour), count } : max, 
        { hour: 0, count: 0 }
      );

      const peakHourStr = peakHour.hour > 0 ? 
        (peakHour.hour <= 12 ? `${peakHour.hour} AM` : `${peakHour.hour - 12} PM`) : 'N/A';

      setTodayStats({
        orders: todayOrders.length,
        revenue,
        customers,
        avgOrder,
        peakHour: peakHourStr,
        topItem: 'Cappuccino' // Simplified for now
      });
    } catch (error) {
      console.error('Error loading today stats:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Today's Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-2xl font-bold text-primary">{todayStats.orders}</div>
            <div className="text-sm text-muted-foreground">Orders</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-2xl font-bold text-primary">₹{Math.round(todayStats.revenue)}</div>
            <div className="text-sm text-muted-foreground">Revenue</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Customers</span>
            </div>
            <Badge variant="secondary">{todayStats.customers}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Avg Order</span>
            </div>
            <Badge variant="outline">₹{Math.round(todayStats.avgOrder)}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Peak Hour</span>
            </div>
            <Badge variant="secondary">{todayStats.peakHour}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Top Item</span>
            </div>
            <Badge variant="default">{todayStats.topItem}</Badge>
          </div>
        </div>

        {todayStats.orders === 0 && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">No orders yet today</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};