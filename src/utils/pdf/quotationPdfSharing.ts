
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
        
        // Temporary apply WhatsApp optimization styles
        const originalStyle = element.getAttribute("style") || "";
        element.setAttribute("style", `${originalStyle}; transform: scale(0.95); max-width: 100%; width: 210mm; padding: 1mm;`);
        
        // Generate canvas with optimized settings for WhatsApp sharing
        const canvas = await html2canvas(element, {
          scale: 3, // Maior DPI para melhor qualidade
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          imageTimeout: 15000, // Maior timeout para carregar imagens
          onclone: (document, element) => {
            // Ensure all images are loaded before rendering
            element.querySelectorAll('img').forEach(img => {
              if (!img.complete) {
                img.onload = () => {};
                img.src = img.src;
              }
            });
            
            // Adicionar estilo para garantir tudo em uma página
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
          quality: 0.95, // Alta qualidade
          fitToPage: true // Garantir que tudo esteja em uma página
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
