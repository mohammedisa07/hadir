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
import { useCart } from "@/hooks/useCart";
import { UnifiedReceiptPopup } from "@/components/UnifiedReceiptPopup";
import { PasswordDialog } from "@/components/PasswordDialog";
import { Link, useNavigate } from "react-router-dom";
// REMOVE: import { placeOrder } from '../lib/api';

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
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [pendingDiscount, setPendingDiscount] = useState(0);
  const [, forceUpdate] = useState({});
  
  const { toast } = useToast();
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  // Listen for tax rate changes
  useEffect(() => {
    const handleTaxRateChange = () => {
      forceUpdate({});
    };
    
    window.addEventListener('taxRateChanged', handleTaxRateChange);
    return () => {
      window.removeEventListener('taxRateChanged', handleTaxRateChange);
    };
  }, []);

  const applyDiscount = (discount: number) => {
    // Check if user is in cashier mode (not admin)
    const userRole = localStorage.getItem('userRole') || 'cashier';
    
    if (userRole === 'cashier') {
      // In cashier mode, require admin password for discounts
      setPendingDiscount(discount);
      setShowPasswordDialog(true);
    } else {
      // In admin mode, apply discount directly
      setAppliedDiscount(discount);
      toast({
        title: `${discount}% discount applied`,
        description: "Discount has been applied to the order",
      });
    }
  };

  const handlePasswordSuccess = () => {
    setAppliedDiscount(pendingDiscount);
    toast({
      title: `${pendingDiscount}% discount applied`,
      description: "Discount has been applied to the order",
    });
    setShowPasswordDialog(false);
    setPendingDiscount(0);
  };

  const calculateDiscountedPrice = (price: number) => {
    return price * (1 - appliedDiscount / 100);
  };

  const getSubtotal = () => {
    const baseTotal = getTotalPrice();
    return calculateDiscountedPrice(baseTotal);
  };

  const getTaxConfig = () => {
    const taxType = localStorage.getItem('taxType') || 'gst';
    const gstEnabled = localStorage.getItem('gstEnabled') === 'true';
    const cgstRate = parseFloat(localStorage.getItem('cgstRate') || '9');
    const sgstRate = parseFloat(localStorage.getItem('sgstRate') || '9');
    const igstRate = parseFloat(localStorage.getItem('igstRate') || '18');
    const simpleTaxRate = parseFloat(localStorage.getItem('taxRate') || '18');
    
    return { taxType, gstEnabled, cgstRate, sgstRate, igstRate, simpleTaxRate };
  };

  const getFinalTotal = () => {
    const subtotal = getSubtotal();
    const { taxType, gstEnabled, cgstRate, sgstRate, igstRate, simpleTaxRate } = getTaxConfig();
    
    if (taxType === 'simple') {
      const tax = subtotal * (simpleTaxRate / 100);
      return subtotal + tax;
    } else if (taxType === 'gst' && gstEnabled) {
      // For now, using CGST + SGST (same state)
      const totalGstRate = cgstRate + sgstRate;
      const tax = subtotal * (totalGstRate / 100);
      return subtotal + tax;
    }
    
    return subtotal; // No tax
  };

  const getTaxAmount = () => {
    const subtotal = getSubtotal();
    const { taxType, gstEnabled, cgstRate, sgstRate, igstRate, simpleTaxRate } = getTaxConfig();
    
    if (taxType === 'simple') {
      return subtotal * (simpleTaxRate / 100);
    } else if (taxType === 'gst' && gstEnabled) {
      const totalGstRate = cgstRate + sgstRate;
      return subtotal * (totalGstRate / 100);
    }
    
    return 0;
  };

  const getTaxBreakdown = () => {
    const subtotal = getSubtotal();
    const { taxType, gstEnabled, cgstRate, sgstRate, igstRate, simpleTaxRate } = getTaxConfig();
    
    if (taxType === 'simple') {
      return {
        type: 'Simple Tax',
        rate: simpleTaxRate,
        amount: subtotal * (simpleTaxRate / 100),
        breakdown: null
      };
    } else if (taxType === 'gst' && gstEnabled) {
      const cgstAmount = subtotal * (cgstRate / 100);
      const sgstAmount = subtotal * (sgstRate / 100);
      const totalGstAmount = cgstAmount + sgstAmount;
      
      return {
        type: 'GST',
        rate: cgstRate + sgstRate,
        amount: totalGstAmount,
        breakdown: {
          cgst: { rate: cgstRate, amount: cgstAmount },
          sgst: { rate: sgstRate, amount: sgstAmount }
        }
      };
    }
    
    return {
      type: 'No Tax',
      rate: 0,
      amount: 0,
      breakdown: null
    };
  };

  const handlePrintReceipt = (receiptData: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error("Could not open print window");
      return;
    }

    // --- Customer Receipt ---
    const customerReceipt = `
      <div class="receipt-container receipt-section">
        <div class="header">
          <div class="print-logo" style="display: flex; justify-content: center; margin-bottom: 8px;">
            <img src="/lovable-uploads/ed8ea1fe-f3dd-493c-8d69-b86879fcac83.png" alt="Hadir's Cafe Logo" style="height: 40px; width: 40px; object-fit: contain;" />
          </div>
          <div class="cafe-name">HADIR'S CAFE</div>
          <div class="tagline">Love at First Sip</div>
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
            <span>₹${Math.round(receiptData.subtotal)}</span>
          </div>
          ${receiptData.discount && receiptData.discount > 0 ? `
            <div class="total-row" style="color: green;">
              <span>Discount (${receiptData.discount}%):</span>
              <span>-₹${Math.round(receiptData.total - receiptData.subtotal)}</span>
            </div>
          ` : ''}
          <div class="total-row">
            <span>Tax (${receiptData.taxType === 'gst' ? 'GST' : 'Tax'} ${receiptData.taxRate}%):</span>
            <span>₹${Math.round(receiptData.tax)}</span>
          </div>
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
    `;

    // --- KOT (Kitchen Order Ticket) ---
    const kot = `
      <div class="receipt-container kot-section">
        <div class="header">
          <div class="print-logo" style="display: flex; justify-content: center; margin-bottom: 8px;">
            <img src="/lovable-uploads/ed8ea1fe-f3dd-493c-8d69-b86879fcac83.png" alt="Hadir's Cafe Logo" style="height: 40px; width: 40px; object-fit: contain;" />
          </div>
          <div class="cafe-name">HADIR'S CAFE - KOT</div>
        </div>
        <div class="separator"></div>
        <div class="receipt-details">
          <div class="detail-row">
            <span>Order #:</span>
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
            <span>Customer:</span>
            <span>${receiptData.customerDetails.name}</span>
          </div>
        </div>
        <div class="separator"></div>
        <div class="items-section">
          <div><strong>Order Items</strong></div>
          ${receiptData.items.map(item => `
            <div class="item">
              <div class="detail-row">
                <span class="item-name">${item.name}</span>
                <span>Qty: ${item.quantity}</span>
              </div>
              ${item.notes ? `<div class="item-details">Notes: ${item.notes}</div>` : ''}
            </div>
          `).join('')}
        </div>
        <div class="separator"></div>
        <div class="footer">
          <div>KOT generated for kitchen use only</div>
        </div>
      </div>
    `;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt & KOT - ${receiptData.id}</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
              font-size: 13px;
              line-height: 1.4;
            }
            .receipt-container {
              width: 58mm;
              max-width: 58mm;
              margin: 0 auto 16px auto;
              background: white;
              padding: 0 4px;
            }
            .header { text-align: center; margin-bottom: 10px; }
            .cafe-name { font-size: 15px; font-weight: bold; margin-bottom: 2px; }
            .tagline { font-style: italic; color: #666; margin-bottom: 4px; font-size: 11px; }
            .address { font-size: 9px; color: #666; margin-bottom: 8px; }
            .separator { border-top: 1px dashed #666; margin: 8px 0; }
            .receipt-details { margin-bottom: 8px; font-size: 11px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
            .customer-section { margin-bottom: 8px; font-size: 11px; }
            .items-section { margin-bottom: 8px; }
            .item { margin-bottom: 6px; }
            .item-name { font-weight: 600; font-size: 12px; }
            .item-details { font-size: 10px; color: #666; padding-left: 8px; }
            .totals { margin-bottom: 8px; font-size: 12px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
            .final-total { font-weight: bold; font-size: 13px; border-top: 1px solid #333; padding-top: 3px; }
            .footer { text-align: center; color: #666; font-size: 10px; margin-top: 10px; }
            .receipt-section { page-break-after: always; }
            .kot-section { page-break-before: always; }
            .print-logo img { display: block; margin: 0 auto; }
          </style>
        </head>
        <body>
          ${customerReceipt}
          ${kot}
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
    const taxBreakdown = getTaxBreakdown();
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
      tax: taxBreakdown.amount,
      taxRate: taxBreakdown.rate,
      taxType: taxBreakdown.type
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
    navigate('/');
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Order Items</h2>
                    <Link to="/">
                      <Button variant="outline" size="sm" className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Add More Items</span>
                      </Button>
                    </Link>
                  </div>
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
                        <span>₹{Math.round(getSubtotal())}</span>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({appliedDiscount}%):</span>
                          <span>-₹{Math.round(getTotalPrice() - getSubtotal())}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Tax ({getTaxBreakdown().rate}%):</span>
                        <span>₹{Math.round(getTaxAmount())}</span>
                      </div>
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

      {/* Password Dialog */}
      <PasswordDialog 
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSuccess={handlePasswordSuccess}
        title="Admin Authorization Required"
        description={`Please enter the admin password to apply ${pendingDiscount}% discount.`}
      />
    </div>
  );
};

export default Cart;