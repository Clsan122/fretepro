
import { QuotationData } from "@/components/quotation/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface GeneratePdfOptions {
  savePdf?: boolean;
  openInNewTab?: boolean;
  filename?: string;
  clientData?: any;
  transporterData?: any;
}

/**
 * Detects if the user is on Safari mobile
 */
const isSafariMobile = (): boolean => {
  const userAgent = navigator.userAgent;
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isMobile = /iPhone|iPad|iPod/.test(userAgent);
  return isSafari && isMobile;
};

/**
 * Gets optimized canvas options for Safari mobile
 */
const getCanvasOptions = () => {
  const isSafariMobileDevice = isSafariMobile();
  
  return {
    scale: isSafariMobileDevice ? 1.5 : 2, // Lower scale for Safari mobile to prevent memory issues
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    width: isSafariMobileDevice ? 794 : undefined, // A4 width in pixels at 96 DPI
    height: isSafariMobileDevice ? 1123 : undefined, // A4 height in pixels at 96 DPI
    foreignObjectRendering: !isSafariMobileDevice, // Disable for Safari mobile
    imageTimeout: isSafariMobileDevice ? 5000 : 15000,
    onclone: (clonedDocument: Document) => {
      // Add Safari-specific styles for better rendering
      if (isSafariMobileDevice) {
        const style = clonedDocument.createElement('style');
        style.innerHTML = `
          * {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            font-rendering: optimizeLegibility !important;
          }
          #quotation-pdf {
            width: 210mm !important;
            max-width: 210mm !important;
            min-height: 297mm !important;
            transform: none !important;
            zoom: 1 !important;
            -webkit-transform: none !important;
            page-break-inside: avoid !important;
          }
          img {
            max-width: 100% !important;
            height: auto !important;
            image-rendering: -webkit-optimize-contrast !important;
          }
          .text-xs { font-size: 10px !important; }
          .text-sm { font-size: 12px !important; }
          .text-base { font-size: 14px !important; }
          .text-lg { font-size: 16px !important; }
          .text-xl { font-size: 18px !important; }
        `;
        clonedDocument.head.appendChild(style);
      }
    }
  };
};

/**
 * Generates a PDF for a freight quotation with Safari mobile optimization
 */
export const generateFreightQuotationPdf = async (
  elementId: string,
  quotation: QuotationData,
  options: GeneratePdfOptions = {}
): Promise<Blob> => {
  // Default options
  const {
    savePdf = false,
    openInNewTab = false,
    filename = `cotacao-frete-${quotation.orderNumber || quotation.id}.pdf`
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  const isSafariMobileDevice = isSafariMobile();

  try {
    // Add loading indicator for Safari mobile
    if (isSafariMobileDevice) {
      console.log("Gerando PDF no Safari mobile - aguarde...");
    }

    // Pre-configure element for Safari mobile
    if (isSafariMobileDevice) {
      element.style.width = '210mm';
      element.style.maxWidth = '210mm';
      element.style.minHeight = '297mm';
      element.style.transform = 'none';
      element.style.zoom = '1';
    }

    // Wait for images to load on Safari mobile
    if (isSafariMobileDevice) {
      const images = element.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails
          setTimeout(resolve, 3000); // Timeout after 3 seconds
        });
      }));
    }

    // Generate canvas with optimized options
    const canvasOptions = getCanvasOptions();
    const canvas = await html2canvas(element, canvasOptions);

    // Create PDF with appropriate dimensions
    const imgData = canvas.toDataURL("image/png", isSafariMobileDevice ? 0.8 : 0.92);
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // Add the image to the PDF with Safari-specific adjustments
    if (imgHeight <= pageHeight) {
      // Single page
      doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      // Multiple pages for very long content
      let heightLeft = imgHeight;
      let position = 0;
      
      while (heightLeft > 0) {
        const pageHeight = heightLeft > 297 ? 297 : heightLeft;
        doc.addImage(imgData, "PNG", 0, position, imgWidth, pageHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        
        if (heightLeft > 0) {
          doc.addPage();
        }
      }
    }

    // Set document properties
    doc.setProperties({
      title: `Cotação de Frete - ${quotation.originCity} para ${quotation.destinationCity}`,
      subject: `Cotação de frete de ${quotation.originCity}/${quotation.originState} para ${quotation.destinationCity}/${quotation.destinationState}`,
      author: quotation.creatorName || "FreteValor",
      creator: "FreteValor"
    });

    // Handle output options with Safari-specific behavior
    if (savePdf) {
      if (isSafariMobileDevice) {
        // Safari mobile doesn't support direct download, so open in new tab
        const pdfBlob = doc.output("blob");
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, "_blank");
      } else {
        doc.save(filename);
      }
    }

    if (openInNewTab) {
      const pdfBlob = doc.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, "_blank");
    }

    // Reset element styles for Safari mobile
    if (isSafariMobileDevice) {
      element.style.width = '';
      element.style.maxWidth = '';
      element.style.minHeight = '';
      element.style.transform = '';
      element.style.zoom = '';
    }

    // Return the PDF as a blob
    return doc.output("blob");
  } catch (error) {
    console.error("Error generating quotation PDF:", error);
    
    // Safari mobile fallback: try with minimal options
    if (isSafariMobileDevice) {
      try {
        console.log("Tentando fallback para Safari mobile...");
        const fallbackCanvas = await html2canvas(element, {
          scale: 1,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false
        });
        
        const fallbackImgData = fallbackCanvas.toDataURL("image/png", 0.7);
        const fallbackDoc = new jsPDF("portrait", "mm", "a4");
        fallbackDoc.addImage(fallbackImgData, "PNG", 0, 0, 210, 297);
        
        const fallbackBlob = fallbackDoc.output("blob");
        const fallbackUrl = URL.createObjectURL(fallbackBlob);
        window.open(fallbackUrl, "_blank");
        
        return fallbackBlob;
      } catch (fallbackError) {
        console.error("Fallback também falhou:", fallbackError);
      }
    }
    
    throw error;
  }
};

/**
 * Shares a freight quotation PDF using the Web Share API or fallback to download
 * @param quotation The quotation data
 * @returns A Promise that resolves to true if the sharing was successful
 */
export const shareFreightQuotationPdf = async (
  quotation: QuotationData
): Promise<boolean> => {
  try {
    const element = document.getElementById("quotation-pdf");
    if (!element) {
      throw new Error("Quotation PDF element not found");
    }

    // Generate the PDF
    const pdfBlob = await generateFreightQuotationPdf("quotation-pdf", quotation);
    const filename = `cotacao-frete-${quotation.orderNumber || quotation.id}.pdf`;

    // Try to share using Web Share API
    if (navigator.share && navigator.canShare) {
      const file = new File([pdfBlob], filename, { 
        type: 'application/pdf',
        lastModified: new Date().getTime()
      });
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Cotação de Frete - ${quotation.originCity} para ${quotation.destinationCity}`,
          text: `Cotação de frete de ${quotation.originCity}/${quotation.originState} para ${quotation.destinationCity}/${quotation.destinationState}`,
        });
        return true;
      }
    }
    
    // Fallback to download if sharing not available
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Error sharing freight quotation PDF:", error);
    return false;
  }
};

/**
 * Opens a freight quotation PDF in a new tab
 * @param quotation The quotation data
 */
export const previewFreightQuotationPdf = async (
  quotation: QuotationData
): Promise<boolean> => {
  try {
    const pdfBlob = await generateFreightQuotationPdf("quotation-pdf", quotation, {
      openInNewTab: true
    });
    return true;
  } catch (error) {
    console.error("Error previewing freight quotation PDF:", error);
    return false;
  }
};
