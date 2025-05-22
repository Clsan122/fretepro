
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CollectionOrder } from "@/types";

/**
 * Generates a PDF from a collection order
 * @param elementId The ID of the HTML element to convert to PDF
 * @param order The collection order data
 * @param options Additional options for PDF generation
 * @returns A Promise that resolves to the generated PDF blob
 */
export const generateCollectionOrderPdf = async (
  elementId: string,
  order: CollectionOrder,
  options: {
    savePdf?: boolean;
    openInNewTab?: boolean;
    filename?: string;
  } = {}
): Promise<Blob> => {
  // Default options
  const {
    savePdf = false,
    openInNewTab = false,
    filename = `ordem-coleta-${order.orderNumber || "nova"}.pdf`
  } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  try {
    // Configure canvas options
    const canvas = await html2canvas(element, {
      scale: 2,
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
      orientation: imgHeight > pageHeight ? "portrait" : "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Set document properties
    doc.setProperties({
      title: `Ordem de Coleta - ${order.originCity} para ${order.destinationCity}`,
      subject: `Ordem de coleta para transporte de ${order.originCity}/${order.originState} para ${order.destinationCity}/${order.destinationState}`,
      author: "FreteValor",
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
    console.error("Error generating PDF:", error);
    throw error;
  }
};
