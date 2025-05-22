
/**
 * Re-export all quotation PDF functionality for backward compatibility
 */
import { 
  prepareQuotationForPdf as prepForPdf, 
  restoreQuotationFromPdf as restoreFromPdf 
} from "./quotationPdfPrep";
import { 
  generateFreightQuotationPdf, 
  shareFreightQuotationPdf,
  previewFreightQuotationPdf 
} from "./freightQuotationPdf";
import { QuotationData } from "@/components/quotation/types";
import React from "react"; // Add missing import for React

// Re-export all functions using the new implementations
export const generateQuotationPdf = async (id: string): Promise<boolean> => {
  try {
    // Get the quotation data from the element's data 
    const quotationElement = document.getElementById("quotation-pdf");
    if (!quotationElement) {
      return false;
    }

    // Generate the PDF with the new format
    const quotationData = prepForPdf(id);
    if (!quotationData) {
      return false;
    }

    await generateFreightQuotationPdf("quotation-pdf", quotationData, {
      savePdf: true
    });
    
    // Restore the original state
    restoreFromPdf();
    return true;
  } catch (error) {
    console.error("Error generating quotation PDF:", error);
    restoreFromPdf();
    return false;
  }
};

export const previewQuotationPdf = async (quotation: QuotationData): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create temporary div for rendering
      const tempDiv = document.createElement('div');
      tempDiv.id = 'temp-quotation-container';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm'; // A4 width
      document.body.appendChild(tempDiv);

      // Add data attribute to access the quotation
      tempDiv.setAttribute('data-quotation', JSON.stringify(quotation));
      
      import('../pdf/index').then((pdfUtils) => {
        // Prepare for PDF
        pdfUtils.prepareQuotationForPdf(quotation.id);
        
        // Get current user
        import('@/context/AuthContext').then(({ useAuth }) => {
          const auth = useAuth();
          const user = auth.user;
          
          // Prepare creator info
          const creatorInfo = {
            name: user?.companyName || quotation.creatorName || user?.name || "",
            document: user?.cnpj || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
            city: user?.city || "",
            state: user?.state || ""
          };
          
          import('@/components/quotation/FreightQuotationPdf').then(({ FreightQuotationPdf }) => {
            import('react-dom/client').then((ReactDOM) => {
              // Create React root
              const root = ReactDOM.createRoot(tempDiv);
              
              // Render FreightQuotationPdf component
              root.render(
                React.createElement(FreightQuotationPdf, {
                  quotation,
                  creatorInfo
                })
              );
              
              // Add small delay to ensure rendering completes
              setTimeout(() => {
                import('html2canvas').then((html2canvasModule) => {
                  const html2canvas = html2canvasModule.default;
                  
                  html2canvas(tempDiv, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                  }).then(canvas => {
                    import('jspdf').then((jsPDFModule) => {
                      // Fix the jsPDF import
                      const jsPDF = jsPDFModule.default;
                      
                      // Create new PDF document
                      const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'mm',
                        format: 'a4',
                        compress: true
                      });
                      
                      // Get canvas data
                      const imgData = canvas.toDataURL('image/png');
                      
                      // A4 dimensions
                      const pdfWidth = pdf.internal.pageSize.getWidth();
                      const pdfHeight = pdf.internal.pageSize.getHeight();
                      
                      // Calculate scaling to fit on A4
                      const widthRatio = pdfWidth / canvas.width;
                      const heightRatio = pdfHeight / canvas.height;
                      const ratio = Math.min(widthRatio, heightRatio);
                      
                      const canvasWidth = canvas.width * ratio;
                      const canvasHeight = canvas.height * ratio;
                      
                      const marginX = (pdfWidth - canvasWidth) / 2;
                      const marginY = (pdfHeight - canvasHeight) / 2;
                      
                      // Add image to PDF
                      pdf.addImage(imgData, 'PNG', marginX, marginY, canvasWidth, canvasHeight);
                      
                      // Open PDF in new window
                      pdfUtils.openPdfInNewWindow(pdf);
                      
                      // Clean up
                      document.body.removeChild(tempDiv);
                      // Fix: Remove the ID argument as it's not needed for restoreFromPdf
                      pdfUtils.restoreQuotationFromPdf();
                      
                      resolve();
                    }).catch(reject);
                  }).catch(reject);
                }).catch(reject);
              }, 200);
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
      reject(error);
    }
  });
};

export const shareQuotationPdf = async (id: string): Promise<Blob> => {
  // Get quotation data
  const quotationData = prepForPdf(id);
  if (!quotationData) {
    throw new Error("Quotation not found");
  }

  try {
    // Generate the PDF
    const pdfBlob = await generateFreightQuotationPdf("quotation-pdf", quotationData);
    
    // Restore the original state
    restoreFromPdf();
    
    return pdfBlob;
  } catch (error) {
    console.error("Error sharing quotation PDF:", error);
    restoreFromPdf();
    throw error;
  }
};

// Create local implementations with different names to avoid conflicts
export const prepareForPdfPrint = (
  quotationId: string,
  containerId: string = "quotation-content"
) => {
  // Configure container for print
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  // Apply print mode class
  container.classList.add('print-mode');
  
  // Apply specific optimizations for better PDF fitting
  document.body.style.zoom = "0.85"; // Adjust zoom for better fit
  
  return true;
};

export const restoreFromPdfPrint = (
  containerId: string = "quotation-content"
) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Remove print mode class
  container.classList.remove('print-mode');
  
  // Restore zoom
  document.body.style.zoom = "";
};

// Re-export the imported functions
export { prepForPdf as prepareQuotationForPdf, restoreFromPdf as restoreQuotationFromPdf };
