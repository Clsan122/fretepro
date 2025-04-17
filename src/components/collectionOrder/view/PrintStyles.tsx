
import React from "react";

export const PrintStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 10mm;
          scale: 0.95;
        }
        
        body {
          font-size: 11px !important;
          background-color: white !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .card-compact .card-header {
          padding: 8px !important;
        }
        
        .card-compact .card-content {
          padding: 8px !important;
        }
        
        .print-no-margin {
          margin: 0 !important;
        }
        
        .print-small-text {
          font-size: 10px !important;
        }
        
        .print-smaller-text {
          font-size: 9px !important;
        }
        
        .print-compact-grid {
          gap: 4px !important;
        }
        
        .print-hidden {
          display: none !important;
        }
        
        body > *:not(.print-container) {
          display: none !important;
        }
        
        header, nav, footer, .sidebar, .bottom-navigation, button, 
        [data-radix-popper-content-wrapper], .dropdown-menu {
          display: none !important;
        }
        
        .print-container {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          page-break-inside: avoid !important;
        }
        
        #collection-order-print {
          width: 210mm !important;
          max-width: 100% !important;
          box-shadow: none !important;
          padding: 5mm !important;
          margin: 0 auto !important;
          border: none !important;
          page-break-inside: avoid !important;
        }
        
        .layout-main {
          padding: 0 !important;
          background: none !important;
        }
        
        #root > div > div:not(.print-container) {
          display: none !important;
        }
        
        #root {
          padding: 0 !important;
          margin: 0 !important;
          background: white !important;
        }
        
        .whitespace-pre-wrap {
          white-space: pre-wrap !important;
        }
        
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 10px !important;
        }
        
        table td, table th {
          border: 1px solid #ddd !important;
          padding: 3px !important;
          font-size: 9px !important;
        }
        
        img {
          max-width: 100% !important;
          display: block !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          page-break-inside: avoid !important;
        }
        
        .divider {
          margin: 3px 0 !important;
          border-color: #ddd !important;
        }
        
        * {
          box-shadow: none !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      `}
    </style>
  );
};
