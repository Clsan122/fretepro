
import React from 'react';

export const PrintStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 3mm;
          scale: 0.9;
        }
        body {
          font-size: 8px !important;
          line-height: 1.1 !important;
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
          padding: 1mm !important;
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
          max-height: 14mm !important;
        }
        h2 {
          font-size: 12px !important;
          margin-bottom: 1mm !important;
        }
        h3 {
          font-size: 10px !important;
          margin-bottom: 0.5mm !important;
        }
        p {
          margin: 0 !important;
          line-height: 1.2 !important;
        }
        .space-y-4 {
          margin-top: 0 !important;
        }
        .space-y-4 > * + * {
          margin-top: 1mm !important;
        }
        .space-y-2 > * + * {
          margin-top: 0.5mm !important;
        }
        .card {
          margin-bottom: 1mm !important;
          padding: 1mm !important;
          border: 0.1mm solid #eaeaea !important;
          break-inside: avoid !important;
        }
        table {
          font-size: 7px !important;
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
        .mb-6, .my-6 {
          margin-bottom: 1mm !important;
        }
        .mb-4, .my-4 {
          margin-bottom: 0.8mm !important;
        }
        .mb-2, .my-2 {
          margin-bottom: 0.5mm !important;
        }
        .mb-1, .my-1 {
          margin-bottom: 0.3mm !important;
        }
        .mt-8, .my-8 {
          margin-top: 1.5mm !important;
        }
        .mt-4, .my-4 {
          margin-top: 0.8mm !important;
        }
        .mt-2, .my-2 {
          margin-top: 0.5mm !important;
        }
        .pt-4 {
          padding-top: 0.8mm !important;
        }
        .p-6 {
          padding: 1mm !important;
        }
        .p-4, .p-3 {
          padding: 0.8mm !important;
        }
        .p-2 {
          padding: 0.5mm !important;
        }
        .rounded-lg, .rounded-md {
          border-radius: 0.8mm !important;
        }
        .border {
          border-width: 0.1mm !important;
        }
        .gap-4, .gap-3, .gap-2 {
          gap: 0.5mm !important;
        }
        .text-sm {
          font-size: 7px !important;
        }
        .text-xs {
          font-size: 6px !important;
        }
        
        /* Otimizando o layout de impressão para uma página */
        .card-content {
          padding: 0.8mm !important;
        }
        
        /* Compactando o layout para caber em uma página */
        .bg-freight-50\/30, .bg-freight-50\/50 {
          background: none !important;
          padding: 0mm !important;
        }
        
        /* Reduzir espaçamento entre seções */
        .space-y-2 {
          margin-top: 0 !important;
        }
        
        /* Ajuste para assinaturas */
        .pt-2 {
          padding-top: 0.5mm !important;
        }
        
        /* Otimizar tamanho total impresso */
        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
          }
        }
      `}
    </style>
  );
};
