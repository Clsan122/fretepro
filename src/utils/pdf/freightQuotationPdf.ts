
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
 * Generates a PDF for a freight quotation
 * @param elementId The ID of the HTML element to convert to PDF
 * @param quotation The quotation data
 * @param options Additional options for PDF generation
 * @returns A Promise that resolves to the generated PDF blob
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

  try {
    // Configure canvas options for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // Create PDF with appropriate dimensions
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add the image to the PDF
    doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Set document properties
    doc.setProperties({
      title: `Cotação de Frete - ${quotation.originCity} para ${quotation.destinationCity}`,
      subject: `Cotação de frete de ${quotation.originCity}/${quotation.originState} para ${quotation.destinationCity}/${quotation.destinationState}`,
      author: quotation.creatorName || "FreteValor",
      creator: "FreteValor"
    });

    // Handle output options
    if (savePdf) {
      doc.save(filename);
    }

    if (openInNewTab) {
      const pdfBlob = doc.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, "_blank");
    }

    // Return the PDF as a blob
    return doc.output("blob");
  } catch (error) {
    console.error("Error generating quotation PDF:", error);
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
