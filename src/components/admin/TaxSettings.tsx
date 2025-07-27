import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Percent, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const TaxSettings = () => {
  const [taxRate, setTaxRate] = useState<number>(18);
  const { toast } = useToast();

  useEffect(() => {
    const savedTaxRate = localStorage.getItem('taxRate');
    if (savedTaxRate) {
      setTaxRate(parseFloat(savedTaxRate));
    }
  }, []);

  const handleSaveTaxRate = () => {
    localStorage.setItem('taxRate', taxRate.toString());
    // Trigger a custom event to notify other components about tax rate change
    window.dispatchEvent(new CustomEvent('taxRateChanged', { detail: taxRate }));
    toast({
      title: "Tax Rate Updated",
      description: `Tax rate set to ${taxRate}%`,
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
      <CardContent className="space-y-4">
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
        <Button onClick={handleSaveTaxRate} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Tax Rate
        </Button>
      </CardContent>
    </Card>
  );
};