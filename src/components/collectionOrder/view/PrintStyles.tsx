
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
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 10px !important;
          background-color: white !important;
          color: black !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .print-container {
          max-width: 800px !important;
          margin: 0 auto !important;
          padding: 0 !important;
          background-color: white !important;
          color: black !important;
        }
        
        .card-compact .card-header {
          padding: 4px !important;
        }
        
        .card-compact .card-content {
          padding: 4px !important;
        }
        
        .print-no-margin {
          margin: 0 !important;
        }
        
        .print-small-text {
          font-size: 9px !important;
        }
        
        .print-smaller-text {
          font-size: 8px !important;
        }
        
        .print-compact-grid {
          gap: 2px !important;
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
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 10px !important;
          background-color: white !important;
          color: black !important;
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
        
        /* Cards in dark mode should be white for printing */
        .dark .card, 
        .dark [class*="bg-gray-"], 
        .dark [class*="bg-slate-"] {
          background-color: white !important;
          color: black !important;
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
          font-size: 9px !important;
          background-color: white !important;
          color: black !important;
          table-layout: fixed !important;
        }
        
        table td, table th {
          border: 1px solid #ddd !important;
          padding: 2px !important;
          font-size: 8px !important;
          background-color: white !important;
          color: black !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
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
          margin: 2px 0 !important;
          border-color: #ddd !important;
        }
        
        * {
          box-shadow: none !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Novas classes para melhorar a organização na impressão */
        .print-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 2px !important;
        }
        
        .print-section {
          page-break-inside: avoid !important;
          margin-bottom: 3px !important;
        }
        
        /* Reduzir espaçamentos gerais */
        .p-6, .p-4, .p-3 {
          padding: 2px !important;
        }
        
        .m-6, .m-4, .m-3, .my-6, .my-4, .my-3, .mb-6, .mb-4, .mb-3 {
          margin: 2px !important;
        }
      `}
    </style>
  );
};
