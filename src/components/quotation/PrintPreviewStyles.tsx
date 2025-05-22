
import React from "react";

export const PrintPreviewStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 5mm;
          scale: 0.90;
        }
        
        body {
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 9px !important;
          background-color: white !important;
          color: black !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          zoom: 0.85;
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
          max-width: 120px !important;
          max-height: 70px !important;
          display: block !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          page-break-inside: avoid !important;
          object-fit: contain !important;
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
          font-size: 8px !important;
        }
        
        table td, table th {
          padding: 1mm 2mm !important;
          font-size: 8px !important;
          overflow-wrap: break-word !important;
        }
        
        tr {
          page-break-inside: avoid !important;
        }
        
        /* Otimizações para ajuste de página */
        .mb-6, .mb-8, .mb-4 {
          margin-bottom: 2mm !important;
        }
        
        .mb-3 {
          margin-bottom: 1.5mm !important;
        }
        
        .mb-2, .mb-1 {
          margin-bottom: 1mm !important;
        }
        
        .mt-8, .mt-6, .mt-4 {
          margin-top: 2mm !important;
        }
        
        .mt-3, .mt-2 {
          margin-top: 1.5mm !important;
        }
        
        .p-8, .p-6, .p-4 {
          padding: 2mm !important;
        }
        
        .p-3, .p-2 {
          padding: 1mm !important;
        }
        
        .py-3, .py-2, .py-1 {
          padding-top: 1mm !important;
          padding-bottom: 1mm !important;
        }
        
        .px-4, .px-3, .px-2 {
          padding-left: 1.5mm !important;
          padding-right: 1.5mm !important;
        }
        
        .text-lg, .text-xl, .text-2xl {
          font-size: 11px !important;
        }
        
        .text-base, .text-sm {
          font-size: 9px !important;
        }
        
        .text-xs {
          font-size: 8px !important;
        }
        
        /* Otimizações para layout de grid */
        .grid {
          display: grid !important;
        }
        
        .grid-cols-2 {
          grid-template-columns: 1fr 1fr !important;
        }
        
        .gap-4, .gap-3 {
          gap: 2mm !important;
        }
        
        .gap-2, .gap-1 {
          gap: 1mm !important;
        }
        
        /* Otimizações para telas pequenas/mobile */
        @media screen and (max-width: 640px) {
          body {
            font-size: 8px !important;
            zoom: 0.8;
          }
          
          #quotation-pdf {
            padding: 2mm !important;
          }
          
          img {
            max-width: 100px !important;
            max-height: 60px !important;
          }
          
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
          
          table td, table th {
            padding: 0.5mm 1mm !important;
            font-size: 7px !important;
          }
        }
      `}
    </style>
  );
};

