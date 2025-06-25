
import React from 'react';

export const MobilePrintStyles: React.FC = () => {
  return (
    <style type="text/css" media="print">
      {`
        /* Reset e configurações base para mobile */
        @page {
          size: A4;
          margin: 2mm;
          scale: 0.85;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          box-sizing: border-box !important;
        }
        
        body {
          font-size: 7px !important;
          line-height: 1.1 !important;
          color: black !important;
          background: white !important;
          font-family: Arial, sans-serif !important;
          zoom: 0.8;
        }
        
        /* Container principal */
        #collection-order-print {
          padding: 1mm !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: 210mm !important;
          background: white !important;
          page-break-inside: avoid !important;
          overflow: hidden !important;
        }
        
        /* Ocultar elementos não necessários */
        .print-exclude, 
        header, 
        nav, 
        footer, 
        .bottom-navigation,
        button:not(.print-keep),
        .dropdown-menu,
        .sheet-content {
          display: none !important;
        }
        
        /* Imagens */
        img {
          max-height: 12mm !important;
          max-width: 100% !important;
          object-fit: contain !important;
          display: block !important;
        }
        
        /* Typography mobile-optimized */
        h1, h2 {
          font-size: 10px !important;
          margin: 0.5mm 0 !important;
          font-weight: bold !important;
        }
        
        h3 {
          font-size: 8px !important;
          margin: 0.3mm 0 !important;
          font-weight: 600 !important;
        }
        
        p, div, span {
          font-size: 7px !important;
          line-height: 1.1 !important;
          margin: 0 !important;
        }
        
        /* Layout compacto para mobile */
        .space-y-1 > * + * {
          margin-top: 0.5mm !important;
        }
        
        .space-y-2 > * + * {
          margin-top: 0.7mm !important;
        }
        
        /* Cards e containers */
        .card, .border {
          border: 0.1mm solid #ddd !important;
          margin-bottom: 0.5mm !important;
          padding: 0.5mm !important;
          border-radius: 0 !important;
          background: white !important;
          page-break-inside: avoid !important;
        }
        
        /* Grid layout otimizado para mobile */
        .grid {
          display: grid !important;
        }
        
        .grid-cols-2 {
          grid-template-columns: 1fr 1fr !important;
          gap: 0.5mm !important;
        }
        
        .grid-cols-3 {
          grid-template-columns: 1fr 1fr 1fr !important;
          gap: 0.3mm !important;
        }
        
        .grid-cols-4 {
          grid-template-columns: 1fr 1fr 1fr 1fr !important;
          gap: 0.3mm !important;
        }
        
        /* Tabelas compactas */
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 6px !important;
          margin: 0.5mm 0 !important;
        }
        
        td, th {
          padding: 0.3mm !important;
          border: 0.1mm solid #ddd !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
        
        /* Assinaturas compactas */
        .border-t {
          border-top: 0.2mm solid black !important;
          margin-top: 2mm !important;
          padding-top: 1mm !important;
        }
        
        /* Remover espaçamentos desnecessários */
        .mb-6, .mb-4, .mb-3, .mb-2 {
          margin-bottom: 0.5mm !important;
        }
        
        .mt-6, .mt-4, .mt-3, .mt-2 {
          margin-top: 0.5mm !important;
        }
        
        .p-6, .p-4, .p-3, .p-2 {
          padding: 0.5mm !important;
        }
        
        /* Mobile-specific: força layout em uma página */
        @media screen and (max-width: 768px) {
          body {
            font-size: 6px !important;
            zoom: 0.7;
          }
          
          #collection-order-print {
            max-height: 270mm !important;
            overflow: hidden !important;
          }
          
          .card {
            padding: 0.3mm !important;
            margin-bottom: 0.3mm !important;
          }
          
          img {
            max-height: 10mm !important;
          }
        }
        
        /* Forçar quebra de página se necessário */
        .page-break {
          page-break-before: always !important;
        }
        
        .avoid-break {
          page-break-inside: avoid !important;
        }
        
        /* Headers com ícones compactos */
        .flex.items-center.gap-1 {
          display: flex !important;
          align-items: center !important;
          gap: 0.2mm !important;
        }
        
        .h-3.w-3, .h-2.w-2 {
          width: 2mm !important;
          height: 2mm !important;
        }
        
        /* Otimização final para mobile printing */
        @media print and (max-width: 480px) {
          body {
            zoom: 0.6 !important;
          }
          
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
          
          .hidden.md\\:table-cell {
            display: none !important;
          }
        }
      `}
    </style>
  );
};
