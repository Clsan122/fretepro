
import React from "react";

const PrintStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 5mm;
          scale: 0.90;
        }
        
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          background-color: white !important;
          color: black !important;
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 8px !important;
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
          margin-bottom: 1px !important;
        }
        
        .scale-down {
          transform-origin: top left;
          transform: scale(0.95);
        }
        
        .print-table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 7px !important;
          table-layout: fixed !important;
        }
        
        .print-table td,
        .print-table th {
          border: 1px solid #ddd !important;
          padding: 1px !important;
          font-size: 6px !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }
        
        .print-small-text {
          font-size: 6px !important;
          line-height: 1 !important;
        }
        
        .print-tight {
          padding: 1px !important;
        }

        img {
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          display: block !important;
          max-width: 100% !important;
          page-break-inside: avoid !important;
          max-height: 30px !important;
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
        
        .dark .card,
        .dark .border,
        .dark .bg-muted,
        .dark .bg-card {
          background-color: white !important;
          color: black !important; 
        }

        .dark .text-white,
        .dark .text-foreground {
          color: black !important;
        }
        
        /* Force light backgrounds */
        .bg-background, .bg-card, .bg-muted, .bg-popover, .bg-accent {
          background-color: white !important;
        }
        
        .text-foreground, .text-muted-foreground, .text-accent-foreground {
          color: black !important;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .pdf-generation-mode {
          width: 800px !important;
        }
        
        /* Melhorias no layout da tabela */
        table thead th {
          font-weight: bold !important;
          background-color: #f5f5f5 !important;
        }
        
        /* Melhorias no layout geral */
        .card, .border {
          border: 1px solid #ddd !important;
          margin-bottom: 1px !important;
        }
        
        .p-6, .p-4, .p-3 {
          padding: 1px !important;
        }
        
        /* Reduzir espaçamento entre linhas */
        p, h1, h2, h3, h4, h5, h6 {
          margin: 0 !important;
          margin-bottom: 1px !important;
          padding: 0 !important;
          line-height: 1.1 !important;
        }
        
        /* Garantir que elementos não quebrem entre páginas */
        .avoid-break {
          page-break-inside: avoid !important;
        }
        
        /* Remover arredondamento para otimizar espaço */
        .rounded-lg, .rounded {
          border-radius: 0 !important;
        }
        
        /* Força tamanho A4 */
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

export default PrintStyles;
