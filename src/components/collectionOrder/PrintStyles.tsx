
import React from "react";

export const PrintStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 10mm;
        }
        body {
          font-size: 12px;
          background-color: white !important;
          -webkit-print-color-adjust: exact !important;
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
        
        /* Hides all elements except the print container */
        body > *:not(.print-container) {
          display: none !important;
        }
        
        header, nav, footer, .sidebar, .bottom-navigation {
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
          width: 100%;
          max-width: 100%;
          box-shadow: none !important;
          padding: 5mm !important;
          margin: 0 !important;
          background-color: white !important;
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
        
        /* Ajustes para impressão A4 */
        .print-container {
          width: 210mm !important;
          min-height: 297mm !important;
        }
        
        /* Scale to fit on one page */
        #collection-order-print {
          transform-origin: top center;
          position: relative;
          page-break-after: always;
        }
      `}
    </style>
  );
};
