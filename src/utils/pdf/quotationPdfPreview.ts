
import React from "react";
import { QuotationData } from "@/components/quotation/types";
import { prepareQuotationForPdf, restoreQuotationFromPdf } from "./quotationPdfPrep";

/**
 * Opens a preview of the quotation PDF in a new window
 */
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
