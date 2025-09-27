import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import PrintLayout from '../../layouts/PrintLayout';

interface PurchaseItem {
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

interface Purchase {
  id: number;
  purchase_number: string;
  supplier: {
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
  purchase_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: string;
  notes: string;
  created_at: string;
  createdBy: {
    id: number;
    name: string;
  };
  items: PurchaseItem[];
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
}

interface PurchasePrintProps {
  purchase: Purchase;
  taxRate: number;
  company: Company;
}

export default function PurchasePrint({ purchase, taxRate, company }: PurchasePrintProps) {
  const currentDate = new Date().toLocaleDateString();

  return (
    <PrintLayout title={`Purchase Order ${purchase.purchase_number}`}>
      <div className="bg-white text-black">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">PURCHASE ORDER</h1>
              <p className="text-lg text-gray-600">PO #{purchase.purchase_number}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                <p>Order Date: {new Date(purchase.purchase_date).toLocaleDateString()}</p>
                <p>Due Date: {new Date(purchase.due_date).toLocaleDateString()}</p>
                <p>Print Date: {currentDate}</p>
                <p>Status: <span className="font-semibold capitalize">{purchase.status}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Company & Supplier Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">To:</h3>
            <div className="text-sm">
              <p className="font-semibold">{purchase.supplier.name}</p>
              <p>Code: {purchase.supplier.code}</p>
              {purchase.supplier.email && <p>Email: {purchase.supplier.email}</p>}
              {purchase.supplier.phone && <p>Phone: {purchase.supplier.phone}</p>}
              {purchase.supplier.address && <p>{purchase.supplier.address}</p>}
              {(purchase.supplier.city || purchase.supplier.state) && (
                <p>{purchase.supplier.city}{purchase.supplier.city && purchase.supplier.state ? ', ' : ''}{purchase.supplier.state} {purchase.supplier.postal_code}</p>
              )}
              {purchase.supplier.country && <p>{purchase.supplier.country}</p>}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">From:</h3>
            <div className="text-sm">
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
              {purchase.items.map((item, index) => (
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
                  <td className="border border-gray-800 px-3 py-2 text-right">${item.unit_price.toFixed(2)}</td>
                  <td className="border border-gray-800 px-3 py-2 text-right font-medium">${item.total_price.toFixed(2)}</td>
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
                <span>${purchase.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between px-4 py-2 border-b border-gray-800">
                <span>Tax ({taxRate}%):</span>
                <span>${purchase.tax_amount.toFixed(2)}</span>
              </div>
              {purchase.discount_amount > 0 && (
                <div className="flex justify-between px-4 py-2 border-b border-gray-800 text-green-600">
                  <span>Supplier Discount:</span>
                  <span>-${purchase.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between px-4 py-2 bg-gray-100 font-bold text-lg">
                <span>TOTAL:</span>
                <span>${purchase.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {purchase.notes && (
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-2 text-gray-800">Notes:</h3>
            <div className="text-sm border border-gray-800 p-3">
              {purchase.notes}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-800 pt-4 text-sm text-gray-600">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p><strong>Warehouse:</strong> {purchase.warehouse.name} ({purchase.warehouse.code})</p>
              <p><strong>Created by:</strong> {purchase.createdBy.name}</p>
            </div>
            <div>
              <p><strong>Created:</strong> {new Date(purchase.created_at).toLocaleDateString()}</p>
              <p><strong>Purchase ID:</strong> #{purchase.id}</p>
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
