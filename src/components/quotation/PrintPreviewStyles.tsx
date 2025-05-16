
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
        
        /* Otimização para impressão em uma única página */
        .grid {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 5px !important;
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
            font-size: 8px !important;
          }
          
          .grid {
            display: block !important;
          }
          
          .grid-cols-2 {
            display: block !important;
          }
          
          .grid > div {
            margin-bottom: 5px !important;
            width: 100% !important;
          }
          
          table {
            width: 100% !important;
            table-layout: fixed !important;
            font-size: 8px !important;
          }
          
          table td, table th {
            padding: 2px !important;
            word-break: break-word !important;
            white-space: normal !important;
          }
        }
        
        .text-sm {
          font-size: 10px !important;
        }
        
        .text-xs {
          font-size: 9px !important;
        }
        
        /* Espaçamentos adequados para melhor aproveitamento do espaço */
        .my-4, .my-6, .mb-6, .mb-8, .mb-4, .mb-3 {
          margin-top: 3mm !important;
          margin-bottom: 3mm !important;
        }
        
        .p-8, .p-6, .p-4 {
          padding: 3mm !important;
        }
        
        /* Tabelas mais adequadas para tamanho A4 */
        .print-compact td, .print-compact th {
          padding: 2mm !important;
          font-size: 11px !important;
        }
        
        /* Ajuste para todas as tabelas */
        table {
          width: 100% !important;
          table-layout: fixed !important;
          border-collapse: collapse !important;
        }
        
        table td, table th {
          padding: 2mm !important;
          font-size: 11px !important;
          overflow-wrap: break-word !important;
        }
        
        .print-tight-margins {
          margin-top: 3mm !important;
          margin-bottom: 3mm !important;
        }
        
        .card-content {
          padding: 3mm !important;
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
          gap: 2mm !important;
        }
        
        .print-col {
          flex: 1 1 auto !important;
          min-width: 45% !important;
        }
        
        /* Evitar quebra de página dentro de seções importantes */
        .no-break {
          page-break-inside: avoid !important;
        }
        
        /* Altura mínima para linhas de tabela */
        tr {
          height: auto !important;
          min-height: 6mm !important;
        }
        
        /* Otimizações para mobile */
        .mb-1, .mb-2, .mb-3 {
          margin-bottom: 2mm !important;
        }
        
        .mt-1, .mt-2, .mt-3 {
          margin-top: 2mm !important;
        }
        
        .py-1, .py-2, .py-3 {
          padding-top: 1mm !important;
          padding-bottom: 1mm !important;
        }
        
        .px-1, .px-2, .px-3 {
          padding-left: 2mm !important;
          padding-right: 2mm !important;
        }
        
        /* Forçar width apropriado em mobile */
        @media only screen and (max-width: 640px) {
          .print-container, #quotation-pdf {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 5px !important;
          }
          
          .text-sm, .text-xs {
            font-size: 8px !important;
          }
          
          .p-3, .p-4, .px-3, .py-2 {
            padding: 2px !important;
          }
          
          .space-y-1 > * + * {
            margin-top: 2px !important;
          }
          
          .space-y-2 > * + * {
            margin-top: 4px !important;
          }
          
          .mb-2, .mb-4 {
            margin-bottom: 4px !important;
          }
          
          /* Ajustar layout para ser single column em mobile */
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}
    </style>
  );
};
