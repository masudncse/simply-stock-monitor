import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ProductCombobox } from '@/components/ProductCombobox';
import { SupplierCombobox } from '@/components/SupplierCombobox';
import {
  Plus as AddIcon,
  Trash2 as DeleteIcon,
  Save as SaveIcon,
  ArrowLeft as BackIcon,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { update as updateRoute, show as showRoute } from '@/routes/purchases';
import { cn } from '@/lib/utils';

interface Supplier {
  id: number;
  name: string;
  code: string;
}

interface Warehouse {
  id: number;
  name: string;
  code: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  unit: string;
  category: {
    id: number;
    name: string;
  };
}

interface PurchaseItem {
  id?: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  batch: string;
  expiry_date: string;
}

interface Purchase {
  id: number;
  invoice_number: string;
  supplier_id: number;
  warehouse_id: number;
  purchase_date: string;
  due_date?: string;
  notes?: string;
  items: PurchaseItem[];
}

interface PurchasesEditProps {
  purchase: Purchase;
  suppliers: Supplier[];
  warehouses: Warehouse[];
  products: Product[];
}

export default function PurchasesEdit({ purchase, suppliers, warehouses, products }: PurchasesEditProps) {
  const [formData, setFormData] = useState({
    supplier_id: purchase.supplier_id?.toString() || '',
    warehouse_id: purchase.warehouse_id?.toString() || '',
    purchase_date: purchase.purchase_date,
    due_date: purchase.due_date || '',
    notes: purchase.notes || '',
  });

  const [items, setItems] = useState<PurchaseItem[]>(purchase.items || []);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productOpen, setProductOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    quantity: 1,
    unit_price: 0,
    batch: '',
    expiry_date: '',
  });

  const addItem = () => {
    if (!selectedProduct) return;

    const totalPrice = newItem.quantity * newItem.unit_price;
    const item: PurchaseItem = {
      product_id: selectedProduct.id,
      product: selectedProduct,
      quantity: newItem.quantity,
      unit_price: newItem.unit_price,
      total_price: totalPrice,
      batch: newItem.batch,
      expiry_date: newItem.expiry_date,
    };

    setItems([...items, item]);
    setSelectedProduct(null);
    setNewItem({
      quantity: 1,
      unit_price: 0,
      batch: '',
      expiry_date: '',
    });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unit_price') {
      updatedItems[index].total_price = updatedItems[index].quantity * updatedItems[index].unit_price;
    }
    
    setItems(updatedItems);
  };

  const calculateTotals = () => {
    const safeItems = items || [];
    const subtotal = safeItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
    const taxRate = 0.1; // 10% tax
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    return { subtotal, taxAmount, totalAmount };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    const { subtotal, taxAmount, totalAmount } = calculateTotals();

    router.put(updateRoute.url({ purchase: purchase.id }), {
      ...formData,
      items,
      subtotal,
      tax_amount: taxAmount,
      discount_amount: 0,
      total_amount: totalAmount,
    });
  };

  const totals = calculateTotals();

  return (
    <Layout title={`Edit Purchase - ${purchase.invoice_number}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Purchase - {purchase.invoice_number}</h1>
            <p className="text-muted-foreground">
              Update purchase order details and items
            </p>
          </div>
          <Button variant="outline" onClick={() => router.visit(showRoute.url({ purchase: purchase.id }))}>
            <BackIcon className="mr-2 h-4 w-4" />
            Back to Purchase
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Purchase Details */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <SupplierCombobox
                    value={formData.supplier_id}
                    onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
                    placeholder="Select a supplier"
                    showAllOption={false}
                    error={false}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouse">Warehouse *</Label>
                  <Select value={formData.warehouse_id} onValueChange={(value) => setFormData({ ...formData, warehouse_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                          {warehouse.name} ({warehouse.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="purchase_date">Purchase Date *</Label>
                    <Input
                      id="purchase_date"
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Add Items */}
            <Card>
              <CardHeader>
                <CardTitle>Add Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Product</Label>
                  <ProductCombobox
                    value={selectedProduct?.id.toString() || ''}
                    onValueChange={(value) => {
                      const product = products.find(p => p.id.toString() === value);
                      setSelectedProduct(product || null);
                      if (product) {
                        setNewItem({ ...newItem, unit_price: product.price });
                      }
                    }}
                    placeholder="Select product..."
                    showAllOption={false}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit_price">Unit Price</Label>
                    <Input
                      id="unit_price"
                      type="number"
                      value={newItem.unit_price}
                      onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch</Label>
                    <Input
                      id="batch"
                      value={newItem.batch}
                      onChange={(e) => setNewItem({ ...newItem, batch: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={newItem.expiry_date}
                      onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addItem}
                  disabled={!selectedProduct || newItem.quantity <= 0 || newItem.unit_price <= 0}
                  className="w-full"
                >
                  <AddIcon className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Items</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No items added yet. Add items using the form above.</p>
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead className="text-right">Total Price</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.product?.name}</TableCell>
                          <TableCell>{item.product?.sku}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${item.total_price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.batch}
                              onChange={(e) => updateItem(index, 'batch', e.target.value)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={item.expiry_date}
                              onChange={(e) => updateItem(index, 'expiry_date', e.target.value)}
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeItem(index)}
                            >
                              <DeleteIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardContent>
              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${totals.taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${totals.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit(showRoute.url({ purchase: purchase.id }))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={items.length === 0}
            >
              <SaveIcon className="mr-2 h-4 w-4" />
              Update Purchase
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}