
/**
 * Quotation-specific PDF generation utilities
 */

import { generateCanvasFromElement, generatePdfFromCanvas, openPdfInNewWindow } from "./pdfCore";

export const generateQuotationPdf = async (quotationId: string): Promise<boolean> => {
  try {
    // Generate canvas from the quotation element
    const canvas = await generateCanvasFromElement('quotation-pdf', {
      setWidth: '800px',
      restoreWidth: true,
      scale: 2
    });
    
    // Generate PDF with quotation-specific metadata
    const pdf = generatePdfFromCanvas(canvas, {
      filename: `cotacao-frete-${quotationId}.pdf`,
      title: `Cotação de Frete - ${quotationId}`,
      subject: 'Cotação de serviços de transporte',
      author: 'Sistema de Gestão de Fretes',
      keywords: 'cotação, frete, transporte, logística',
      creator: 'FreteValor App',
      pageFormat: 'a4',
      handleMultiplePages: false // Configuração para assegurar uma única página
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao gerar PDF da cotação:", error);
    return false;
  }
};

// Function to preview quotation PDF
export const previewQuotationPdf = async (quotationData: any): Promise<boolean> => {
  try {
    // Generate canvas from the existing document element
    const canvas = await generateCanvasFromElement('quotation-pdf', {
      scale: 2,
      setWidth: '800px',
      restoreWidth: true
    });
    
    // Generate PDF and open in new window
    const pdf = generatePdfFromCanvas(canvas, {
      title: `Pré-visualização da Cotação`,
      subject: 'Cotação de serviços de transporte',
      creator: 'FreteValor App',
      pageFormat: 'a4',
      handleMultiplePages: false // Configuração para assegurar uma única página
    });
    
    // Open the generated PDF in a new window
    openPdfInNewWindow(pdf);
    
    return true;
  } catch (error) {
    console.error("Erro ao gerar pré-visualização do PDF da cotação:", error);
    return false;
  }
};

// Function to share quotation PDF
export const shareQuotationPdf = async (quotationId: string): Promise<Blob> => {
  try {
    // Generate canvas from the quotation element
    const canvas = await generateCanvasFromElement('quotation-pdf', {
      scale: 2,
      setWidth: '800px',
      restoreWidth: true
    });
    
    // Generate PDF without saving
    const pdf = generatePdfFromCanvas(canvas, {
      title: `Cotação de Frete - ${quotationId}`,
      subject: 'Cotação de serviços de transporte',
      creator: 'FreteValor App',
      pageFormat: 'a4',
      handleMultiplePages: false // Configuração para assegurar uma única página
    });
    
    // Convert PDF to blob for sharing
    return new Promise<Blob>((resolve) => {
      const blob = pdf.output('blob');
      resolve(blob);
    });
  } catch (error) {
    console.error("Erro ao gerar blob do PDF da cotação:", error);
    throw error;
  }
};
