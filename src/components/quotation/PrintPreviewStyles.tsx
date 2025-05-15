
import React from "react";

export const PrintPreviewStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 8mm;
          scale: 0.9;
        }
        
        body {
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 10px !important;
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
          padding: 4mm !important;
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
        
        /* Otimização para impressão em uma única página */
        .grid {
          display: flex !important;
          flex-wrap: wrap !important;
        }
        
        .text-sm {
          font-size: 9px !important;
        }
        
        .text-xs {
          font-size: 8px !important;
        }
        
        .my-4, .my-6, .mb-6, .mb-8, .mb-4, .mb-3 {
          margin-top: 4px !important;
          margin-bottom: 4px !important;
        }
        
        .p-8, .p-6, .p-4 {
          padding: 8px !important;
        }
        
        .print-compact td, .print-compact th {
          padding: 1px 3px !important;
        }
        
        table td, table th {
          padding: 1px 3px !important;
        }
        
        .print-tight-margins {
          margin-top: 3px !important;
          margin-bottom: 3px !important;
        }
        
        .card-content {
          padding: 4px !important;
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
