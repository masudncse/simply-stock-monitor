import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus as AddIcon,
  Minus as RemoveIcon,
  Trash2 as DeleteIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  CreditCard as PaymentIcon,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  unit: string;
  images: Array<{
    id: number;
    image_path: string;
    is_primary: boolean;
    image_url: string;
  }>;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface POSProps {
  products: Product[];
  taxRate: number;
}

export default function POS({ products, taxRate }: POSProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'both'>('cash');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        product,
        quantity,
        unitPrice: product.price,
        total: product.price * quantity,
      };
      setCart([...cart, newItem]);
    }
    setQuantity(1);
    setSelectedProduct(null);
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity, total: item.unitPrice * newQuantity }
        : item
    ));
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const getTax = () => {
    return (getSubtotal() * taxRate) / 100;
  };

  const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    if (discountType === 'percentage') {
      return (subtotal * discountValue) / 100;
    } else {
      return Math.min(discountValue, subtotal); // Can't discount more than subtotal
    }
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const tax = getTax();
    const discount = getDiscountAmount();
    return subtotal + tax - discount;
  };

  const getChange = () => {
    return Math.max(0, receivedAmount - getTotal());
  };

  const getRemainingAmount = () => {
    return Math.max(0, getTotal() - receivedAmount);
  };

  const processSale = () => {
    if (cart.length === 0) return;

    const saleData = {
      customer_name: customerName || 'Walk-in Customer',
      items: cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.total,
      })),
      subtotal: getSubtotal(),
      tax_amount: getTax(),
      discount_amount: getDiscountAmount(),
      discount_type: discountType,
      discount_value: discountValue,
      total_amount: getTotal(),
      received_amount: receivedAmount,
      change_amount: getChange(),
      payment_method: paymentMethod,
    };

    router.post('/sales', saleData, {
      onSuccess: () => {
        setCart([]);
        setCustomerName('');
        setReceivedAmount(0);
        setPaymentMethod('cash');
        setDiscountType('percentage');
        setDiscountValue(0);
        setPaymentDialogOpen(false);
      },
    });
  };

  return (
    <Layout title="Point of Sale">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
          <p className="text-muted-foreground">
            Process sales quickly and efficiently
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Product Search and Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SearchIcon className="h-5 w-5" />
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Product Image */}
                          <div className="w-full h-32 rounded-lg overflow-hidden border">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0].image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-sm text-muted-foreground">No image</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="font-medium truncate">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              SKU: {product.sku}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-semibold text-primary">
                                ${product.price.toFixed(2)}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {product.unit}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCartIcon className="h-5 w-5" />
                  Cart ({cart.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No items in cart
                  </div>
                ) : (
                  <>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cart.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {/* Product Image */}
                                  <div className="w-10 h-10 rounded-lg overflow-hidden border flex-shrink-0">
                                    {item.product.images && item.product.images.length > 0 ? (
                                      <img
                                        src={item.product.images[0].image_url}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <span className="text-xs text-muted-foreground">No img</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-1 min-w-0">
                                    <p className="font-medium text-sm truncate">
                                      {item.product.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      ${item.unitPrice.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <RemoveIcon className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-medium min-w-[2rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <AddIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${item.total.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 text-destructive hover:text-destructive"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <DeleteIcon className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${getSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax (10%):</span>
                        <span>${getTax().toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${getTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setPaymentDialogOpen(true)}
                      disabled={cart.length === 0}
                    >
                      <PaymentIcon className="mr-2 h-4 w-4" />
                      Process Sale
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Selection Dialog */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add to Cart</DialogTitle>
              <DialogDescription>
                Select the quantity for this product
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    SKU: {selectedProduct.sku} | Price: ${selectedProduct.price.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => selectedProduct && addToCart(selectedProduct)}
              >
                Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Process Payment</DialogTitle>
              <DialogDescription>
                Complete the sale transaction
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Customer Name (Optional)</Label>
                <Input
                  id="customer-name"
                  placeholder="Walk-in Customer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Order Summary</h4>
                <div className="space-y-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({taxRate}%):</span>
                    <span>${getTax().toFixed(2)}</span>
                  </div>
                  {getDiscountAmount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : `$${discountValue.toFixed(2)}`}):</span>
                      <span>-${getDiscountAmount().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Discount Controls */}
              <div className="space-y-2">
                <Label>Discount</Label>
                <div className="flex gap-2">
                  <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">%</SelectItem>
                      <SelectItem value="fixed">$</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    step={discountType === 'percentage' ? '1' : '0.01'}
                    min="0"
                    max={discountType === 'percentage' ? '100' : undefined}
                    value={discountValue || ''}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    placeholder={discountType === 'percentage' ? '0' : '0.00'}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDiscountType('percentage');
                      setDiscountValue(0);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="flex gap-2">
                  <Button
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentMethod('cash')}
                    className="flex-1"
                  >
                    Cash
                  </Button>
                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentMethod('card')}
                    className="flex-1"
                  >
                    Card
                  </Button>
                  <Button
                    variant={paymentMethod === 'both' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentMethod('both')}
                    className="flex-1"
                  >
                    Both
                  </Button>
                </div>
              </div>

              {/* Payment Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="received-amount">
                  Amount Received {paymentMethod === 'card' ? '(if partial cash)' : ''}
                </Label>
                <Input
                  id="received-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={receivedAmount || ''}
                  onChange={(e) => setReceivedAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="text-lg"
                />
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReceivedAmount(getTotal())}
                    className="text-xs"
                  >
                    Exact
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReceivedAmount(Math.ceil(getTotal()))}
                    className="text-xs"
                  >
                    Round Up
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReceivedAmount(Math.ceil(getTotal() / 10) * 10)}
                    className="text-xs"
                  >
                    Round $10
                  </Button>
                </div>
              </div>

              {/* Payment Calculation Display */}
              {receivedAmount > 0 && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total Due:</span>
                    <span className="font-semibold">${getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Received:</span>
                    <span>${receivedAmount.toFixed(2)}</span>
                  </div>
                  
                  {receivedAmount >= getTotal() ? (
                    <div className="flex justify-between text-green-600 font-semibold text-lg">
                      <span>Change Due:</span>
                      <span>${getChange().toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-red-600 font-semibold text-lg">
                      <span>Amount Short:</span>
                      <span>${getRemainingAmount().toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setPaymentDialogOpen(false);
                  setReceivedAmount(0);
                  setPaymentMethod('cash');
                  setDiscountType('percentage');
                  setDiscountValue(0);
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setReceivedAmount(getTotal());
                }}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Exact Amount
              </Button>
              <Button 
                onClick={processSale} 
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                disabled={receivedAmount < getTotal()}
              >
                Complete Sale
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
