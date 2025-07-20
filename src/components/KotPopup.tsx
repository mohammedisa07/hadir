import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User, X, Printer, ChefHat } from "lucide-react";
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

interface KotData {
  id: string;
  items: CartItem[];
  timestamp: Date;
  cashier: string;
  customerDetails: CustomerDetails;
}

interface KotPopupProps {
  isOpen: boolean;
  onClose: () => void;
  kotData: KotData | null;
}

export const KotPopup = ({
  isOpen,
  onClose,
  kotData
}: KotPopupProps) => {
  const { toast } = useToast();

  if (!kotData) return null;

  const handlePrint = () => {
    window.print();
    toast({
      title: "KOT sent to kitchen",
      description: "Kitchen Order Ticket has been sent to printer.",
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
            .kot-print-content, .kot-print-content * {
              visibility: visible;
            }
            .kot-print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              color: black !important;
              font-size: 14px;
              line-height: 1.4;
            }
            .no-print {
              display: none !important;
            }
            .kot-logo {
              width: 50px !important;
              height: 50px !important;
            }
            .kot-separator {
              border-top: 2px solid #000 !important;
              margin: 8px 0 !important;
            }
            .kot-header {
              text-align: center;
              margin-bottom: 16px;
            }
            .kot-title {
              font-size: 20px !important;
              font-weight: bold !important;
              margin: 8px 0 !important;
            }
            .kot-items table {
              width: 100% !important;
              border-collapse: collapse !important;
            }
            .kot-items th,
            .kot-items td {
              text-align: left !important;
              padding: 8px 4px !important;
              border-bottom: 1px solid #ddd !important;
              font-size: 16px !important;
            }
            .kot-priority {
              background: #ffeb3b !important;
              padding: 4px 8px !important;
              margin: 8px 0 !important;
              border: 2px solid #000 !important;
              text-align: center !important;
              font-weight: bold !important;
            }
          }
        `}
      </style>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader className="no-print">
            <DialogTitle className="text-center flex items-center justify-between">
              <div className="flex items-center">
                <ChefHat className="h-5 w-5 mr-2" />
                Kitchen Order Ticket
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="h-8 px-3"
                >
                  <Printer className="h-4 w-4 mr-1" />
                  Print KOT
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
          
          <div className="kot-print-content bg-white text-black">
            <Card className="kot-container border-0 shadow-none">
              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="kot-header text-center space-y-2">
                  <div className="flex justify-center mb-2">
                    <div className="kot-logo h-12 w-12 bg-white rounded-lg flex items-center justify-center p-1 border">
                      <img 
                        src="/lovable-uploads/ed8ea1fe-f3dd-493c-8d69-b86879fcac83.png" 
                        alt="Hadir's Cafe Logo" 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="kot-title text-xl font-bold tracking-wide">HADIR'S CAFE</h1>
                    <h2 className="text-lg font-bold text-orange-600">KITCHEN ORDER TICKET</h2>
                  </div>
                  <div className="kot-separator">
                    <Separator className="border-2 border-black" />
                  </div>
                </div>

                {/* Order Information */}
                <div className="space-y-2">
                  <div className="kot-priority bg-yellow-200 border-2 border-black p-2 text-center">
                    <p className="font-bold text-lg">ORDER #{kotData.id}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-semibold">Date:</span>
                        <span>{kotData.timestamp.toLocaleDateString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Time:</span>
                        <span>{kotData.timestamp.toLocaleTimeString('en-IN', { hour12: true })}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-semibold">Cashier:</span>
                        <span>{kotData.cashier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Customer:</span>
                        <span>{kotData.customerDetails.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="kot-separator">
                    <Separator className="border-dashed border-2" />
                  </div>

                  {/* Items for Kitchen */}
                  <div className="kot-items">
                    <h3 className="font-bold text-lg mb-3 text-center bg-gray-100 p-2">ITEMS TO PREPARE</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-black">
                          <th className="text-left py-2 font-bold">Item Name</th>
                          <th className="text-center py-2 font-bold w-16">Qty</th>
                          <th className="text-left py-2 font-bold">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kotData.items.map((item, index) => (
                          <tr key={item.id} className="border-b border-gray-300">
                            <td className="py-3 font-semibold text-base">{item.name}</td>
                            <td className="py-3 text-center text-xl font-bold">{item.quantity}</td>
                            <td className="py-3 text-sm">-</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="kot-separator">
                    <Separator className="border-2 border-black" />
                  </div>

                  {/* Kitchen Instructions */}
                  <div className="space-y-2">
                    <div className="bg-red-100 border-2 border-red-500 p-3 text-center">
                      <p className="font-bold text-lg">TOTAL ITEMS: {kotData.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    </div>
                    
                    <div className="text-center space-y-1 text-sm">
                      <p className="font-semibold">Customer Phone: {kotData.customerDetails.phone}</p>
                      <p className="text-xs text-muted-foreground">
                        Time: {kotData.timestamp.toLocaleTimeString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center space-y-1 mt-4">
                    <div className="kot-separator">
                      <Separator className="border-dashed" />
                    </div>
                    <p className="text-sm font-bold">*** KITCHEN COPY ***</p>
                    <p className="text-xs">Please prepare items as per order</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};