
import React from 'react';

export const PrintStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 5mm;
        }
        body {
          font-size: 10px !important;
          line-height: 1.2 !important;
          color: black !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print-container {
          padding: 0 !important;
          margin: 0 !important;
        }
        #collection-order-print {
          padding: 2mm !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: 210mm !important;
          max-height: 297mm !important;
          box-shadow: none !important;
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        #collection-order-print * {
          page-break-inside: avoid !important;
        }
        .print-exclude, .print-hide {
          display: none !important;
        }
        img {
          max-height: 16mm !important;
        }
        h2 {
          font-size: 14px !important;
          margin-bottom: 1mm !important;
        }
        h3 {
          font-size: 12px !important;
          margin-bottom: 0.5mm !important;
        }
        p {
          margin: 0 !important;
          line-height: 1.3 !important;
        }
        .space-y-4 {
          margin-top: 0 !important;
        }
        .space-y-4 > * + * {
          margin-top: 1.5mm !important;
        }
        .card {
          margin-bottom: 1.5mm !important;
          padding: 1.5mm !important;
          border: 0.1mm solid #eaeaea !important;
          break-inside: avoid !important;
        }
        table {
          font-size: 8px !important;
        }
        .grid-cols-2, .grid-cols-3, .grid-cols-4 {
          display: grid !important;
          grid-gap: 1.5mm !important;
        }
        .grid-cols-2 {
          grid-template-columns: 1fr 1fr !important;
        }
        .grid-cols-3 {
          grid-template-columns: 1fr 1fr 1fr !important;
        }
        .grid-cols-4 {
          grid-template-columns: 1fr 1fr 1fr 1fr !important;
        }
        .font-semibold {
          font-weight: 600 !important;
        }
        .mb-6 {
          margin-bottom: 2mm !important;
        }
        .mb-4 {
          margin-bottom: 1.5mm !important;
        }
        .mb-2 {
          margin-bottom: 0.75mm !important;
        }
        .mt-8 {
          margin-top: 2.5mm !important;
        }
        .pt-4 {
          padding-top: 1.5mm !important;
        }
        .p-4, .p-3 {
          padding: 1mm !important;
        }
        .rounded-lg, .rounded-md {
          border-radius: 1mm !important;
        }
        .border {
          border-width: 0.1mm !important;
        }
        .gap-4, .gap-3, .gap-2 {
          gap: 1mm !important;
        }
        .text-sm {
          font-size: 8px !important;
        }
        .text-xs {
          font-size: 7px !important;
        }
      `}
    </style>
  );
};
