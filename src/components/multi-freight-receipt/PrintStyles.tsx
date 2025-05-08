
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
          padding: 0 !important;
        }
        
        .scale-down {
          transform-origin: top left;
          transform: scale(0.9);
        }
        
        .print-table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 9px !important;
          margin-bottom: 5px !important;
        }
        
        .print-table td,
        .print-table th {
          border: 1px solid #ddd !important;
          padding: 2px !important;
          font-size: 8px !important;
        }
        
        .print-small-text {
          font-size: 8px !important;
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
        
        /* Reduções específicas para garantir que tudo fique em uma página */
        h1 {
          font-size: 16px !important;
          margin-top: 0 !important;
          margin-bottom: 4px !important;
        }
        
        h2 {
          font-size: 12px !important;
          margin-top: 0 !important;
          margin-bottom: 3px !important;
        }
        
        p {
          margin-top: 0 !important;
          margin-bottom: 2px !important;
        }
        
        .mt-8 {
          margin-top: 0.5rem !important;
        }
        
        .pt-3, .pt-4, .pt-6 {
          padding-top: 0.25rem !important;
        }
        
        .mb-3, .mb-4 {
          margin-bottom: 0.25rem !important;
        }
      `}
    </style>
  );
};

export default PrintStyles;
