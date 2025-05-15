
/**
 * PDF utility functions index - re-exports all functions from specific modules
 */

// Core PDF functions
export { generateCanvasFromElement, generatePdfFromCanvas, openPdfInNewWindow } from "./pdfCore";

// Quotation PDF functions
export { generateQuotationPdf, previewQuotationPdf, shareQuotationPdf } from "./quotationPdf";

// Freight receipt PDF functions
export { generateFreightReceiptPdf, generateMultiFreightReceiptPdf } from "./freightReceiptPdf";

// Collection order PDF functions
export { 
  generateCollectionOrderPdf, 
  prepareForPrintMode, 
  restoreFromPrintMode 
} from "./collectionOrderPdf";

// Email PDF functions
export { sendQuotationByEmail } from "./emailPdf";

// Freight Form PDF functions
export {
  generateFreightFormPdf,
  previewFreightFormPdf,
  exportFreightFormPdf
} from "./freightFormPdf";
