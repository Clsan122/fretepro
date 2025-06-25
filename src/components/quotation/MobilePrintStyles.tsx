
import React from "react";

export const MobilePrintStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        /* Configurações base para impressão mobile */
        @page {
          size: A4;
          margin: 3mm;
          scale: 0.85;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          box-sizing: border-box !important;
        }
        
        body {
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 8px !important;
          background-color: white !important;
          color: black !important;
          line-height: 1.2 !important;
          zoom: 0.8;
        }
        
        /* Container principal */
        #quotation-pdf {
          width: 100% !important;
          max-width: 100% !important;
          box-shadow: none !important;
          padding: 2mm !important;
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
        
        /* Ocultar elementos desnecessários */
        header, nav, footer, .sidebar, .bottom-navigation, button:not(.print-keep), 
        [data-radix-popper-content-wrapper], .dropdown-menu, .sheet-content {
          display: none !important;
        }
        
        /* Imagens otimizadas para mobile */
        img {
          max-width: 80px !important;
          max-height: 50px !important;
          display: block !important;
          object-fit: contain !important;
          page-break-inside: avoid !important;
        }
        
        /* Typography mobile-friendly */
        .text-lg, .text-xl, .text-2xl {
          font-size: 9px !important;
          line-height: 1.2 !important;
        }
        
        .text-base, .text-sm {
          font-size: 7px !important;
          line-height: 1.1 !important;
        }
        
        .text-xs {
          font-size: 6px !important;
          line-height: 1.1 !important;
        }
        
        /* Tabelas compactas */
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          page-break-inside: avoid !important;
          font-size: 6px !important;
          margin: 0.5mm 0 !important;
        }
        
        table td, table th {
          padding: 0.5mm 1mm !important;
          font-size: 6px !important;
          overflow-wrap: break-word !important;
          border: 0.1mm solid #ddd !important;
        }
        
        /* Layout em grid otimizado para mobile */
        .grid {
          display: grid !important;
        }
        
        .grid-cols-2 {
          grid-template-columns: 1fr 1fr !important;
          gap: 1mm !important;
        }
        
        /* Ajustes de espaçamento para mobile */
        .mb-6, .mb-8, .mb-4 {
          margin-bottom: 1mm !important;
        }
        
        .mb-3, .mb-2, .mb-1 {
          margin-bottom: 0.5mm !important;
        }
        
        .mt-8, .mt-6, .mt-4 {
          margin-top: 1mm !important;
        }
        
        .mt-3, .mt-2 {
          margin-top: 0.5mm !important;
        }
        
        .p-8, .p-6, .p-4 {
          padding: 1mm !important;
        }
        
        .p-3, .p-2 {
          padding: 0.5mm !important;
        }
        
        /* Cards e bordas */
        .border, .card {
          border: 0.1mm solid #ddd !important;
          border-radius: 0 !important;
          margin-bottom: 0.5mm !important;
        }
        
        /* Otimizações específicas para telas pequenas */
        @media screen and (max-width: 640px) {
          body {
            font-size: 7px !important;
            zoom: 0.7;
          }
          
          #quotation-pdf {
            padding: 1mm !important;
          }
          
          img {
            max-width: 60px !important;
            max-height: 40px !important;
          }
          
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
          
          table td, table th {
            padding: 0.3mm 0.5mm !important;
            font-size: 5px !important;
          }
        }
        
        /* Forçar cores para impressão */
        .bg-gradient-to-r, .bg-gradient-to-br, .bg-freight-50, .bg-freight-100, .bg-freight-700, 
        .from-freight-50, .to-freight-100, .via-freight-200 {
          background: white !important;
          color: black !important;
        }
        
        /* Evitar quebras de página indesejadas */
        .avoid-break {
          page-break-inside: avoid !important;
        }
        
        tr {
          page-break-inside: avoid !important;
        }
        
        /* Layout compacto para aproveitar melhor o espaço */
        .space-y-4 > * + * {
          margin-top: 1mm !important;
        }
        
        .space-y-2 > * + * {
          margin-top: 0.5mm !important;
        }
        
        /* Garantir que elementos críticos sejam visíveis */
        .font-bold, .font-semibold {
          font-weight: bold !important;
        }
        
        /* Remover sombras e efeitos que não imprimem bem */
        .shadow-lg, .shadow-md, .shadow {
          box-shadow: none !important;
        }
        
        .rounded-lg, .rounded {
          border-radius: 0 !important;
        }
      `}
    </style>
  );
};
