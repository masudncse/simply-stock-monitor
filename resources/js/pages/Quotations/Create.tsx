import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CustomerCombobox } from '@/components/CustomerCombobox';
import { ProductCombobox } from '@/components/ProductCombobox';
import {
  Plus as AddIcon,
  Trash2 as DeleteIcon,
  Save as SaveIcon,
  ArrowLeft as BackIcon,
  Check,
  ChevronsUpDown,
  UserPlus,
} from 'lucide-react';
import { router, useForm } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { index as indexRoute } from '@/routes/quotations';
import { cn } from '@/lib/utils';

interface Customer {
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

interface QuotationItem {
  id?: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  batch: string;
  expiry_date: string;
}

interface QuotationsCreateProps {
  customers: Customer[];
  warehouses: Warehouse[];
  products: Product[];
  taxRate: number;
}

export default function QuotationsCreate({ customers, warehouses, products, taxRate }: QuotationsCreateProps) {
  
  const { data: formData, setData: setFormData, post, processing, errors } = useForm({
    customer_id: '',
    warehouse_id: '',
    quotation_date: new Date().toISOString().split('T')[0],
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    notes: '',
    items: [] as QuotationItem[],
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
  });


  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productOpen, setProductOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    quantity: 1,
    unit_price: 0,
    batch: '',
    expiry_date: '',
  });

  const items = formData.items;

  const addItem = () => {
    if (!selectedProduct) return;

    const totalPrice = newItem.quantity * newItem.unit_price;
    const item: QuotationItem = {
      product_id: selectedProduct.id,
      product: selectedProduct,
      quantity: newItem.quantity,
      unit_price: newItem.unit_price,
      total_price: totalPrice,
      batch: newItem.batch,
      expiry_date: newItem.expiry_date,
    };

    setFormData('items', [...items, item]);
    setSelectedProduct(null);
    setNewItem({
      quantity: 1,
      unit_price: 0,
      batch: '',
      expiry_date: '',
    });
  };

  const removeItem = (index: number) => {
    setFormData('items', items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unit_price') {
      updatedItems[index].total_price = updatedItems[index].quantity * updatedItems[index].unit_price;
    }
    
    setFormData('items', updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    
    // Calculate discount
    let discountAmount = 0;
    if (formData.discount_type && formData.discount_value) {
      if (formData.discount_type === 'percentage') {
        discountAmount = (subtotal * formData.discount_value) / 100;
      } else {
        discountAmount = Math.min(formData.discount_value, subtotal);
      }
    }
    
    const totalAmount = subtotal + taxAmount - discountAmount;

    return { subtotal, taxAmount, discountAmount, totalAmount };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    post('/quotations');
  };

  const totals = calculateTotals();

  return (
    <Layout title="Create Quotation - Generate a new sales quotation">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Quotation</h1>
            <p className="text-muted-foreground">
              Create a new quotation for your customer
            </p>
          </div>
          <Button variant="outline" onClick={() => router.visit(indexRoute.url())}>
            <BackIcon className="mr-2 h-4 w-4" />
            Back to Quotations
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-semibold">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Quotation Details */}
            <Card>
              <CardHeader>
                <CardTitle>Quotation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <CustomerCombobox
                        value={formData.customer_id}
                        onValueChange={(value) => setFormData('customer_id', value)}
                        placeholder="Select customer"
                        showAllOption={false}
                        error={!!errors.customer_id}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('/customers/create', '_blank')}
                      className="shrink-0"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {errors.customer_id && (
                    <p className="text-sm text-destructive">{errors.customer_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouse">Warehouse</Label>
                  <Select
                    value={formData.warehouse_id}
                    onValueChange={(value) => setFormData('warehouse_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                          {warehouse.name} ({warehouse.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.warehouse_id && (
                    <p className="text-sm text-destructive">{errors.warehouse_id}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quotation_date">Quotation Date</Label>
                    <Input
                      id="quotation_date"
                      type="date"
                      value={formData.quotation_date}
                      onChange={(e) => setFormData('quotation_date', e.target.value)}
                    />
                    {errors.quotation_date && (
                      <p className="text-sm text-destructive">{errors.quotation_date}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valid_until">Valid Until</Label>
                    <Input
                      id="valid_until"
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData('valid_until', e.target.value)}
                    />
                    {errors.valid_until && (
                      <p className="text-sm text-destructive">{errors.valid_until}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData('notes', e.target.value)}
                    placeholder="Add any additional notes..."
                    rows={3}
                  />
                  {errors.notes && (
                    <p className="text-sm text-destructive">{errors.notes}</p>
                  )}
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
                  <Label>Product</Label>
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
                    selectedProduct={selectedProduct}
                  />
                </div>

                {selectedProduct && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit_price">Unit Price</Label>
                      <Input
                        id="unit_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newItem.unit_price}
                        onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                )}

                {selectedProduct && (
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch (Optional)</Label>
                    <Input
                      id="batch"
                      value={newItem.batch}
                      onChange={(e) => setNewItem({ ...newItem, batch: e.target.value })}
                      placeholder="Enter batch number"
                    />
                  </div>
                )}

                {selectedProduct && (
                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={newItem.expiry_date}
                      onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
                    />
                  </div>
                )}

                <Button
                  type="button"
                  onClick={addItem}
                  disabled={!selectedProduct}
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
              <CardTitle>Quotation Items</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No items added yet. Add items using the form above.</p>
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
                        <TableHead>Total Price</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product?.name}</TableCell>
                          <TableCell>{item.product?.sku}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.unit_price}
                              onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>${item.total_price.toFixed(2)}</TableCell>
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

          {/* Discount Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Discount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <Select 
                    value={formData.discount_type} 
                    onValueChange={(value: 'percentage' | 'fixed') => setFormData('discount_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="discount-value">Discount Value</Label>
                  <Input
                    id="discount-value"
                    type="number"
                    step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                    min="0"
                    max={formData.discount_type === 'percentage' ? '100' : undefined}
                    value={formData.discount_value || ''}
                    onChange={(e) => setFormData('discount_value', parseFloat(e.target.value) || 0)}
                    placeholder={formData.discount_type === 'percentage' ? '0' : '0.00'}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData('discount_type', 'percentage');
                    setFormData('discount_value', 0);
                  }}
                >
                  Clear
                </Button>
              </div>
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
                    <span>Tax ({taxRate}%):</span>
                    <span>${totals.taxAmount.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Customer Discount ({formData.discount_type === 'percentage' ? `${formData.discount_value}%` : `$${formData.discount_value.toFixed(2)}`}):</span>
                      <span>-${totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>${totals.totalAmount.toFixed(2)}</span>
                    </div>
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
              onClick={() => router.visit(indexRoute.url())}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={items.length === 0 || processing}
            >
              <SaveIcon className="mr-2 h-4 w-4" />
              {processing ? 'Creating...' : 'Create Quotation'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
