import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import PrintLayout from '../../layouts/PrintLayout';

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
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
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
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  total_amount: number;
  status: string;
  notes: string;
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
  items: QuotationItem[];
}

interface Company {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  tax_id: string;
  website: string;
  logo?: string;
}

interface QuotationPrintProps {
  quotation: Quotation;
  taxRate: number;
  company: Company;
}

export default function QuotationPrint({ quotation, taxRate, company }: QuotationPrintProps) {
  const currentDate = new Date().toLocaleDateString();

  return (
    <PrintLayout title={`Quotation ${quotation.quotation_number}`}>
      <div className="bg-white text-black">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">QUOTATION</h1>
              <p className="text-lg text-gray-600">Quote #{quotation.quotation_number}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                <p>Quote Date: {new Date(quotation.quotation_date).toLocaleDateString()}</p>
                <p>Valid Until: {new Date(quotation.valid_until).toLocaleDateString()}</p>
                <p>Print Date: {currentDate}</p>
                <p>Status: <span className="font-semibold capitalize">{quotation.status}</span></p>
                {quotation.approver && (
                  <p>Approved by: {quotation.approver.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Company & Customer Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">From:</h3>
            <div className="text-sm">
              {company?.logo && (
                <div className="mb-2">
                  <img 
                    src={`/storage/${company.logo}`} 
                    alt={company.name || 'Company Logo'} 
                    className="h-12 w-auto object-contain"
                  />
                </div>
              )}
              <p className="font-semibold">{company?.name || 'Your Company Name'}</p>
              {company?.address && <p>{company.address}</p>}
              {(company?.city || company?.state) && (
                <p>{company.city}{company.city && company.state ? ', ' : ''}{company.state} {company.postal_code}</p>
              )}
              {company?.country && <p>{company.country}</p>}
              {company?.phone && <p>Phone: {company.phone}</p>}
              {company?.email && <p>Email: {company.email}</p>}
              {company?.website && <p>Website: {company.website}</p>}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Quote To:</h3>
            <div className="text-sm">
              <p className="font-semibold">{quotation.customer.name}</p>
              <p>Code: {quotation.customer.code}</p>
              {quotation.customer.email && <p>Email: {quotation.customer.email}</p>}
              {quotation.customer.phone && <p>Phone: {quotation.customer.phone}</p>}
              {quotation.customer.address && <p>{quotation.customer.address}</p>}
              {(quotation.customer.city || quotation.customer.state) && (
                <p>{quotation.customer.city}{quotation.customer.city && quotation.customer.state ? ', ' : ''}{quotation.customer.state} {quotation.customer.postal_code}</p>
              )}
              {quotation.customer.country && <p>{quotation.customer.country}</p>}
            </div>
          </div>
        </div>

        {/* Validity Notice */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Validity:</strong> This quotation is valid until {new Date(quotation.valid_until).toLocaleDateString()}. 
            Prices and availability are subject to change without notice.
          </p>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-800 px-3 py-2 text-left font-bold">Item</th>
                <th className="border border-gray-800 px-3 py-2 text-left font-bold">SKU</th>
                <th className="border border-gray-800 px-3 py-2 text-center font-bold">Qty</th>
                <th className="border border-gray-800 px-3 py-2 text-center font-bold">Unit Price</th>
                <th className="border border-gray-800 px-3 py-2 text-center font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-800 px-3 py-2">
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      {item.batch && <div className="text-xs text-gray-600">Batch: {item.batch}</div>}
                      {item.expiry_date && <div className="text-xs text-gray-600">Expiry: {new Date(item.expiry_date).toLocaleDateString()}</div>}
                    </div>
                  </td>
                  <td className="border border-gray-800 px-3 py-2 text-sm">{item.product.sku}</td>
                  <td className="border border-gray-800 px-3 py-2 text-center">{item.quantity} {item.product.unit}</td>
                  <td className="border border-gray-800 px-3 py-2 text-right">${Number(item.unit_price || 0).toFixed(2)}</td>
                  <td className="border border-gray-800 px-3 py-2 text-right font-medium">${Number(item.total_price || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="border border-gray-800">
              <div className="flex justify-between px-4 py-2 border-b border-gray-800">
                <span>Subtotal:</span>
                <span>${Number(quotation.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between px-4 py-2 border-b border-gray-800">
                <span>Tax ({taxRate}%):</span>
                <span>${Number(quotation.tax_amount || 0).toFixed(2)}</span>
              </div>
              {quotation.discount_amount > 0 && (
                <div className="flex justify-between px-4 py-2 border-b border-gray-800 text-green-600">
                  <span>
                    Customer Discount ({quotation.discount_type === 'percentage' 
                      ? `${quotation.discount_value}%` 
                      : `$${Number(quotation.discount_value || 0).toFixed(2)}`}):
                  </span>
                  <span>-${Number(quotation.discount_amount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between px-4 py-2 bg-gray-100 font-bold text-lg">
                <span>TOTAL:</span>
                <span>${Number(quotation.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-2 text-gray-800">Terms & Conditions:</h3>
          <div className="text-sm border border-gray-800 p-3">
            <ul className="list-disc list-inside space-y-1">
              <li>This quotation is valid for 30 days from the date of issue.</li>
              <li>Prices are subject to change without prior notice.</li>
              <li>Payment terms: Net 30 days from invoice date.</li>
              <li>All items are subject to availability.</li>
              <li>Delivery terms to be agreed upon order confirmation.</li>
            </ul>
          </div>
        </div>

        {/* Notes */}
        {quotation.notes && (
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-2 text-gray-800">Additional Notes:</h3>
            <div className="text-sm border border-gray-800 p-3">
              {quotation.notes}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-800 pt-4 text-sm text-gray-600">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p><strong>Warehouse:</strong> {quotation.warehouse.name} ({quotation.warehouse.code})</p>
              <p><strong>Prepared by:</strong> {quotation.creator.name}</p>
            </div>
            <div>
              <p><strong>Created:</strong> {new Date(quotation.created_at).toLocaleDateString()}</p>
              <p><strong>Quotation ID:</strong> #{quotation.id}</p>
            </div>
          </div>
        </div>

        {/* Print Instructions */}
        <div className="no-print mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-bold text-blue-800 mb-2">Print Instructions:</h3>
          <p className="text-blue-700 text-sm">
            This document will automatically open the print dialog. Make sure to select the correct printer and paper size (A4 recommended).
          </p>
          <button 
            onClick={() => window.print()} 
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Print Now
          </button>
        </div>
      </div>
    </PrintLayout>
  );
}
