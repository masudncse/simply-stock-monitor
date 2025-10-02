import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Purchase {
  id: number;
  invoice_number: string;
  supplier_id: number;
  warehouse_id: number;
  purchase_date: string;
  items: PurchaseItem[];
}

interface PurchaseItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    sku: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
  batch?: string;
}

interface CreatePurchaseReturnModalProps {
  open: boolean;
  onClose: () => void;
  purchase: Purchase;
}

const returnReasons = [
  { value: 'defective', label: 'Defective Product' },
  { value: 'wrong_item', label: 'Wrong Item Received' },
  { value: 'damaged', label: 'Damaged in Transit' },
  { value: 'quality_issue', label: 'Quality Issue' },
  { value: 'expired', label: 'Expired/Near Expiry' },
  { value: 'other', label: 'Other' },
];

export default function CreatePurchaseReturnModal({ open, onClose, purchase }: CreatePurchaseReturnModalProps) {
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('defective');
  const [notes, setNotes] = useState('');
  const [returnQuantities, setReturnQuantities] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setReturnQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const calculateTotals = () => {
    let subtotal = 0;
    const items = purchase.items.filter(item => (returnQuantities[item.id] || 0) > 0);
    
    items.forEach(item => {
      const returnQty = returnQuantities[item.id] || 0;
      subtotal += returnQty * item.unit_price;
    });

    return {
      subtotal,
      tax_amount: 0, // You can calculate based on your tax rate if needed
      total_amount: subtotal,
    };
  };

  const handleSubmit = () => {
    const totals = calculateTotals();
    
    // Build items array with only returned items
    const items = purchase.items
      .filter(item => (returnQuantities[item.id] || 0) > 0)
      .map(item => ({
        product_id: item.product_id,
        quantity: returnQuantities[item.id],
        unit_price: item.unit_price,
        total_price: returnQuantities[item.id] * item.unit_price,
        batch: item.batch || null,
      }));

    if (items.length === 0) {
      alert('Please select at least one item to return');
      return;
    }

    const data = {
      purchase_id: purchase.id,
      supplier_id: purchase.supplier_id,
      warehouse_id: purchase.warehouse_id,
      return_date: returnDate,
      reason,
      notes,
      subtotal: totals.subtotal,
      tax_amount: totals.tax_amount,
      total_amount: totals.total_amount,
      items,
    };

    setIsSubmitting(true);
    router.post('/purchase-returns', data, {
      onSuccess: () => {
        onClose();
        // Optionally reload the page or show success message
      },
      onError: (errors) => {
        console.error('Error creating return:', errors);
        setIsSubmitting(false);
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Return - {purchase.invoice_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Return Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="return_date">Return Date</Label>
              <Input
                id="return_date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason for Return</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {returnReasons.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <Label>Select Items to Return</Label>
            <div className="border rounded-md mt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Purchased Qty</TableHead>
                    <TableHead className="text-right">Return Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Return Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase.items.map((item) => {
                    const returnQty = returnQuantities[item.id] || 0;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-sm text-muted-foreground">{item.product.sku}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="0"
                            max={item.quantity}
                            value={returnQty}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                            className="w-20 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">${item.unit_price.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${(returnQty * item.unit_price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional information about the return..."
              rows={3}
            />
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Return Amount:</span>
              <span>${totals.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Return'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

