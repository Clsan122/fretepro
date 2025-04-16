
import React from "react";

export const PrintStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 15mm 10mm;
        }
        
        body {
          font-size: 12px;
          background-color: white !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .card-compact .card-header {
          padding: 12px;
        }
        
        .card-compact .card-content {
          padding: 12px;
        }
        
        .print-no-margin {
          margin: 0 !important;
        }
        
        .print-small-text {
          font-size: 11px !important;
        }
        
        .print-smaller-text {
          font-size: 10px !important;
        }
        
        .print-compact-grid {
          gap: 8px !important;
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
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        #collection-order-print {
          width: 210mm;
          max-width: 100%;
          box-shadow: none !important;
          padding: 5mm !important;
          margin: 0 auto !important;
          border: none !important;
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
        }
        
        table td, table th {
          border: 1px solid #ddd !important;
          padding: 4px !important;
        }
        
        img {
          max-width: 100% !important;
        }
        
        .divider {
          margin: 5px 0 !important;
          border-color: #ddd !important;
        }
        
        * {
          box-shadow: none !important;
        }
      `}
    </style>
  );
};
