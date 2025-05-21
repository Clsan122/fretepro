
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
          font-size: 9px !important;
          line-height: 1.1 !important;
          color: black !important;
          background: white !important;
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
          max-height: 18mm !important;
        }
        h2 {
          font-size: 14px !important;
          margin-bottom: 2mm !important;
        }
        h3 {
          font-size: 11px !important;
          margin-bottom: 1mm !important;
        }
        p {
          margin: 0 !important;
          line-height: 1.2 !important;
        }
        .space-y-4 {
          margin-top: 0 !important;
        }
        .space-y-4 > * + * {
          margin-top: 1.5mm !important;
        }
        .card {
          margin-bottom: 1.5mm !important;
          padding: 1mm !important;
        }
        table {
          font-size: 8px !important;
        }
        .grid-cols-2, .grid-cols-3, .grid-cols-4 {
          display: grid !important;
          grid-gap: 1mm !important;
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
          margin-bottom: 1mm !important;
        }
        .mt-8 {
          margin-top: 3mm !important;
        }
        .pt-4 {
          padding-top: 1.5mm !important;
        }
        .p-4, .p-3 {
          padding: 1mm !important;
        }
      `}
    </style>
  );
};
