
import { QuotationData } from "@/components/quotation/types";
import { generatePdfFromCanvas, openPdfInNewWindow } from "./pdfCore";
import html2canvas from "html2canvas";

// Prepare quotation for printing
export const prepareQuotationForPdf = (id: string) => {
  const container = document.getElementById("quotation-pdf");
  if (!container) return false;
  
  container.classList.add('print-mode');
  return true;
};

// Restore after printing
export const restoreQuotationFromPdf = () => {
  const container = document.getElementById("quotation-pdf");
  if (!container) return;
  
  container.classList.remove('print-mode');
};

// Generate PDF for a quotation by ID
export const generateQuotationPdf = async (id: string): Promise<boolean> => {
  try {
    // Garantir que o elemento está visível no DOM
    setTimeout(async () => {
      const element = document.getElementById("quotation-pdf");
      if (!element) {
        console.error("Quotation PDF element not found");
        return false;
      }
      
      // Prepare for PDF generation
      const prepared = prepareQuotationForPdf(id);
      if (!prepared) {
        console.error("Failed to prepare quotation for PDF generation");
        return false;
      }
      
      // Generate canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: true, // Enable logging for debug
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
      
      // Get quotation data for metadata
      let quotationTitle = "Cotação de Frete";
      let quotationSubject = "Cotação de Serviço de Transporte";
      
      try {
        const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
        const quotation = storedQuotations.find((q: any) => q.id === id);
        
        if (quotation) {
          quotationTitle = `Cotação de Frete - ${quotation.originCity} para ${quotation.destinationCity}`;
          quotationSubject = `Cotação de frete de ${quotation.originCity}/${quotation.originState} para ${quotation.destinationCity}/${quotation.destinationState}`;
        }
      } catch (error) {
        console.error("Error getting quotation data for PDF metadata:", error);
      }
      
      // Generate PDF
      const pdf = generatePdfFromCanvas(canvas, {
        filename: `cotacao-frete-${id}.pdf`,
        title: quotationTitle,
        subject: quotationSubject,
        author: "FreteValor",
        creator: "FreteValor - Sistema de Gerenciamento de Fretes",
      });
      
      // Trigger download
      pdf.save(`cotacao-frete-${id}.pdf`);
      
      // Restore element
      restoreQuotationFromPdf();
      
      return true;
    }, 500); // Pequeno delay para garantir que o DOM está pronto
    
    return true;
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
    
    // Generate canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff"
    });
    
    // Generate PDF
    const pdf = generatePdfFromCanvas(canvas, {
      title: `Cotação de Frete - ${quotation.originCity} para ${quotation.destinationCity}`,
      subject: `Cotação de frete de ${quotation.originCity}/${quotation.originState} para ${quotation.destinationCity}/${quotation.destinationState}`,
      author: quotation.creatorName || "FreteValor",
      creator: "FreteValor - Sistema de Gerenciamento de Fretes",
    });
    
    // Open in new window
    openPdfInNewWindow(pdf);
    
    return true;
  } catch (error) {
    console.error("Error previewing quotation PDF:", error);
    return false;
  }
};

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
        
        // Generate canvas
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
        
        // Get quotation data for metadata
        let quotationTitle = "Cotação de Frete";
        let quotationSubject = "Cotação de Serviço de Transporte";
        
        try {
          const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
          const quotation = storedQuotations.find((q: any) => q.id === id);
          
          if (quotation) {
            quotationTitle = `Cotação de Frete - ${quotation.originCity} para ${quotation.destinationCity}`;
            quotationSubject = `Cotação de frete de ${quotation.originCity}/${quotation.originState} para ${quotation.destinationCity}/${quotation.destinationState}`;
          }
        } catch (error) {
          console.error("Error getting quotation data for PDF metadata:", error);
        }
        
        // Generate PDF
        const pdf = generatePdfFromCanvas(canvas, {
          title: quotationTitle,
          subject: quotationSubject,
          author: "FreteValor",
          creator: "FreteValor - Sistema de Gerenciamento de Fretes",
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
