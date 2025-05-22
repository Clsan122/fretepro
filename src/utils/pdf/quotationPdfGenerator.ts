
import { QuotationData } from "@/components/quotation/types";
import { prepareQuotationForPdf, restoreQuotationFromPdf } from "./quotationPdfPrep";
import { generateFreightQuotationPdf } from "./freightQuotationPdf";

/**
 * Generates a PDF for a quotation
 * @param id The ID of the quotation to generate a PDF for
 * @returns A Promise that resolves to true if the PDF was generated successfully
 */
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
