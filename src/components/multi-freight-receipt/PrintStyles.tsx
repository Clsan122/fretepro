
import React from "react";

const PrintStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 10mm;
          scale: 0.95;
        }
        
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          background-color: white !important;
        }
        
        .print-container {
          display: block !important;
          position: relative !important;
          width: 100% !important;
          background: white !important;
          padding: 0 !important;
          margin: 0 !important;
          page-break-inside: avoid !important;
        }
        
        .print-exclude, 
        header, 
        nav, 
        footer, 
        .bottom-navigation, 
        button,
        .dropdown-menu {
          display: none !important;
        }
        
        .print-compact {
          margin-bottom: 3px !important;
        }
        
        .scale-down {
          transform-origin: top left;
          transform: scale(0.9);
        }
        
        .print-table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 10px !important;
        }
        
        .print-table td,
        .print-table th {
          border: 1px solid #ddd !important;
          padding: 3px !important;
          font-size: 9px !important;
        }
        
        .print-small-text {
          font-size: 9px !important;
          line-height: 1.1 !important;
        }
        
        .print-tight {
          padding: 2px !important;
        }

        img {
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          display: block !important;
          max-width: 100% !important;
          page-break-inside: avoid !important;
        }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .pdf-generation-mode {
          width: 800px !important;
        }
      `}
    </style>
  );
};

export default PrintStyles;
