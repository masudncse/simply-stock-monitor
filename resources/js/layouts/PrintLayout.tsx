import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

interface PrintLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PrintLayout({ title, children }: PrintLayoutProps) {
  useEffect(() => {
    // Auto print when component mounts
    window.print();
  }, []);

  return (
    <>
      <Head title={title} />
      <div className="min-h-screen bg-white print:bg-white">
        <div className="max-w-4xl mx-auto p-8 print:p-0 print:max-w-none">
          {children}
        </div>
      </div>
      
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
          
          .print\\:text-black {
            color: black !important;
          }
          
          .print\\:bg-white {
            background: white !important;
          }
          
          .print\\:border {
            border: 1px solid #000 !important;
          }
          
          .print\\:border-t {
            border-top: 1px solid #000 !important;
          }
          
          .print\\:border-b {
            border-bottom: 1px solid #000 !important;
          }
          
          .print\\:text-sm {
            font-size: 12px !important;
          }
          
          .print\\:text-xs {
            font-size: 10px !important;
          }
          
          .print\\:font-bold {
            font-weight: bold !important;
          }
          
          .print\\:break-inside-avoid {
            break-inside: avoid !important;
          }
          
          .print\\:break-after-page {
            break-after: page !important;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      `}</style>
    </>
  );
}
