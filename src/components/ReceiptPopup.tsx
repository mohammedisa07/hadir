
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, X, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
}

interface Receipt {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi';
  timestamp: Date;
  cashier: string;
  subtotal: number;
  tax: number;
  finalTotal: number;
  discount?: number;
  taxRate?: number;
  customerDetails: CustomerDetails;
}

interface ReceiptPopupProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: Receipt | null;
}

export const ReceiptPopup = ({
  isOpen,
  onClose,
  receipt
}: ReceiptPopupProps) => {
  const { toast } = useToast();

  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
    toast({
      title: "Receipt sent to printer",
      description: "The receipt has been sent to your default printer.",
    });
  };

  const handlePrintKOT = (receipt: Receipt) => {
    // This function would typically trigger a print of the KOT (Kitchen Order Ticket)
    // For now, we'll just show a toast.
    toast({
      title: "KOT sent to printer",
      description: "The Kitchen Order Ticket has been sent to your default printer.",
    });
  };

  return (
    <>
      {/* Print styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-content, .print-content * {
              visibility: visible;
            }
            .print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              color: #000000 !important;
              font-size: 14px;
              line-height: 1.4;
              font-family: 'Arial', sans-serif !important;
              font-weight: bold !important;
              letter-spacing: 1px !important;
              text-shadow: none !important;
              -webkit-font-smoothing: none !important;
              -moz-osx-font-smoothing: none !important;
              font-smooth: never !important;
            }
            .no-print {
              display: none !important;
            }
            .print-logo {
              width: 80px !important;
              height: 80px !important;
              margin: 0 auto 10px auto !important;
              display: block !important;
            }
            .print-logo img {
              width: 100% !important;
              height: 100% !important;
              object-fit: contain !important;
              border: 2px solid #000000 !important;
              padding: 4px !important;
              background: white !important;
            }
            .print-separator {
              border-top: 1px dashed #000 !important;
              margin: 8px 0 !important;
            }
            .print-header {
              text-align: center;
              margin-bottom: 16px;
            }
            .print-title {
              font-size: 22px !important;
              font-weight: bold !important;
              margin: 8px 0 !important;
              font-family: 'Arial', sans-serif !important;
              letter-spacing: 2px !important;
              color: #000000 !important;
              -webkit-font-smoothing: none !important;
              -moz-osx-font-smoothing: none !important;
            }
            .print-address {
              font-size: 12px !important;
              margin: 2px 0 !important;
              font-family: 'Arial', sans-serif !important;
              letter-spacing: 1px !important;
              font-weight: bold !important;
              color: #000000 !important;
              -webkit-font-smoothing: none !important;
              -moz-osx-font-smoothing: none !important;
            }
            .print-items table {
              width: 100% !important;
              border-collapse: collapse !important;
              font-family: 'Arial', sans-serif !important;
              letter-spacing: 1px !important;
              font-weight: bold !important;
              color: #000000 !important;
              -webkit-font-smoothing: none !important;
              -moz-osx-font-smoothing: none !important;
              font-size: 14px !important;
            }
            .print-items th,
            .print-items td {
              text-align: left !important;
              padding: 4px 2px !important;
              border-bottom: 1px solid #ddd !important;
              font-family: 'Arial', sans-serif !important;
              letter-spacing: 1px !important;
              font-weight: bold !important;
              color: #000000 !important;
              -webkit-font-smoothing: none !important;
              -moz-osx-font-smoothing: none !important;
              font-size: 14px !important;
            }
            .print-total {
              border-top: 2px solid #000 !important;
              padding-top: 8px !important;
              margin-top: 8px !important;
              font-family: 'Arial', sans-serif !important;
              letter-spacing: 1px !important;
              font-weight: bold !important;
              color: #000000 !important;
              -webkit-font-smoothing: none !important;
              -moz-osx-font-smoothing: none !important;
              font-size: 16px !important;
            }
            .receipt-section { page-break-after: always !important; }
            .kot-section { page-break-before: always !important; page-break-inside: avoid !important; }
          }
        `}
      </style>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader className="no-print">
            <DialogTitle className="text-center flex items-center justify-between">
              Receipt
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="h-8 px-3"
                >
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="print-content bg-white text-black">
            <Card className="receipt-container border-0 shadow-none">
              <CardContent className="p-4 space-y-3 text-black">
                {/* Header with Logo */}
                <div className="print-header text-center space-y-1">
                  <div className="flex justify-center mb-1">
                    <img 
                      src="/logo.jpg" 
                      alt="Hadir's Cafe Logo" 
                      className="h-28 w-28 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="print-title text-xl font-bold tracking-wide text-black">HADIR'S CAFE</h1>
                    <p className="text-xs text-gray-600">"Love at First Sip"</p>
                  </div>
                  <div className="space-y-0.5 text-xs font-bold text-black">
                    <p>No.8/117, Sudha Residency, Metro Nagar 4th Avenue</p>
                    <p>Alapakkam, Chennai, Tamil Nadu 600116</p>
                    <p>Phone: +91 99418 39385</p>
                  </div>
                  <div className="print-separator py-2">
                    <Separator className="border-dashed" />
                  </div>
                </div>

                {/* Bill Information */}
                <div className="space-y-2">
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-black">RECEIPT</h3>
                  </div>
                  
                  <div className="space-y-1 text-xs text-black">
                    <div className="flex justify-between">
                      <span>Receipt #:</span>
                      <span className="font-mono">{receipt.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{receipt.timestamp.toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{receipt.timestamp.toLocaleTimeString('en-IN', { hour12: true })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cashier:</span>
                      <span>{receipt.cashier}</span>
                    </div>
                  </div>

                  <div className="print-separator">
                    <Separator className="border-dashed" />
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-1">
                    <h4 className="font-semibold text-xs border-b pb-1 text-black">CUSTOMER DETAILS</h4>
                    <div className="space-y-0.5 text-xs text-black">
                      <div className="flex justify-between">
                        <span>Name:</span>
                        <span className="font-medium">{receipt.customerDetails.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="font-medium">{receipt.customerDetails.phone}</span>
                      </div>
                      {receipt.customerDetails.email && (
                        <div className="flex justify-between">
                          <span>Email:</span>
                          <span className="font-medium">{receipt.customerDetails.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="print-separator">
                    <Separator className="border-dashed" />
                  </div>

                  {/* Items Table */}
                  <div className="print-items">
                    <h4 className="font-semibold text-xs mb-2 border-b pb-1 text-black">ORDER DETAILS</h4>
                    <table className="w-full text-xs text-black">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-1 font-semibold">Item</th>
                          <th className="text-center py-1 font-semibold w-12">Qty</th>
                          <th className="text-right py-1 font-semibold w-16">Rate</th>
                          <th className="text-right py-1 font-semibold w-16">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receipt.items.map((item, index) => (
                          <tr key={item.id} className={index < receipt.items.length - 1 ? "border-b border-dashed border-gray-300" : ""}>
                            <td className="py-1 font-medium">{item.name}</td>
                            <td className="py-1 text-center">{item.quantity}</td>
                            <td className="py-1 text-right">₹{item.price}</td>
                            <td className="py-1 text-right font-semibold">₹{(item.quantity * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="print-separator">
                    <Separator className="border-dashed" />
                  </div>

                  {/* Totals */}
                  <div className="space-y-1 text-black">
                    <div className="flex justify-between text-xs">
                      <span>Subtotal:</span>
                      <span>₹{Math.round(receipt.total).toFixed(2)}</span>
                    </div>
                    
                    {receipt.discount && receipt.discount > 0 && (
                      <div className="flex justify-between text-xs text-green-600">
                        <span>Discount ({receipt.discount}%):</span>
                        <span>-₹{Math.round(receipt.total - receipt.subtotal).toFixed(2)}</span>
                      </div>
                    )}
                    
                    {receipt.discount && receipt.discount > 0 && (
                      <div className="flex justify-between text-xs">
                        <span>After Discount:</span>
                        <span>₹{Math.round(receipt.subtotal).toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="print-total border-t border-black pt-1 mt-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>TOTAL AMOUNT:</span>
                        <span>₹{Math.round(receipt.finalTotal).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs mt-1 pt-1 border-t border-dashed">
                      <span>Payment Method:</span>
                      <span className="uppercase font-semibold">{receipt.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="print-separator">
                    <Separator className="border-dashed" />
                  </div>

                  {/* Footer */}
                  <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-black">Thank you for visiting Hadir's Cafe!</p>
                    <p className="text-xs text-gray-600">We hope to see you again soon</p>
                    <p className="text-xs text-gray-600">
                      For any queries, call: +91 99418 39385
                    </p>
                    <div className="text-xs text-gray-600 space-y-0.5 mt-2">
                      <p>Follow us on social media @hadirscafe</p>
                      <p>★ Rate us on Google & Zomato ★</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handlePrint}
              className="flex-1"
              variant="default"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
            <Button
              onClick={() => handlePrintKOT(receipt)}
              className="flex-1"
              variant="outline"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print KOT
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
