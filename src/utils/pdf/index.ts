
/**
 * PDF utility functions index - re-exports all functions from specific modules
 */

// Core PDF functions
export { generateCanvasFromElement, generatePdfFromCanvas, openPdfInNewWindow } from "./pdfCore";

// Quotation PDF functions
export { 
  generateQuotationPdf, 
  previewQuotationPdf, 
  shareQuotationPdf,
  prepareQuotationForPdf,
  restoreQuotationFromPdf,
  prepareForPrintMode,
  restoreFromPrintMode,
  shareQuotationPdfOptimized
} from "./quotationPdf";

// Freight receipt PDF functions
export { generateFreightReceiptPdf, generateMultiFreightReceiptPdf } from "./freightReceiptPdf";

// Collection order PDF functions
export { 
  generateCollectionOrderPdf,
  prepareForPrintMode as prepareOrderForPrintMode,
  restoreFromPrintMode as restoreOrderFromPrintMode,
  generateOrderHtmlPreview
} from "./collectionOrderPdf";

// Email PDF functions
export { sendQuotationByEmail } from "./emailPdf";

// Freight Form PDF functions
export {
  generateFreightFormPdf
} from "./freightFormPdf";
