
import React from "react";
import { QuotationData } from "@/components/quotation/types";
import { prepareQuotationForPdf, restoreQuotationFromPdf, getQuotationMetadata } from "./quotationPdfPrep";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { openPdfInNewWindow } from "./pdfCore";

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
      
      // Prepare for print mode
      const prepareResult = prepareQuotationForPdf(quotation.id);
      if (!prepareResult) {
        reject(new Error("Failed to prepare quotation for PDF"));
        return;
      }
      
      // Prepare creator info (without using useAuth hook)
      const creatorInfo = {
        name: quotation.creatorName || "",
        document: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: ""
      };
      
      // Try to get user info from localStorage if available
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          creatorInfo.name = user?.companyName || quotation.creatorName || user?.name || "";
          creatorInfo.document = user?.cnpj || "";
          creatorInfo.email = user?.email || "";
          creatorInfo.phone = user?.phone || "";
          creatorInfo.address = user?.address || "";
          creatorInfo.city = user?.city || "";
          creatorInfo.state = user?.state || "";
        }
      } catch (error) {
        console.warn("Could not get user info from localStorage:", error);
      }
      
      // Use dynamic import for FreightQuotationPdf component
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
            html2canvas(tempDiv, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              logging: false,
              backgroundColor: '#ffffff',
            }).then(canvas => {
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
              openPdfInNewWindow(pdf);
              
              // Clean up
              document.body.removeChild(tempDiv);
              restoreQuotationFromPdf();
              
              resolve();
            }).catch(reject);
          }, 200);
        }).catch(reject);
      }).catch(reject);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
      reject(error);
    }
  });
};
