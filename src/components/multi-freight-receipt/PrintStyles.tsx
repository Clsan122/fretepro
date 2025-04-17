
import React from "react";

const PrintStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 15mm 10mm;
        }
        
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          background-color: white !important;
        }
        
        .print-container {
          display: block !important;
          position: relative !important;
          width: 100% !important;
          background: white !important;
          padding: 0 !important;
          margin: 0 !important;
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
          margin-bottom: 5px !important;
        }
        
        .scale-down {
          transform-origin: top left;
          transform: scale(0.95);
        }
        
        .print-table {
          width: 100% !important;
          border-collapse: collapse !important;
        }
        
        .print-table td,
        .print-table th {
          border: 1px solid #ddd !important;
          padding: 4px !important;
          font-size: 10px !important;
        }
        
        .print-small-text {
          font-size: 9px !important;
          line-height: 1.2 !important;
        }
        
        .print-tight {
          padding: 2px !important;
        }
      `}
    </style>
  );
};

export default PrintStyles;
