
import React from "react";

const PrintStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 10mm;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        th, td {
          padding: 3px !important;
          font-size: 10px !important;
        }
        h1, h2 {
          margin-bottom: 5px !important;
          font-size: 16px !important;
        }
        .print-compact {
          margin-bottom: 5px !important;
        }
        .print-table {
          font-size: 9px !important;
        }
        .print-hidden {
          display: none !important;
        }
        .print-small-text {
          font-size: 8px !important;
          line-height: 1.2 !important;
        }
        .print-tight {
          padding-top: 2px !important;
          padding-bottom: 2px !important;
        }
        .scale-down {
          transform: scale(0.95);
          transform-origin: top left;
        }
      `}
    </style>
  );
};

export default PrintStyles;
