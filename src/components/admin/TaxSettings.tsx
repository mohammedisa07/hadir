import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Percent, Save, Receipt } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const TaxSettings = () => {
  const [taxRate, setTaxRate] = useState<number>(18);
  const [gstEnabled, setGstEnabled] = useState<boolean>(true);
  const [cgstRate, setCgstRate] = useState<number>(9);
  const [sgstRate, setSgstRate] = useState<number>(9);
  const [igstRate, setIgstRate] = useState<number>(18);
  const [taxType, setTaxType] = useState<'simple' | 'gst'>('gst');
  const { toast } = useToast();

  useEffect(() => {
    const savedTaxRate = localStorage.getItem('taxRate');
    const savedGstEnabled = localStorage.getItem('gstEnabled');
    const savedCgstRate = localStorage.getItem('cgstRate');
    const savedSgstRate = localStorage.getItem('sgstRate');
    const savedIgstRate = localStorage.getItem('igstRate');
    const savedTaxType = localStorage.getItem('taxType');

    if (savedTaxRate) {
      setTaxRate(parseFloat(savedTaxRate));
    }
    if (savedGstEnabled) {
      setGstEnabled(savedGstEnabled === 'true');
    }
    if (savedCgstRate) {
      setCgstRate(parseFloat(savedCgstRate));
    }
    if (savedSgstRate) {
      setSgstRate(parseFloat(savedSgstRate));
    }
    if (savedIgstRate) {
      setIgstRate(parseFloat(savedIgstRate));
    }
    if (savedTaxType) {
      setTaxType(savedTaxType as 'simple' | 'gst');
    }
  }, []);

  const handleSaveTaxRate = () => {
    localStorage.setItem('taxRate', taxRate.toString());
    localStorage.setItem('gstEnabled', gstEnabled.toString());
    localStorage.setItem('cgstRate', cgstRate.toString());
    localStorage.setItem('sgstRate', sgstRate.toString());
    localStorage.setItem('igstRate', igstRate.toString());
    localStorage.setItem('taxType', taxType);
    
    // Trigger a custom event to notify other components about tax rate change
    window.dispatchEvent(new CustomEvent('taxRateChanged', { 
      detail: { taxRate, gstEnabled, cgstRate, sgstRate, igstRate, taxType } 
    }));
    
    toast({
      title: "Tax Configuration Updated",
      description: `Tax settings saved successfully`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Percent className="h-5 w-5 text-primary" />
          <span>Tax Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tax Type Selection */}
        <div className="space-y-2">
          <Label>Tax Type</Label>
          <Select value={taxType} onValueChange={(value: 'simple' | 'gst') => setTaxType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select tax type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple Tax</SelectItem>
              <SelectItem value="gst">GST (CGST + SGST)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {taxType === 'simple' ? (
          /* Simple Tax Configuration */
          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.1"
              placeholder="Enter tax rate"
            />
          </div>
        ) : (
          /* GST Configuration */
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="gstEnabled"
                checked={gstEnabled}
                onCheckedChange={setGstEnabled}
              />
              <Label htmlFor="gstEnabled">Enable GST</Label>
            </div>
            
            {gstEnabled && (
              <>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cgstRate">CGST Rate (%)</Label>
                    <Input
                      id="cgstRate"
                      type="number"
                      value={cgstRate}
                      onChange={(e) => setCgstRate(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="50"
                      step="0.1"
                      placeholder="CGST rate"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sgstRate">SGST Rate (%)</Label>
                    <Input
                      id="sgstRate"
                      type="number"
                      value={sgstRate}
                      onChange={(e) => setSgstRate(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="50"
                      step="0.1"
                      placeholder="SGST rate"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="igstRate">IGST Rate (%) - For Inter-state</Label>
                  <Input
                    id="igstRate"
                    type="number"
                    value={igstRate}
                    onChange={(e) => setIgstRate(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="IGST rate"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>• CGST + SGST = {cgstRate + sgstRate}% (Same state)</p>
                  <p>• IGST = {igstRate}% (Inter-state)</p>
                </div>
              </>
            )}
          </div>
        )}

        <Button onClick={handleSaveTaxRate} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Tax Configuration
        </Button>
      </CardContent>
    </Card>
  );
};