
import React from "react";

export const PrintPreviewStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 3mm;
          scale: 0.85;
        }
        
        body {
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 6px !important;
          background-color: white !important;
          color: black !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        #quotation-pdf {
          width: 210mm !important;
          height: 297mm !important;
          max-width: 100% !important;
          box-shadow: none !important;
          padding: 1mm !important;
          margin: 0 auto !important;
          border: none !important;
          page-break-inside: avoid !important;
          color: black !important;
          background-color: white !important;
          overflow: hidden !important;
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
          max-height: 20px !important;
        }
        
        /* Otimização para impressão em uma única página */
        .grid {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 1px !important;
        }
        
        .text-sm {
          font-size: 5px !important;
        }
        
        .text-xs {
          font-size: 4px !important;
        }
        
        /* Espaçamentos reduzidos para melhor aproveitamento do espaço */
        .my-4, .my-6, .mb-6, .mb-8, .mb-4, .mb-3 {
          margin-top: 0.5px !important;
          margin-bottom: 0.5px !important;
        }
        
        .p-8, .p-6, .p-4 {
          padding: 1px !important;
        }
        
        /* Tabelas mais compactas */
        .print-compact td, .print-compact th {
          padding: 0 !important;
          font-size: 5px !important;
        }
        
        /* Ajuste para todas as tabelas */
        table {
          width: 100% !important;
          table-layout: fixed !important;
          border-collapse: collapse !important;
        }
        
        table td, table th {
          padding: 0 !important;
          font-size: 5px !important;
        }
        
        .print-tight-margins {
          margin-top: 0.5px !important;
          margin-bottom: 0.5px !important;
        }
        
        .card-content {
          padding: 1px !important;
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
          gap: 0.5px !important;
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
          line-height: 1.1 !important;
        }
        
        .border-b {
          border-bottom-width: 0.5px !important;
        }
        
        /* Altura mínima para linhas de tabela */
        tr {
          height: auto !important;
          min-height: 5px !important;
        }
        
        /* Remover arredondamento para otimizar espaço */
        .rounded-lg, .rounded {
          border-radius: 0 !important;
        }
        
        /* WhatsApp otimização */
        .mb-1, .mb-2, .mb-3 {
          margin-bottom: 0.5px !important;
        }
        
        .mt-1, .mt-2, .mt-3 {
          margin-top: 0.5px !important;
        }
        
        .py-1, .py-2, .py-3 {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
        
        .px-1, .px-2, .px-3 {
          padding-left: 0.5px !important;
          padding-right: 0.5px !important;
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
