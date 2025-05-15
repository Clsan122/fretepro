
import React from "react";

interface PrintStylesProps {
  selector?: string;
  additionalStyles?: string;
}

export const PrintStyles: React.FC<PrintStylesProps> = ({ 
  selector = "body",
  additionalStyles = ""
}) => {
  return (
    <style type="text/css" media="print">
      {`
        @page {
          size: A4;
          margin: 10mm;
        }
        
        ${selector} {
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 11px !important;
          line-height: 1.2 !important;
          background-color: white !important;
          color: black !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .print-container {
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        header, nav, footer, .sidebar, .bottom-navigation, button, 
        [data-radix-popper-content-wrapper], .dropdown-menu {
          display: none !important;
        }
        
        img {
          max-width: 100% !important;
          max-height: 30px !important;
        }
        
        /* Espaçamentos reduzidos */
        .p-8, .p-6, .p-4, .p-2 {
          padding: 2mm !important;
        }
        
        .m-8, .m-6, .m-4, .m-2,
        .mt-8, .mt-6, .mt-4, .mt-2,
        .mb-8, .mb-6, .mb-4, .mb-2 {
          margin: 1mm !important;
        }
        
        .mb-1, .my-1, .m-1 {
          margin-bottom: 1mm !important;
        }
        
        .mt-1, .my-1 {
          margin-top: 1mm !important;
        }
        
        /* Tabelas mais legíveis */
        table {
          width: 100% !important;
          table-layout: fixed !important;
          border-collapse: collapse !important;
        }
        
        table td, table th {
          padding: 1mm 2mm !important;
          font-size: 10px !important;
        }
        
        th {
          font-weight: bold !important;
          background-color: #f5f5f5 !important;
        }
        
        /* Textos */
        h1 {
          font-size: 16px !important;
          margin-bottom: 2mm !important;
        }
        
        h2 {
          font-size: 14px !important;
          margin-bottom: 1mm !important;
        }
        
        h3 {
          font-size: 12px !important;
          margin-bottom: 1mm !important;
        }
        
        p, td, th, div {
          font-size: 10px !important;
        }
        
        .text-sm {
          font-size: 10px !important;
        }
        
        .text-xs {
          font-size: 9px !important;
        }
        
        /* Bordas e fundos */
        .border, .border-b, .border-t {
          border-width: 0.5px !important;
          border-color: #cccccc !important;
        }
        
        .bg-freight-50 {
          background-color: #f8f9fc !important;
        }
        
        .bg-freight-100 {
          background-color: #f1f3f9 !important;
        }
        
        .bg-freight-700 {
          background-color: #4a5568 !important;
          color: white !important;
        }
        
        /* Evitar quebra de página dentro de seções importantes */
        .mb-2, .mb-4, .mb-6 {
          page-break-after: avoid !important;
        }
        
        table, tr, td, th, thead, tbody {
          page-break-inside: avoid !important;
        }
        
        /* Garantir que todas as cores apareçam na impressão */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        ${additionalStyles}
      `}
    </style>
  );
};
