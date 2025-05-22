
import { QuotationData } from "@/components/quotation/types";
import { prepareQuotationForPdf, restoreQuotationFromPdf, getQuotationMetadata } from "./quotationPdfPrep";
import { generateFreightQuotationPdf } from "./freightQuotationPdf";
import html2canvas from "html2canvas";
import { generatePdfFromCanvas } from "./pdfCore";

/**
 * Generates and shares a quotation PDF
 * @param id The ID of the quotation to share
 * @returns A Promise that resolves to the generated PDF blob
 */
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

/**
 * Optimized version for sharing via WhatsApp or other platforms
 * Returns a Blob with optimized settings
 */
export const optimizedShareQuotationPdf = async (id: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const element = document.getElementById("quotation-pdf");
        if (!element) {
          reject(new Error("Quotation PDF element not found"));
          return;
        }
        
        // Temporary apply WhatsApp optimization styles
        const originalStyle = element.getAttribute("style") || "";
        element.setAttribute("style", `${originalStyle}; transform: scale(0.95); max-width: 100%; width: 210mm; padding: 1mm;`);
        
        // Generate canvas with optimized settings for WhatsApp sharing
        const canvas = await html2canvas(element, {
          scale: 3, // Higher DPI for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          imageTimeout: 15000, // Longer timeout for loading images
          onclone: (document, element) => {
            // Ensure all images are loaded before rendering
            element.querySelectorAll('img').forEach(img => {
              if (!img.complete) {
                img.onload = () => {};
                img.src = img.src;
              }
            });
            
            // Add style to ensure everything fits on one page
            const singlePageStyle = document.createElement('style');
            singlePageStyle.innerHTML = `
              #quotation-pdf {
                max-height: 270mm !important;
                width: 210mm !important;
                page-break-inside: avoid !important;
              }
              #quotation-pdf .no-break {
                page-break-inside: avoid !important;
              }
              #quotation-pdf * {
                page-break-inside: avoid !important;
              }
            `;
            document.head.appendChild(singlePageStyle);
            
            return element;
          }
        });
        
        // Restore original styles
        element.setAttribute("style", originalStyle);
        
        // Get quotation metadata
        const { title: quotationTitle, subject: quotationSubject } = getQuotationMetadata(id);
        
        // Generate PDF with optimized settings for WhatsApp
        const pdf = generatePdfFromCanvas(canvas, {
          title: quotationTitle,
          subject: quotationSubject,
          author: "FreteValor",
          creator: "FreteValor",
          compress: true,
          quality: 0.95, // High quality
          fitToPage: true // Ensure everything fits on one page
        });
        
        // Return the PDF as a blob
        resolve(pdf.output('blob'));
      } catch (error) {
        console.error("Error sharing optimized quotation PDF:", error);
        reject(error);
      }
    }, 500); // Small delay to ensure the DOM is ready
  });
};
