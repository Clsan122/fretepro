
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
          width: 100% !important;
          max-width: 100% !important;
          box-shadow: none !important;
          padding: 5mm !important;
          margin: 0 auto !important;
          border: none !important;
          page-break-inside: avoid !important;
          color: black !important;
          background-color: white !important;
          overflow: hidden !important;
        }
        
        .print-container {
          max-width: 100% !important;
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
          max-height: 40px !important;
        }
        
        /* Garantir que gradientes e cores de fundo sejam impressos */
        .bg-gradient-to-r, .bg-gradient-to-br, .bg-freight-50, .bg-freight-100, .bg-freight-700, 
        .from-freight-50, .to-freight-100, .via-freight-200 {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Ajustes específicos para tabelas */
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          page-break-inside: avoid !important;
        }
        
        table td, table th {
          padding: 2mm 3mm !important;
          font-size: 11px !important;
          overflow-wrap: break-word !important;
        }
        
        tr {
          page-break-inside: avoid !important;
        }
        
        /* Otimizações para ajuste de página */
        .mb-6, .mb-8, .mb-4 {
          margin-bottom: 4mm !important;
        }
        
        .mt-8, .mt-6, .mt-4 {
          margin-top: 4mm !important;
        }
        
        .text-lg, .text-xl, .text-2xl {
          font-size: 14px !important;
        }
        
        .text-base {
          font-size: 12px !important;
        }
        
        .text-sm {
          font-size: 10px !important;
        }
        
        .text-xs {
          font-size: 9px !important;
        }
        
        /* Otimizações para layout de grid */
        .grid {
          display: grid !important;
        }
        
        .grid-cols-2 {
          grid-template-columns: 1fr 1fr !important;
        }
        
        /* Otimizações para telas pequenas/mobile */
        @media screen and (max-width: 640px) {
          body {
            font-size: 10px !important;
          }
          
          #quotation-pdf {
            padding: 2mm !important;
          }
          
          img {
            max-height: 30px !important;
          }
          
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
          
          table td, table th {
            padding: 1mm 2mm !important;
            font-size: 8px !important;
          }
          
          .mb-6, .mb-4 {
            margin-bottom: 2mm !important;
          }
          
          .mt-8, .mt-6, .mt-4 {
            margin-top: 2mm !important;
          }
        }
      `}
    </style>
  );
};
