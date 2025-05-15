
import React from "react";

export const PrintPreviewStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 10mm;
          scale: 0.95;
        }
        
        body {
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 12px !important;
          background-color: white !important;
          color: black !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        #quotation-pdf {
          width: 210mm !important;
          max-width: 100% !important;
          box-shadow: none !important;
          padding: 6mm !important;
          margin: 0 auto !important;
          border: none !important;
          page-break-inside: avoid !important;
          color: black !important;
          background-color: white !important;
        }
        
        .print-container {
          max-width: 800px !important;
          margin: 0 auto !important;
          padding: 0 !important;
          color: black !important;
          background-color: white !important;
        }
        
        header, nav, footer, .sidebar, .bottom-navigation, button, 
        [data-radix-popper-content-wrapper], .dropdown-menu {
          display: none !important;
        }
        
        .print-no-shadow {
          box-shadow: none !important;
          border: none !important;
        }
        
        img {
          max-width: 100% !important;
          display: block !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          page-break-inside: avoid !important;
        }
        
        /* Override dark mode for printing */
        .dark {
          background-color: white !important;
          color: black !important;
        }
        
        .dark * {
          background-color: white !important;
          color: black !important;
          border-color: #ddd !important;
        }
        
        .dark .bg-gray-800,
        .dark .bg-gray-900,
        .dark .bg-gray-700,
        .dark .bg-slate-800,
        .dark .bg-slate-900,
        .dark .bg-slate-700 {
          background-color: white !important;
        }
        
        .dark .text-white,
        .dark .text-gray-100,
        .dark .text-gray-200 {
          color: black !important;
        }
        
        /* Force table content to be visible in dark mode */
        table {
          background-color: white !important;
          color: black !important;
        }
        
        table td, 
        table th {
          background-color: white !important;
          color: black !important;
          border-color: #ddd !important;
        }
        
        /* Otimização para impressão em uma única página */
        .grid {
          display: flex !important;
          flex-wrap: wrap !important;
        }
        
        .text-sm {
          font-size: 10px !important;
        }
        
        .text-xs {
          font-size: 9px !important;
        }
        
        .my-4, .my-6, .mb-6, .mb-8 {
          margin-top: 8px !important;
          margin-bottom: 8px !important;
        }
        
        .p-8, .p-6, .p-4 {
          padding: 10px !important;
        }
        
        .print-compact td, .print-compact th {
          padding: 2px 4px !important;
        }
        
        table td, table th {
          padding: 2px 4px !important;
        }
        
        .print-tight-margins {
          margin-top: 5px !important;
          margin-bottom: 5px !important;
        }
        
        .card-content {
          padding: 6px !important;
        }

        body > *:not(.print-container) {
          display: none !important;
        }
        
        #root > div > div:not(.print-container) {
          display: none !important;
        }
      `}
    </style>
  );
};
