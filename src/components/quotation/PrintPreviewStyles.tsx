
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
          font-size: 8px !important;
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
          padding: 2mm !important;
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
          max-height: 30px !important;
        }
        
        /* Otimização para impressão em uma única página */
        .grid {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 2px !important;
        }
        
        .text-sm {
          font-size: 7px !important;
        }
        
        .text-xs {
          font-size: 6px !important;
        }
        
        /* Espaçamentos reduzidos para melhor aproveitamento do espaço */
        .my-4, .my-6, .mb-6, .mb-8, .mb-4, .mb-3 {
          margin-top: 1px !important;
          margin-bottom: 1px !important;
        }
        
        .p-8, .p-6, .p-4 {
          padding: 3px !important;
        }
        
        /* Tabelas mais compactas */
        .print-compact td, .print-compact th {
          padding: 0px 1px !important;
          font-size: 7px !important;
        }
        
        /* Ajuste para todas as tabelas */
        table {
          width: 100% !important;
          table-layout: fixed !important;
          border-collapse: collapse !important;
        }
        
        table td, table th {
          padding: 0px 1px !important;
          font-size: 7px !important;
        }
        
        .print-tight-margins {
          margin-top: 1px !important;
          margin-bottom: 1px !important;
        }
        
        .card-content {
          padding: 2px !important;
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
          gap: 1px !important;
        }
        
        .print-col {
          flex: 1 1 auto !important;
          min-width: 45% !important;
        }
        
        /* Evitar quebra de página dentro de seções importantes */
        .no-break {
          page-break-inside: avoid !important;
        }
        
        /* Redução extrema de espaçamento */
        h1, h2, h3, p {
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1.2 !important;
        }
        
        .border-b {
          border-bottom-width: 1px !important;
        }
        
        /* Altura mínima para linhas de tabela */
        tr {
          height: auto !important;
          min-height: 8px !important;
        }
        
        /* Remover arredondamento para otimizar espaço */
        .rounded-lg, .rounded {
          border-radius: 0 !important;
        }
        
        /* Tamanho do papel A4 forçado */
        @media print {
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            overflow: hidden !important;
          }
        }
      `}
    </style>
  );
};
