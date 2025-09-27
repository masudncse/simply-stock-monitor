import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft as BackIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Check as ApproveIcon,
  X as RejectIcon,
  ArrowRight as ConvertIcon,
  FileText as InvoiceIcon,
  Printer as PrintIcon,
} from 'lucide-react';
import { router, Link } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface QuotationItem {
  id: number;
  product: {
    id: number;
    name: string;
    sku: string;
    unit: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
  batch: string;
  expiry_date: string;
}

interface Quotation {
  id: number;
  quotation_number: string;
  customer: {
    id: number;
    name: string;
    code: string;
    email: string;
    phone: string;
  };
  warehouse: {
    id: number;
    name: string;
    code: string;
  };
  quotation_date: string;
  valid_until: string;
  notes: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  created_at: string;
  creator: {
    id: number;
    name: string;
  };
  approver?: {
    id: number;
    name: string;
  };
  approved_at: string;
  converted_to_sale_id: number;
  convertedSale?: {
    id: number;
    invoice_number: string;
  };
  items: QuotationItem[];
}

interface QuotationsShowProps {
  quotation: Quotation;
}

export default function QuotationsShow({ quotation }: QuotationsShowProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'expired': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleApprove = () => {
    router.post(`/quotations/${quotation.id}/approve`);
  };

  const handleReject = () => {
    router.post(`/quotations/${quotation.id}/reject`);
  };

  const handleSend = () => {
    router.post(`/quotations/${quotation.id}/send`);
  };

  const handleConvertToSale = () => {
    router.post(`/quotations/${quotation.id}/convert-to-sale`);
  };

  return (
    <Layout title={`Quotation ${quotation.quotation_number}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Quotation {quotation.quotation_number}
              </h1>
              <Badge variant={getStatusVariant(quotation.status)}>
                {getStatusLabel(quotation.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Created on {new Date(quotation.created_at).toLocaleDateString()} by {quotation.creator.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.visit('/quotations')}>
              <BackIcon className="mr-2 h-4 w-4" />
              Back to Quotations
            </Button>
            
            {quotation.status === 'draft' && (
              <>
                <Button variant="outline" asChild>
                  <Link href={`/quotations/${quotation.id}/edit`}>
                    <EditIcon className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button onClick={handleSend}>
                  <SendIcon className="mr-2 h-4 w-4" />
                  Send to Customer
                </Button>
              </>
            )}
            
            {quotation.status === 'sent' && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleApprove}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <ApproveIcon className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReject}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <RejectIcon className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
            
            {quotation.status === 'approved' && !quotation.converted_to_sale_id && (
              <Button onClick={handleConvertToSale}>
                <ConvertIcon className="mr-2 h-4 w-4" />
                Convert to Sale
              </Button>
            )}
            
            {quotation.converted_to_sale_id && (
              <Button variant="outline" asChild>
                <Link href={`/sales/${quotation.converted_to_sale_id}`}>
                  <InvoiceIcon className="mr-2 h-4 w-4" />
                  View Sale
                </Link>
              </Button>
            )}
            
            <Button variant="outline" asChild>
              <Link href={`/quotations/${quotation.id}/print`} target="_blank">
                <PrintIcon className="mr-2 h-4 w-4" />
                Print
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Customer & Warehouse Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">{quotation.customer.name}</span>
                  <span className="text-muted-foreground ml-2">({quotation.customer.code})</span>
                </div>
                {quotation.customer.email && (
                  <div className="text-sm text-muted-foreground">
                    Email: {quotation.customer.email}
                  </div>
                )}
                {quotation.customer.phone && (
                  <div className="text-sm text-muted-foreground">
                    Phone: {quotation.customer.phone}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quotation Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quotation.items.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {item.product.sku} • Unit: {item.product.unit}
                        </div>
                        {item.batch && (
                          <div className="text-sm text-muted-foreground">
                            Batch: {item.batch}
                          </div>
                        )}
                        {item.expiry_date && (
                          <div className="text-sm text-muted-foreground">
                            Expiry: {new Date(item.expiry_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {item.quantity} × ${item.unit_price.toFixed(2)}
                        </div>
                        <div className="text-lg font-semibold">
                          ${item.total_price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quotation Details & Totals */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quotation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quotation Date:</span>
                  <span>{new Date(quotation.quotation_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid Until:</span>
                  <span>{new Date(quotation.valid_until).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Warehouse:</span>
                  <span>{quotation.warehouse.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created By:</span>
                  <span>{quotation.creator.name}</span>
                </div>
                
                {quotation.approver && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Approved By:</span>
                      <span>{quotation.approver.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Approved At:</span>
                      <span>{new Date(quotation.approved_at).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
                
                {quotation.convertedSale && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Converted to Sale:</span>
                      <Link 
                        href={`/sales/${quotation.convertedSale.id}`}
                        className="text-primary hover:underline"
                      >
                        {quotation.convertedSale.invoice_number}
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Totals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${quotation.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>${quotation.tax_amount.toFixed(2)}</span>
                </div>
                {quotation.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Discount ({quotation.discount_type === 'percentage' 
                        ? `${quotation.discount_value}%` 
                        : `$${quotation.discount_value.toFixed(2)}`}):
                    </span>
                    <span>-${quotation.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${quotation.total_amount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {quotation.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{quotation.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
