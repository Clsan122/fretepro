
/**
 * Freight Form PDF generation utilities
 */

import { Freight, Client, Driver, User } from "@/types";
import { generateCanvasFromElement, generatePdfFromCanvas, openPdfInNewWindow } from "./pdfCore";
import { getClientById, getDriverById } from "@/utils/storage";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/utils/formatters";

interface FreightPdfOptions {
  savePdf?: boolean;
  openInNewTab?: boolean;
  filename?: string;
  sender?: User;
}

// Prepare document for printing/PDF
export const prepareFreightFormForPdf = (
  containerId: string,
  freight: Freight,
  user?: User
) => {
  // Configure container for print
  const container = document.getElementById(containerId);
  if (!container) return false;
  
  // Apply any specific styling needed for printing
  container.classList.add('print-mode');
  
  return true;
};

// Restore after printing/PDF generation
export const restoreFreightFormFromPdf = (containerId: string) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Remove print-specific styling
  container.classList.remove('print-mode');
};

// Generate PDF from Freight Form
export const generateFreightFormPdf = async (
  containerId: string,
  freight: Freight,
  options: FreightPdfOptions = {}
): Promise<Blob> => {
  try {
    const prepared = prepareFreightFormForPdf(containerId, freight, options.sender);
    if (!prepared) throw new Error("Failed to prepare freight form for PDF generation");
    
    // Generate canvas from the print container
    const canvas = await generateCanvasFromElement(containerId, {
      scale: 2,
      setWidth: "800px",
      restoreWidth: true,
    });
    
    // Generate PDF from canvas
    const client = freight.clientId ? getClientById(freight.clientId) : null;
    const clientName = client ? client.name : "Cliente";
    
    // Default filename if not provided
    const defaultFilename = `frete-${clientName}-${format(new Date(), "dd-MM-yyyy")}.pdf`;
    
    const pdf = generatePdfFromCanvas(canvas, {
      filename: options.savePdf ? options.filename || defaultFilename : undefined,
      title: `Formulário de Frete - ${clientName}`,
      subject: `Frete de ${freight.originCity}/${freight.originState} para ${freight.destinationCity}/${freight.destinationState}`,
      author: options.sender?.companyName || options.sender?.name || "FreteValor",
      creator: "FreteValor - Sistema de Gerenciamento de Fretes",
    });
    
    // Open in a new tab if requested
    if (options.openInNewTab) {
      openPdfInNewWindow(pdf);
    }
    
    // Restore the container to its original state
    restoreFreightFormFromPdf(containerId);
    
    return pdf.output('blob');
  } catch (error) {
    console.error("Error generating freight form PDF:", error);
    restoreFreightFormFromPdf(containerId);
    throw error;
  }
};

// Preview PDF directly in a new tab
export const previewFreightFormPdf = async (
  containerId: string,
  freight: Freight,
  user?: User
): Promise<void> => {
  try {
    await generateFreightFormPdf(containerId, freight, {
      openInNewTab: true,
      sender: user,
    });
  } catch (error) {
    console.error("Error previewing freight form PDF:", error);
    throw error;
  }
};

// Export the PDF to a file for download
export const exportFreightFormPdf = async (
  containerId: string,
  freight: Freight,
  user?: User
): Promise<void> => {
  try {
    await generateFreightFormPdf(containerId, freight, {
      savePdf: true,
      sender: user,
    });
  } catch (error) {
    console.error("Error exporting freight form PDF:", error);
    throw error;
  }
};
