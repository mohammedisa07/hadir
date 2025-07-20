import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote,
  Coffee,
  Smartphone,
  Percent,
  Eye,
  Printer,
  ArrowLeft,
  ChefHat
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UnifiedReceiptPopup } from "@/components/UnifiedReceiptPopup";
import { Link } from "react-router-dom";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  isPopular?: boolean;
  isAvailable?: boolean;
}

interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showUnifiedReceipt, setShowUnifiedReceipt] = useState(false);
  const [orderCounter, setOrderCounter] = useState(() => {
    const stored = localStorage.getItem('orderCounter');
    return stored ? parseInt(stored) : 1;
  });
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    email: ''
  });
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [orderCompleted, setOrderCompleted] = useState(false);
  
  const { toast } = useToast();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('currentCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('currentCart', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('currentCart');
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const applyDiscount = (discount: number) => {
    setAppliedDiscount(discount);
    toast({
      title: `${discount}% discount applied`,
      description: "Discount has been applied to the order",
    });
  };

  const calculateDiscountedPrice = (price: number) => {
    return price * (1 - appliedDiscount / 100);
  };

  const getSubtotal = () => {
    const baseTotal = getTotalPrice();
    return calculateDiscountedPrice(baseTotal);
  };

  const getFinalTotal = () => {
    return getSubtotal();
  };

  const handlePrintReceipt = (receiptData: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error("Could not open print window");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${receiptData.id}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
              font-size: 14px;
              line-height: 1.4;
            }
            .receipt-container {
              max-width: 400px;
              margin: 0 auto;
              background: white;
            }
            .header { text-align: center; margin-bottom: 20px; }
            .cafe-name { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
            .tagline { font-style: italic; color: #666; margin-bottom: 10px; }
            .fssai { font-size: 10px; color: #666; margin-bottom: 5px; }
            .address { font-size: 10px; color: #666; margin-bottom: 20px; }
            .separator { border-top: 1px dashed #666; margin: 15px 0; }
            .receipt-details { margin-bottom: 15px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .customer-section { margin-bottom: 15px; }
            .items-section { margin-bottom: 15px; }
            .item { margin-bottom: 10px; }
            .item-name { font-weight: 600; }
            .item-details { font-size: 12px; color: #666; padding-left: 10px; }
            .totals { margin-bottom: 15px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .final-total { font-weight: bold; font-size: 16px; border-top: 1px solid #333; padding-top: 5px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <div class="cafe-name">HADIR'S CAFE</div>
              <div class="tagline">Love at first sip</div>
              <div class="address">
                No.8/117, Sudha Residency, Metro Nagar 4th Avenue,<br>
                Alapakkam, Chennai, Tamil Nadu 600116<br>
                Phone: +91 99418 39385
              </div>
            </div>
            
            <div class="separator"></div>
            
            <div class="receipt-details">
              <div class="detail-row">
                <span>Receipt #:</span>
                <span>${receiptData.id}</span>
              </div>
              <div class="detail-row">
                <span>Date:</span>
                <span>${receiptData.timestamp.toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span>Time:</span>
                <span>${receiptData.timestamp.toLocaleTimeString()}</span>
              </div>
              <div class="detail-row">
                <span>Cashier:</span>
                <span>${receiptData.cashier}</span>
              </div>
            </div>
            
            <div class="separator"></div>
            
            <div class="customer-section">
              <div><strong>Customer Details</strong></div>
              <div class="detail-row">
                <span>Name:</span>
                <span>${receiptData.customerDetails.name}</span>
              </div>
              <div class="detail-row">
                <span>Phone:</span>
                <span>${receiptData.customerDetails.phone}</span>
              </div>
              ${receiptData.customerDetails.email ? `
                <div class="detail-row">
                  <span>Email:</span>
                  <span>${receiptData.customerDetails.email}</span>
                </div>
              ` : ''}
            </div>
            
            <div class="separator"></div>
            
            <div class="items-section">
              ${receiptData.items.map(item => `
                <div class="item">
                  <div class="detail-row">
                    <span class="item-name">${item.name}</span>
                    <span>₹${item.quantity * item.price}</span>
                  </div>
                  <div class="item-details">${item.quantity} x ₹${item.price}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="separator"></div>
            
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${Math.round(receiptData.total)}</span>
              </div>
              ${receiptData.discount && receiptData.discount > 0 ? `
                <div class="total-row" style="color: green;">
                  <span>Discount (${receiptData.discount}%):</span>
                  <span>-₹${Math.round(receiptData.total - receiptData.subtotal)}</span>
                </div>
                <div class="total-row">
                  <span>After Discount:</span>
                  <span>₹${Math.round(receiptData.subtotal)}</span>
                </div>
              ` : ''}
              <div class="total-row final-total">
                <span>TOTAL:</span>
                <span>₹${Math.round(receiptData.finalTotal)}</span>
              </div>
              <div class="total-row">
                <span>Payment Method:</span>
                <span>${receiptData.paymentMethod.toUpperCase()}</span>
              </div>
            </div>
            
            <div class="separator"></div>
            
            <div class="footer">
              <div>Thank you for visiting!</div>
              <div>Visit us again soon.</div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const processPayment = (method: 'cash' | 'card' | 'upi') => {
    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to your cart before processing payment",
        variant: "destructive",
      });
      return;
    }

    if (!customerDetails.name || !customerDetails.phone) {
      toast({
        title: "Customer details required",
        description: "Please enter customer name and phone number",
        variant: "destructive",
      });
      return;
    }

    const subtotal = getSubtotal();
    const finalTotal = getFinalTotal();

    // Generate receipt (contains both receipt and KOT data)
    const receipt = {
      id: `ORD-${orderCounter.toString().padStart(4, '0')}`,
      items: cart,
      total: getTotalPrice(),
      subtotal,
      finalTotal,
      discount: appliedDiscount,
      paymentMethod: method,
      timestamp: new Date(),
      cashier: 'Mohammed Haris T A',
      customerDetails,
      tax: 0,
      taxRate: 0
    };

    // Store order in history for analytics
    const existingOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const orderWithCategories = {
      ...receipt,
      items: cart.map(item => ({
        ...item,
        category: item.category
      }))
    };
    localStorage.setItem('orderHistory', JSON.stringify([...existingOrders, orderWithCategories]));

    // Update order counter
    const newOrderCounter = orderCounter + 1;
    setOrderCounter(newOrderCounter);
    localStorage.setItem('orderCounter', newOrderCounter.toString());

    toast({
      title: "Payment processed!",
      description: `Order completed successfully with ${method} payment`,
    });

    // Store the receipt data and mark order as completed
    setReceiptData(receipt);
    setOrderCompleted(true);
    
    // Clear cart from localStorage as well
    clearCart();
    setCustomerDetails({ name: '', phone: '', email: '' });
    setAppliedDiscount(0);
  };

  const startNewOrder = () => {
    setOrderCompleted(false);
    setReceiptData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Menu
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>
          {!orderCompleted && cart.length > 0 && (
            <Badge variant="outline" className="bg-primary text-primary-foreground">
              {getTotalItems()} items
            </Badge>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {!orderCompleted ? (
          /* Before Order Completion */
          <>
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <Coffee className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Add items from the menu to get started</p>
                <Link to="/">
                  <Button>
                    Browse Menu
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <Card key={item.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-bold text-primary text-lg">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                  {/* Customer Details */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-4">Customer Details</h3>
                    <div className="space-y-3">
                      <Input
                        placeholder="Customer Name *"
                        value={customerDetails.name}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Phone Number *"
                        value={customerDetails.phone}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <Input
                        placeholder="Email (Optional)"
                        value={customerDetails.email}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </Card>

                  {/* Discount Coupons */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <Percent className="mr-2 h-4 w-4" />
                      Offer Codes
                    </h3>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <Button
                        variant={appliedDiscount === 5 ? "default" : "outline"}
                        size="sm"
                        onClick={() => applyDiscount(5)}
                        className="text-xs"
                      >
                        5% OFF
                      </Button>
                      <Button
                        variant={appliedDiscount === 10 ? "default" : "outline"}
                        size="sm"
                        onClick={() => applyDiscount(10)}
                        className="text-xs"
                      >
                        10% OFF
                      </Button>
                      <Button
                        variant={appliedDiscount === 15 ? "default" : "outline"}
                        size="sm"
                        onClick={() => applyDiscount(15)}
                        className="text-xs"
                      >
                        15% OFF
                      </Button>
                    </div>
                    {appliedDiscount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAppliedDiscount(0)}
                        className="w-full text-xs text-destructive"
                      >
                        Remove Discount
                      </Button>
                    )}
                  </Card>

                  {/* Order Total */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₹{Math.round(getTotalPrice())}</span>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({appliedDiscount}%):</span>
                          <span>-₹{Math.round(getTotalPrice() - getSubtotal())}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary">₹{Math.round(getFinalTotal())}</span>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-2 mt-6">
                      <Button 
                        className="w-full" 
                        onClick={() => processPayment('card')}
                        disabled={!customerDetails.name || !customerDetails.phone}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay with Card
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => processPayment('upi')}
                        disabled={!customerDetails.name || !customerDetails.phone}
                      >
                        <Smartphone className="mr-2 h-4 w-4" />
                        Pay with UPI
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => processPayment('cash')}
                        disabled={!customerDetails.name || !customerDetails.phone}
                      >
                        <Banknote className="mr-2 h-4 w-4" />
                        Pay with Cash
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </>
        ) : (
          /* After Order Completion */
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="p-6 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                Order Completed!
              </h2>
              <p className="text-green-600 dark:text-green-300">
                Your order has been processed successfully
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                Order ID: {receiptData?.id}
              </p>
            </div>

            {/* Receipt Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Receipt & Kitchen Options</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowUnifiedReceipt(true)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Receipt & KOT
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handlePrintReceipt(receiptData)}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Receipt & KOT
                </Button>
              </div>
            </Card>

            {/* New Order Button */}
            <div className="flex space-x-3">
              <Button onClick={startNewOrder} className="flex-1">
                Start New Order
              </Button>
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Menu
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Unified Receipt & KOT Popup */}
      <UnifiedReceiptPopup 
        isOpen={showUnifiedReceipt}
        onClose={() => setShowUnifiedReceipt(false)}
        receipt={receiptData}
      />
    </div>
  );
};

export default Cart;