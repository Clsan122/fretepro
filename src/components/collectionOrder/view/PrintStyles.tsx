
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
          max-height: 280mm !important; /* Ajuste para A4 */
          box-shadow: none !important;
          break-inside: avoid !important;
        }
        #collection-order-print * {
          page-break-inside: avoid !important;
        }
        .print-exclude, .print-hide {
          display: none !important;
        }
        img {
          max-height: 20mm !important;
        }
        h2 {
          font-size: 16px !important;
          margin-bottom: 2mm !important;
        }
        h3 {
          font-size: 12px !important;
          margin-bottom: 1mm !important;
        }
        p {
          margin: 0 !important;
          line-height: 1.3 !important;
        }
        .space-y-4 {
          margin-top: 0 !important;
        }
        .space-y-4 > * + * {
          margin-top: 2mm !important;
        }
      `}
    </style>
  );
};
