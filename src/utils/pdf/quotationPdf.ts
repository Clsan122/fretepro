
/**
 * Quotation-specific PDF generation utilities
 */

import { generateCanvasFromElement, generatePdfFromCanvas, openPdfInNewWindow } from "./pdfCore";

export const generateQuotationPdf = async (quotationId: string): Promise<boolean> => {
  try {
    // Generate canvas from the quotation element
    const canvas = await generateCanvasFromElement('quotation-pdf', {
      setWidth: '800px',
      restoreWidth: true
    });
    
    // Generate PDF with quotation-specific metadata
    generatePdfFromCanvas(canvas, {
      filename: `cotacao-frete-${quotationId}.pdf`,
      title: `Cotação de Frete - ${quotationId}`,
      subject: 'Cotação de serviços de transporte',
      author: 'Sistema de Gestão de Fretes',
      keywords: 'cotação, frete, transporte, logística',
      creator: 'FreteValor App',
      handleMultiplePages: true
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
    // Create a temporary container for the preview
    const tempContainer = document.createElement('div');
    tempContainer.id = 'quotation-pdf-preview';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);
    
    // Generate canvas from the temporary element
    const canvas = await generateCanvasFromElement('quotation-pdf-preview', {
      scale: 2
    });
    
    // Clean up the temporary container
    document.body.removeChild(tempContainer);
    
    // Generate PDF and open in new window
    const pdf = generatePdfFromCanvas(canvas, {
      title: `Pré-visualização da Cotação`,
      subject: 'Cotação de serviços de transporte',
      creator: 'FreteValor App'
    });
    
    // Open the generated PDF in a new window
    openPdfInNewWindow(pdf);
    
    return true;
  } catch (error) {
    console.error("Erro ao gerar pré-visualização do PDF da cotação:", error);
    return false;
  }
};
