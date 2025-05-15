
import { QuotationData } from "@/components/quotation/types";
import { generatePdfFromCanvas, openPdfInNewWindow } from "./pdfCore";
import html2canvas from "html2canvas";
import { prepareQuotationForPdf, restoreQuotationFromPdf, getQuotationMetadata } from "./quotationPdfPrep";

// Generate PDF for a quotation by ID
export const generateQuotationPdf = async (id: string): Promise<boolean> => {
  try {
    // Garantir que o elemento está visível no DOM
    return new Promise((resolve) => {
      setTimeout(async () => {
        const element = document.getElementById("quotation-pdf");
        if (!element) {
          console.error("Quotation PDF element not found");
          resolve(false);
          return;
        }
        
        // Prepare for PDF generation
        const prepared = prepareQuotationForPdf(id);
        if (!prepared) {
          console.error("Failed to prepare quotation for PDF generation");
          resolve(false);
          return;
        }
        
        try {
          // Generate canvas with optimized settings
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            logging: false, // Disable logging
            onclone: (document, element) => {
              // Ensure all images are loaded before rendering
              element.querySelectorAll('img').forEach(img => {
                if (!img.complete) {
                  img.onload = () => {};
                  img.src = img.src;
                }
              });
              return element;
            }
          });
          
          // Get quotation metadata
          const { title: quotationTitle, subject: quotationSubject } = getQuotationMetadata(id);
          
          // Generate PDF with optimized settings
          const pdf = generatePdfFromCanvas(canvas, {
            filename: `cotacao-frete-${id}.pdf`,
            title: quotationTitle,
            subject: quotationSubject,
            author: "FreteValor",
            creator: "FreteValor",
          });
          
          // Trigger download
          pdf.save(`cotacao-frete-${id}.pdf`);
          
          // Restore element
          restoreQuotationFromPdf();
          
          resolve(true);
        } catch (error) {
          console.error("Error in PDF generation:", error);
          restoreQuotationFromPdf();
          resolve(false);
        }
      }, 500); // Pequeno delay para garantir que o DOM está pronto
    });
  } catch (error) {
    console.error("Error generating quotation PDF:", error);
    restoreQuotationFromPdf();
    return false;
  }
};

// Preview PDF in a new window
export const previewQuotationPdf = async (quotation: QuotationData | null): Promise<boolean> => {
  if (!quotation) return false;
  
  try {
    const element = document.getElementById("quotation-pdf");
    if (!element) return false;
    
    // Generate canvas with optimized settings
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff"
    });
    
    // Generate PDF with optimized metadata
    const pdf = generatePdfFromCanvas(canvas, {
      title: `Cotação de Frete - ${quotation.originCity} para ${quotation.destinationCity}`,
      subject: `Cotação de frete de ${quotation.originCity}/${quotation.originState} para ${quotation.destinationCity}/${quotation.destinationState}`,
      author: quotation.creatorName || "FreteValor",
      creator: "FreteValor",
    });
    
    // Open in new window
    openPdfInNewWindow(pdf);
    
    return true;
  } catch (error) {
    console.error("Error previewing quotation PDF:", error);
    return false;
  }
};
