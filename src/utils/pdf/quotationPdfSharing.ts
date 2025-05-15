
import html2canvas from "html2canvas";
import { generatePdfFromCanvas } from "./pdfCore";
import { getQuotationMetadata } from "./quotationPdfPrep";

// Share quotation PDF - returns a Blob
export const shareQuotationPdf = async (id: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const element = document.getElementById("quotation-pdf");
        if (!element) {
          reject(new Error("Quotation PDF element not found"));
          return;
        }
        
        // Generate canvas with optimized settings
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
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
          title: quotationTitle,
          subject: quotationSubject,
          author: "FreteValor",
          creator: "FreteValor",
        });
        
        // Return the PDF as a blob
        resolve(pdf.output('blob'));
      } catch (error) {
        console.error("Error sharing quotation PDF:", error);
        reject(error);
      }
    }, 500); // Pequeno delay para garantir que o DOM está pronto
  });
};
