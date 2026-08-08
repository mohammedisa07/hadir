import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Receipt,
  Plus,
  Trash2,
  Copy,
  Check,
  Pencil,
  Eye,
  FileText,
  Settings,
  Type,
  MapPin,
  MessageSquare,
  ToggleLeft,
  Palette,
  X,
  Star,
} from 'lucide-react';
import { useReceiptTemplates, ReceiptTemplate } from '@/hooks/useReceiptTemplates';
import { useToast } from '@/hooks/use-toast';

// ─── Live Preview Component ────────────────────────────────────
function ReceiptPreview({ template }: { template: ReceiptTemplate }) {
  const fontSizeMap = {
    small: { title: 'text-sm', body: 'text-[10px]', total: 'text-xs' },
    medium: { title: 'text-lg', body: 'text-xs', total: 'text-sm' },
    large: { title: 'text-xl', body: 'text-sm', total: 'text-base' },
  };
  const fs = fontSizeMap[template.fontSize];

  const sampleItems = [
    { name: 'Cappuccino', qty: 2, price: 100 },
    { name: 'Latte', qty: 1, price: 120 },
    { name: 'Croissant', qty: 3, price: 80 },
  ];
  const subtotal = sampleItems.reduce((s, i) => s + i.qty * i.price, 0);
  const total = subtotal;

  return (
    <div className="bg-white text-black rounded-lg shadow-inner p-4 max-w-[300px] mx-auto font-mono border border-dashed border-gray-300">
      {/* Header */}
      <div className="text-center space-y-1 mb-2">
        {template.showLogo && template.logo && (
          <div className="flex justify-center mb-1">
            <img
              src={template.logo}
              alt="Logo"
              className="h-14 w-14 object-contain"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        )}
        <h2 className={`font-bold ${fs.title} ${template.headerStyle === 'modern' ? 'tracking-widest uppercase' : template.headerStyle === 'minimal' ? 'tracking-tight' : 'tracking-wide'}`}>
          {template.shopName}
        </h2>
        {template.showTagline && template.tagline && (
          <p className={`${fs.body} text-gray-500 italic`}>{template.tagline}</p>
        )}
        {template.showAddress && (
          <div className={`${fs.body} text-gray-600 space-y-0.5`}>
            {template.addressLine1 && <p>{template.addressLine1}</p>}
            {template.addressLine2 && <p>{template.addressLine2}</p>}
            {template.phone && <p>Phone: {template.phone}</p>}
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-gray-400 my-1.5" />

      {/* Receipt Info */}
      <div className="text-center mb-1">
        <span className={`${fs.body} font-semibold`}>RECEIPT</span>
      </div>
      <div className={`${fs.body} text-gray-700 space-y-0.5 mb-1`}>
        <div className="flex justify-between">
          <span>Receipt #:</span>
          <span className="font-mono">HC-0042</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{new Date().toLocaleDateString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{new Date().toLocaleTimeString('en-IN', { hour12: true })}</span>
        </div>
        {template.showCashier && (
          <div className="flex justify-between">
            <span>Cashier:</span>
            <span>Admin</span>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-gray-400 my-1.5" />

      {/* Customer */}
      {template.showCustomerDetails && (
        <>
          <div className={`${fs.body} mb-1`}>
            <p className="font-semibold border-b border-gray-300 pb-0.5 mb-0.5">CUSTOMER DETAILS</p>
            <div className="flex justify-between">
              <span>Name:</span>
              <span>John Doe</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>+91 98765 43210</span>
            </div>
          </div>
          <div className="border-t border-dashed border-gray-400 my-1.5" />
        </>
      )}

      {/* Items */}
      <div className={`${fs.body} mb-1`}>
        <p className="font-semibold border-b border-gray-300 pb-0.5 mb-1">ORDER DETAILS</p>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-0.5 font-semibold">Item</th>
              <th className="text-center py-0.5 font-semibold w-8">Qty</th>
              <th className="text-right py-0.5 font-semibold w-12">Rate</th>
              <th className="text-right py-0.5 font-semibold w-14">Amt</th>
            </tr>
          </thead>
          <tbody>
            {sampleItems.map((item, i) => (
              <tr key={i} className={i < sampleItems.length - 1 ? 'border-b border-dashed border-gray-200' : ''}>
                <td className="py-0.5">{item.name}</td>
                <td className="py-0.5 text-center">{item.qty}</td>
                <td className="py-0.5 text-right">₹{item.price}</td>
                <td className="py-0.5 text-right font-semibold">₹{(item.qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-dashed border-gray-400 my-1.5" />

      {/* Totals */}
      <div className={`${fs.body} space-y-0.5`}>
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="border-t border-black pt-0.5 mt-1">
          <div className={`flex justify-between ${fs.total} font-bold`}>
            <span>TOTAL AMOUNT:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between pt-0.5 border-t border-dashed border-gray-400 mt-0.5">
          <span>Payment:</span>
          <span className="uppercase font-semibold">CASH</span>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 my-1.5" />

      {/* Footer */}
      {template.showFooter && (
        <div className={`text-center ${fs.body} space-y-0.5`}>
          {template.footerMessage && <p className="font-bold">{template.footerMessage}</p>}
          {template.footerSubMessage && <p className="text-gray-500">{template.footerSubMessage}</p>}
          {template.phone && <p className="text-gray-500">For any queries, call: {template.phone}</p>}
          {template.showSocialMedia && (
            <div className="space-y-0.5 mt-1">
              {template.socialMedia && <p className="text-gray-500">{template.socialMedia}</p>}
              {template.socialRating && <p className="text-gray-500">{template.socialRating}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Template Editor Dialog ────────────────────────────────────
function TemplateEditorDialog({
  template,
  isOpen,
  onClose,
  onSave,
}: {
  template: ReceiptTemplate;
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: ReceiptTemplate) => void;
}) {
  const [draft, setDraft] = useState<ReceiptTemplate>({ ...template });

  const update = <K extends keyof ReceiptTemplate>(key: K, value: ReceiptTemplate[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Pencil className="h-5 w-5 text-primary" />
            Edit Template: {draft.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-0 h-[calc(90vh-120px)]">
          {/* Editor Panel */}
          <ScrollArea className="flex-1 border-r">
            <div className="p-6 space-y-6">
              {/* Template Name */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Template Name
                </Label>
                <Input
                  value={draft.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Template name"
                />
              </div>

              <Separator />

              {/* ─── Header Settings ─── */}
              <Tabs defaultValue="header" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-auto">
                  <TabsTrigger value="header" className="text-xs py-2">
                    <Type className="h-3.5 w-3.5 mr-1" />
                    Header
                  </TabsTrigger>
                  <TabsTrigger value="address" className="text-xs py-2">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    Address
                  </TabsTrigger>
                  <TabsTrigger value="footer" className="text-xs py-2">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Footer
                  </TabsTrigger>
                  <TabsTrigger value="style" className="text-xs py-2">
                    <Palette className="h-3.5 w-3.5 mr-1" />
                    Style
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="header" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Shop Name</Label>
                    <Input value={draft.shopName} onChange={(e) => update('shopName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input value={draft.tagline} onChange={(e) => update('tagline', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo URL / Path</Label>
                    <Input value={draft.logo} onChange={(e) => update('logo', e.target.value)} placeholder="/logo.jpg or https://..." />
                  </div>
                </TabsContent>

                <TabsContent value="address" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Address Line 1</Label>
                    <Input value={draft.addressLine1} onChange={(e) => update('addressLine1', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Address Line 2</Label>
                    <Input value={draft.addressLine2} onChange={(e) => update('addressLine2', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={draft.phone} onChange={(e) => update('phone', e.target.value)} />
                  </div>
                </TabsContent>

                <TabsContent value="footer" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Thank You Message</Label>
                    <Input value={draft.footerMessage} onChange={(e) => update('footerMessage', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Sub Message</Label>
                    <Input value={draft.footerSubMessage} onChange={(e) => update('footerSubMessage', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Social Media</Label>
                    <Input value={draft.socialMedia} onChange={(e) => update('socialMedia', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating Text</Label>
                    <Input value={draft.socialRating} onChange={(e) => update('socialRating', e.target.value)} />
                  </div>
                </TabsContent>

                <TabsContent value="style" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select
                      value={draft.fontSize}
                      onValueChange={(v) => update('fontSize', v as ReceiptTemplate['fontSize'])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (Compact)</SelectItem>
                        <SelectItem value="medium">Medium (Standard)</SelectItem>
                        <SelectItem value="large">Large (Readable)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Header Style</Label>
                    <Select
                      value={draft.headerStyle}
                      onValueChange={(v) => update('headerStyle', v as ReceiptTemplate['headerStyle'])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="modern">Modern (Wide Tracking)</SelectItem>
                        <SelectItem value="minimal">Minimal (Tight)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator />

              {/* ─── Section Visibility Toggles ─── */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <ToggleLeft className="h-4 w-4" />
                  Section Visibility
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { key: 'showLogo' as const, label: 'Shop Logo' },
                    { key: 'showTagline' as const, label: 'Tagline' },
                    { key: 'showAddress' as const, label: 'Address & Phone' },
                    { key: 'showCustomerDetails' as const, label: 'Customer Details' },
                    { key: 'showCashier' as const, label: 'Cashier Name' },
                    { key: 'showFooter' as const, label: 'Footer Message' },
                    { key: 'showSocialMedia' as const, label: 'Social Media & Rating' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between rounded-lg border p-3 bg-card/50">
                      <span className="text-sm">{label}</span>
                      <Switch
                        checked={draft[key]}
                        onCheckedChange={(v) => update(key, v)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Preview Panel */}
          <div className="w-full lg:w-[340px] bg-muted/30 flex flex-col">
            <div className="p-4 border-b flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Live Preview</span>
            </div>
            <ScrollArea className="flex-1 p-4">
              <ReceiptPreview template={draft} />
            </ScrollArea>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" />
            Save Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Receipt Template Editor ──────────────────────────────
export const ReceiptTemplateEditor = () => {
  const { toast } = useToast();
  const {
    templates,
    activeId,
    setActiveTemplate,
    saveTemplate,
    deleteTemplate,
    duplicateTemplate,
    createBlankTemplate,
  } = useReceiptTemplates();

  const [editingTemplate, setEditingTemplate] = useState<ReceiptTemplate | null>(null);
  const [showPreview, setShowPreview] = useState<ReceiptTemplate | null>(null);

  const handleCreate = () => {
    const blank = createBlankTemplate();
    setEditingTemplate(blank);
    toast({ title: 'New Template Created', description: 'Customize your new receipt template.' });
  };

  const handleDuplicate = (id: string) => {
    const dup = duplicateTemplate(id);
    if (dup) {
      toast({ title: 'Template Duplicated', description: `Created "${dup.name}"` });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const success = deleteTemplate(id);
      if (success) {
        toast({ title: 'Template Deleted', description: 'The template has been removed.', variant: 'destructive' });
      } else {
        toast({ title: 'Cannot Delete', description: 'Built-in templates cannot be deleted.', variant: 'destructive' });
      }
    }
  };

  const handleSetActive = (id: string) => {
    setActiveTemplate(id);
    const tpl = templates.find((t) => t.id === id);
    toast({ title: 'Template Activated', description: `"${tpl?.name}" will be used for receipts.` });
  };

  const handleSave = (template: ReceiptTemplate) => {
    saveTemplate(template);
    toast({ title: 'Template Saved', description: `"${template.name}" has been updated.` });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <span>Receipt Templates</span>
            </div>
            <Button size="sm" onClick={handleCreate} className="gap-1.5">
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {templates.map((tpl) => {
              const isActive = tpl.id === activeId;
              return (
                <Card
                  key={tpl.id}
                  className={`relative transition-all duration-200 hover:shadow-md ${
                    isActive ? 'ring-2 ring-primary shadow-lg bg-primary/5' : 'hover:bg-muted/30'
                  }`}
                >
                  <CardContent className="p-4">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{tpl.name}</h3>
                          {isActive && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0 h-5">
                              <Check className="h-3 w-3 mr-0.5" />
                              Active
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {tpl.headerStyle}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {tpl.fontSize}
                          </Badge>
                          {tpl.isBuiltIn && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              <Star className="h-2.5 w-2.5 mr-0.5" />
                              Built-in
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mini preview */}
                    <div className="bg-white text-black rounded border border-dashed border-gray-300 p-2 mb-3 text-[9px] font-mono text-center space-y-0.5">
                      {tpl.showLogo && <div className="text-gray-400">[Logo]</div>}
                      <div className="font-bold text-[10px]">{tpl.shopName}</div>
                      {tpl.showTagline && <div className="text-gray-400 italic">{tpl.tagline}</div>}
                      {tpl.showAddress && <div className="text-gray-400 truncate">{tpl.addressLine1}</div>}
                      <div className="border-t border-dashed border-gray-300 mt-1 pt-1 text-gray-400">
                        ─── items ───
                      </div>
                      {tpl.showFooter && <div className="text-gray-400 truncate">{tpl.footerMessage}</div>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 flex-wrap">
                      {!isActive && (
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 text-xs gap-1 flex-1"
                          onClick={() => handleSetActive(tpl.id)}
                        >
                          <Check className="h-3 w-3" />
                          Set Active
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1"
                        onClick={() => setShowPreview(tpl)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1"
                        onClick={() => setEditingTemplate({ ...tpl })}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1"
                        onClick={() => handleDuplicate(tpl.id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      {!tpl.isBuiltIn && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 text-xs gap-1"
                          onClick={() => handleDelete(tpl.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Editor Dialog */}
      {editingTemplate && (
        <TemplateEditorDialog
          template={editingTemplate}
          isOpen={!!editingTemplate}
          onClose={() => setEditingTemplate(null)}
          onSave={handleSave}
        />
      )}

      {/* Preview Dialog */}
      {showPreview && (
        <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Preview: {showPreview.name}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <ReceiptPreview template={showPreview} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
