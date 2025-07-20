import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Star,
  BarChart3,
  DollarSign,
  ShoppingCart
} from "lucide-react";
import { useState, useEffect } from "react";

interface Order {
  id: string;
  items: Array<{ id: string; name: string; price: number; quantity: number; category: string }>;
  timestamp: Date;
}

interface ProductSalesData {
  id: string;
  name: string;
  category: string;
  totalSold: number;
  totalRevenue: number;
  averagePrice: number;
  trend: number; // percentage change
  isPopular: boolean;
}

export const ProductSalesAnalysis = () => {
  const [productSales, setProductSales] = useState<ProductSalesData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadProductSalesData();
  }, []);

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

  const loadProductSalesData = () => {
    const orders = getStoredOrders();
    const productStats: { [key: string]: ProductSalesData } = {};

    // Calculate current period (today)
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Calculate previous period (yesterday) for trend
    const yesterday = new Date(todayStart);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStart = new Date(yesterday);

    const todayOrders = orders.filter(order => new Date(order.timestamp) >= todayStart);
    const yesterdayOrders = orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= yesterdayStart && orderDate < todayStart;
    });

    // Process today's sales
    todayOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productStats[item.id]) {
          productStats[item.id] = {
            id: item.id,
            name: item.name,
            category: item.category,
            totalSold: 0,
            totalRevenue: 0,
            averagePrice: item.price,
            trend: 0,
            isPopular: false
          };
        }
        productStats[item.id].totalSold += item.quantity;
        productStats[item.id].totalRevenue += item.price * item.quantity;
      });
    });

    // Calculate yesterday's sales for trend
    const yesterdayStats: { [key: string]: number } = {};
    yesterdayOrders.forEach(order => {
      order.items.forEach(item => {
        yesterdayStats[item.id] = (yesterdayStats[item.id] || 0) + item.quantity;
      });
    });

    // Calculate trends and mark popular items
    Object.values(productStats).forEach(product => {
      const yesterdaySales = yesterdayStats[product.id] || 0;
      if (yesterdaySales > 0) {
        product.trend = ((product.totalSold - yesterdaySales) / yesterdaySales) * 100;
      } else if (product.totalSold > 0) {
        product.trend = 100; // New item with sales
      }
      
      // Mark as popular if sold more than 5 items today
      product.isPopular = product.totalSold >= 5;
    });

    const sortedProducts = Object.values(productStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    setProductSales(sortedProducts);
  };

  const categories = ['all', ...Array.from(new Set(productSales.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'all' 
    ? productSales 
    : productSales.filter(p => p.category === selectedCategory);

  const maxRevenue = Math.max(...productSales.map(p => p.totalRevenue));

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  const formatTrend = (trend: number) => {
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span>Product Sales Analysis</span>
        </CardTitle>
        <div className="flex space-x-2 flex-wrap">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {filteredProducts.length > 0 ? filteredProducts.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-secondary text-secondary-foreground'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {product.name}
                    </h3>
                    {product.isPopular && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                    <span className="capitalize">{product.category}</span>
                    <span className="flex items-center">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      {product.totalSold} sold
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      ₹{Math.round(product.totalRevenue)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={(product.totalRevenue / maxRevenue) * 100} 
                      className="flex-1 h-2"
                    />
                    <div className="flex items-center space-x-1 text-xs">
                      {getTrendIcon(product.trend)}
                      <span className={`font-medium ${
                        product.trend > 0 ? 'text-green-600' : 
                        product.trend < 0 ? 'text-red-600' : 
                        'text-gray-500'
                      }`}>
                        {formatTrend(product.trend)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">₹{Math.round(product.totalRevenue)}</div>
                  <div className="text-sm text-muted-foreground">Avg: ₹{Math.round(product.averagePrice)}</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No sales data available for this category</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};