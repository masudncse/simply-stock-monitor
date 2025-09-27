import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus as AddIcon,
  Search as SearchIcon,
  Eye as ViewIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Check as ApproveIcon,
  X as RejectIcon,
  ArrowRight as ConvertIcon,
  Printer as PrintIcon,
} from 'lucide-react';
import { router, Link } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface Quotation {
  id: number;
  quotation_number: string;
  customer: {
    id: number;
    name: string;
    code: string;
  };
  warehouse: {
    id: number;
    name: string;
    code: string;
  };
  quotation_date: string;
  valid_until: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  created_at: string;
  creator: {
    id: number;
    name: string;
  };
  converted_to_sale_id?: number;
}

interface QuotationsIndexProps {
  quotations: {
    data: Quotation[];
    links: any[];
    meta: any;
  };
}

export default function QuotationsIndex({ quotations }: QuotationsIndexProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const filteredQuotations = quotations.data.filter(quotation => {
    const matchesSearch = 
      quotation.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.customer.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (quotation: Quotation) => {
    router.post(`/quotations/${quotation.id}/approve`);
  };

  const handleReject = (quotation: Quotation) => {
    router.post(`/quotations/${quotation.id}/reject`);
  };

  const handleSend = (quotation: Quotation) => {
    router.post(`/quotations/${quotation.id}/send`);
  };

  const handleConvertToSale = (quotation: Quotation) => {
    router.post(`/quotations/${quotation.id}/convert-to-sale`);
  };

  return (
    <Layout title="Quotations">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
            <p className="text-muted-foreground">
              Manage customer quotations and convert approved ones to sales
            </p>
          </div>
          <Button asChild>
            <Link href="/quotations/create">
              <AddIcon className="mr-2 h-4 w-4" />
              Create Quotation
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search quotations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quotations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Quotations ({filteredQuotations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredQuotations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No quotations found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotations.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-medium">
                        <Link 
                          href={`/quotations/${quotation.id}`}
                          className="text-primary hover:underline"
                        >
                          {quotation.quotation_number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quotation.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{quotation.customer.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(quotation.quotation_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(quotation.valid_until).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(quotation.total_amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(quotation.status)}>
                          {getStatusLabel(quotation.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{quotation.creator.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/quotations/${quotation.id}`}>
                              <ViewIcon className="h-4 w-4" />
                            </Link>
                          </Button>
                          
                          {quotation.status === 'draft' && (
                            <>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/quotations/${quotation.id}/edit`}>
                                  <EditIcon className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleSend(quotation)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <SendIcon className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {quotation.status === 'sent' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleApprove(quotation)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <ApproveIcon className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleReject(quotation)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <RejectIcon className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {quotation.status === 'approved' && !quotation.converted_to_sale_id && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleConvertToSale(quotation)}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <ConvertIcon className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {quotation.converted_to_sale_id && (
                            <Badge variant="outline" className="text-xs">
                              Converted
                            </Badge>
                          )}
                          
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/quotations/${quotation.id}/print`} target="_blank">
                              <PrintIcon className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
