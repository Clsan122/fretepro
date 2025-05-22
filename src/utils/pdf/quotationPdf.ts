
/**
 * Re-export all quotation PDF functionality for backward compatibility
 */
import { prepareQuotationForPdf, restoreQuotationFromPdf } from "./quotationPdfPrep";
import { 
  generateFreightQuotationPdf, 
  shareFreightQuotationPdf,
  previewFreightQuotationPdf 
} from "./freightQuotationPdf";
import { QuotationData } from "@/components/quotation/types";

// Re-export all functions using the new implementations
export const generateQuotationPdf = async (id: string): Promise<boolean> => {
  try {
    // Get the quotation data from the element's data 
    const quotationElement = document.getElementById("quotation-pdf");
    if (!quotationElement) {
      return false;
    }

    // Generate the PDF with the new format
    const quotationData = prepareQuotationForPdf(id);
    if (!quotationData) {
      return false;
    }

    await generateFreightQuotationPdf("quotation-pdf", quotationData, {
      savePdf: true
    });
    
    // Restore the original state
    restoreQuotationFromPdf();
    return true;
  } catch (error) {
    console.error("Error generating quotation PDF:", error);
    restoreQuotationFromPdf();
    return false;
  }
};

export const previewQuotationPdf = async (quotation: QuotationData | null): Promise<boolean> => {
  if (!quotation) return false;
  return previewFreightQuotationPdf(quotation);
};

export const shareQuotationPdf = async (id: string): Promise<Blob> => {
  // Get quotation data
  const quotationData = prepareQuotationForPdf(id);
  if (!quotationData) {
    throw new Error("Quotation not found");
  }

  try {
    // Generate the PDF
    const pdfBlob = await generateFreightQuotationPdf("quotation-pdf", quotationData);
    
    // Restore the original state
    restoreQuotationFromPdf();
    
    return pdfBlob;
  } catch (error) {
    console.error("Error sharing quotation PDF:", error);
    restoreQuotationFromPdf();
    throw error;
  }
};

// Re-export for backward compatibility
export {
  prepareQuotationForPdf,
  restoreQuotationFromPdf
};
