
/**
 * Re-export all quotation PDF functionality for backward compatibility
 */
import React from "react";
import { 
  prepareQuotationForPdf as prepForPdf, 
  restoreQuotationFromPdf as restoreFromPdf,
  prepareForPrintMode,
  restoreFromPrintMode
} from "./quotationPdfPrep";

import { generateQuotationPdf } from "./quotationPdfGenerator";
import { previewQuotationPdf } from "./quotationPdfPreview";
import { shareQuotationPdf, optimizedShareQuotationPdf } from "./quotationPdfSharing";
import { QuotationData } from "@/components/quotation/types";

// Re-export all functions to maintain backward compatibility
export {
  generateQuotationPdf,
  previewQuotationPdf,
  shareQuotationPdf,
  prepForPdf as prepareQuotationForPdf,
  restoreFromPdf as restoreQuotationFromPdf,
  prepareForPrintMode,
  restoreFromPrintMode
};

// For backward compatibility, we can also export the optimized sharing function
// under a different name
export const shareQuotationPdfOptimized = optimizedShareQuotationPdf;
