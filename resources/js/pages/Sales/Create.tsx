import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  Save,
  UserPlus,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { useToast } from '@/hooks/use-toast';

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

interface SaleItem {
  id?: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  batch: string;
  [key: string]: any;
}

interface SalesCreateProps {
  customers: Customer[];
  warehouses: Warehouse[];
  products: Product[];
  taxRate: number;
}

export default function SalesCreate({ customers, warehouses, products, taxRate }: SalesCreateProps) {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    customer_id: '',
    warehouse_id: '',
    sale_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);

  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newItem, setNewItem] = useState({
    quantity: 1,
    unit_price: 0,
    batch: '',
  });


  const addItem = () => {
    if (!selectedProduct) return;

    const totalPrice = newItem.quantity * newItem.unit_price;
    const item: SaleItem = {
      product_id: selectedProduct.id,
      product: selectedProduct,
      quantity: newItem.quantity,
      unit_price: newItem.unit_price,
      total_price: totalPrice,
      batch: newItem.batch,
    };

    setItems([...items, item]);
    setSelectedProduct(null);
    setNewItem({
      quantity: 1,
      unit_price: 0,
      batch: '',
    });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof SaleItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unit_price') {
      updatedItems[index].total_price = updatedItems[index].quantity * updatedItems[index].unit_price;
    }
    
    setItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    
    // Calculate discount
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = (subtotal * discountValue) / 100;
    } else {
      discountAmount = Math.min(discountValue, subtotal); // Can't discount more than subtotal
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

    const { subtotal, taxAmount, discountAmount, totalAmount } = calculateTotals();

    router.post('/sales', {
      ...formData,
      items,
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      discount_type: discountType,
      discount_value: discountValue,
      total_amount: totalAmount,
      paid_amount: 0,
      status: 'pending',
      payment_status: 'pending',
    }, {
      onError: (errors) => {
        console.error('Sale creation errors:', errors);
        // The error will be handled by Laravel's error handling
      },
      onSuccess: () => {
        // Redirect will be handled by the controller
      }
    });
  };

  const totals = calculateTotals();

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Create Sale
          </h1>
          <Button
            variant="outline"
            onClick={() => router.visit('/sales')}
          >
            Back to Sales
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sale Details */}
            <Card>
              <CardHeader>
                <CardTitle>Sale Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.customer_id}
                      onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name} ({customer.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouse">Warehouse</Label>
                  <Select
                    value={formData.warehouse_id}
                    onValueChange={(value) => setFormData({ ...formData, warehouse_id: value })}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sale_date">Sale Date</Label>
                  <Input
                    id="sale_date"
                    type="date"
                    value={formData.sale_date}
                    onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <Label htmlFor="product">Product</Label>
                  <Select
                    value={selectedProduct?.id.toString() || ''}
                    onValueChange={(value) => {
                      const product = products.find(p => p.id.toString() === value);
                      setSelectedProduct(product || null);
                      if (product) {
                        setNewItem({ ...newItem, unit_price: product.price });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProduct && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
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

                <Button
                  type="button"
                  onClick={addItem}
                  disabled={!selectedProduct}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Sale Items</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No items added yet. Add items using the form above.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Batch</TableHead>
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
                        <TableCell>${item.total_price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Input
                            value={item.batch}
                            onChange={(e) => updateItem(index, 'batch', e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Discount Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Discount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
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
                    step={discountType === 'percentage' ? '1' : '0.01'}
                    min="0"
                    max={discountType === 'percentage' ? '100' : undefined}
                    value={discountValue || ''}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    placeholder={discountType === 'percentage' ? '0' : '0.00'}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDiscountType('percentage');
                    setDiscountValue(0);
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
                <div className="w-full max-w-md space-y-2">
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
                      <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : `$${discountValue.toFixed(2)}`}):</span>
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
              variant="outline"
              onClick={() => router.visit('/sales')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={items.length === 0}
            >
              <Save className="mr-2 h-4 w-4" />
              Create Sale
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
