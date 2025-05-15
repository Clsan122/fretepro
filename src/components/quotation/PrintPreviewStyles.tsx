
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
          font-size: 10px !important;
          background-color: white !important;
          color: black !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        #quotation-pdf {
          width: 210mm !important;
          max-width: 100% !important;
          box-shadow: none !important;
          padding: 5mm !important;
          margin: 0 auto !important;
          border: none !important;
          page-break-inside: avoid !important;
          color: black !important;
          background-color: white !important;
        }
        
        .print-container {
          max-width: 800px !important;
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
        }
        
        /* Otimização para impressão em uma única página */
        .grid {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 4px !important;
        }
        
        .text-sm {
          font-size: 9px !important;
        }
        
        .text-xs {
          font-size: 8px !important;
        }
        
        /* Espaçamentos reduzidos para melhor aproveitamento do espaço */
        .my-4, .my-6, .mb-6, .mb-8, .mb-4, .mb-3 {
          margin-top: 3px !important;
          margin-bottom: 3px !important;
        }
        
        .p-8, .p-6, .p-4 {
          padding: 6px !important;
        }
        
        /* Tabelas mais compactas */
        .print-compact td, .print-compact th {
          padding: 1px 2px !important;
          font-size: 8px !important;
        }
        
        /* Ajuste para todas as tabelas */
        table {
          width: 100% !important;
          table-layout: fixed !important;
        }
        
        table td, table th {
          padding: 1px 2px !important;
          font-size: 8px !important;
        }
        
        .print-tight-margins {
          margin-top: 2px !important;
          margin-bottom: 2px !important;
        }
        
        .card-content {
          padding: 3px !important;
        }

        /* Esconder elementos não importantes para impressão */
        body > *:not(.print-container) {
          display: none !important;
        }
        
        #root > div > div:not(.print-container) {
          display: none !important;
        }
        
        /* Otimizações adicionais para layout de impressão */
        .print-flex {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 2px !important;
        }
        
        .print-col {
          flex: 1 1 auto !important;
          min-width: 45% !important;
        }
        
        /* Evitar quebra de página dentro de seções importantes */
        .no-break {
          page-break-inside: avoid !important;
        }
      `}
    </style>
  );
};
