
import React from "react";
import { PrintStyles } from "@/components/common/PrintStyles";

export const PrintPreviewStyles: React.FC = () => {
  const quotationSpecificStyles = `
    #quotation-pdf {
      width: 100% !important;
      max-width: 100% !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
      border: none !important;
      page-break-inside: avoid !important;
    }
  `;
  
  return <PrintStyles additionalStyles={quotationSpecificStyles} />;
};
