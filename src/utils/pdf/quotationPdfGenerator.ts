
import { QuotationData } from "@/components/quotation/types";
import { prepareQuotationForPdf, restoreQuotationFromPdf } from "./quotationPdfPrep";
import { generateFreightQuotationPdf } from "./freightQuotationPdf";

/**
 * Detects Safari mobile for specific handling
 */
const isSafariMobile = (): boolean => {
  const userAgent = navigator.userAgent;
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isMobile = /iPhone|iPad|iPod/.test(userAgent);
  return isSafari && isMobile;
};

/**
 * Generates a PDF for a quotation with Safari mobile optimizations
 * @param id The ID of the quotation to generate a PDF for
 * @returns A Promise that resolves to true if the PDF was generated successfully
 */
export const generateQuotationPdf = async (id: string): Promise<boolean> => {
  try {
    // Get the quotation element
    const quotationElement = document.getElementById("quotation-pdf");
    if (!quotationElement) {
      console.error("Quotation PDF element not found");
      return false;
    }

    // Prepare quotation data
    const quotationData = prepareQuotationForPdf(id);
    if (!quotationData) {
      console.error("Failed to prepare quotation data");
      return false;
    }

    // Safari mobile specific preparation
    if (isSafariMobile()) {
      console.log("Detectado Safari mobile - aplicando otimizações...");
      
      // Ensure element is visible and properly sized
      quotationElement.style.display = 'block';
      quotationElement.style.visibility = 'visible';
      quotationElement.style.position = 'static';
      quotationElement.style.width = '210mm';
      quotationElement.style.maxWidth = '210mm';
      
      // Wait a bit for styles to apply
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Generate the PDF with optimized settings
    await generateFreightQuotationPdf("quotation-pdf", quotationData, {
      savePdf: true
    });
    
    // Restore the original state
    restoreQuotationFromPdf();
    
    console.log("PDF gerado com sucesso");
    return true;
  } catch (error) {
    console.error("Error generating quotation PDF:", error);
    
    // Try alternative approach for Safari mobile
    if (isSafariMobile()) {
      try {
        console.log("Tentando método alternativo para Safari mobile...");
        
        // Alternative: trigger print dialog as fallback
        const printFallback = () => {
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            const quotationElement = document.getElementById("quotation-pdf");
            if (quotationElement) {
              printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Cotação de Frete</title>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                    @media print { body { padding: 0; } }
                    .quotation-content { width: 100%; max-width: 210mm; }
                  </style>
                </head>
                <body>
                  <div class="quotation-content">${quotationElement.innerHTML}</div>
                  <script>
                    window.onload = function() {
                      setTimeout(function() { window.print(); }, 1000);
                    };
                  </script>
                </body>
                </html>
              `);
              printWindow.document.close();
            }
          }
        };
        
        printFallback();
        return true;
      } catch (fallbackError) {
        console.error("Fallback method also failed:", fallbackError);
      }
    }
    
    restoreQuotationFromPdf();
    return false;
  }
};
