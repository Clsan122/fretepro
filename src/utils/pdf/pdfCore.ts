
/**
 * Core PDF generation utilities shared across document types
 */

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Common canvas generation function
export const generateCanvasFromElement = async (
  elementId: string,
  options: {
    scale?: number;
    setWidth?: string;
    restoreWidth?: boolean;
  } = {}
): Promise<HTMLCanvasElement> => {
  const printElement = document.getElementById(elementId);
  
  if (!printElement) {
    throw new Error(`Element with ID '${elementId}' not found`);
  }
  
  // Save original width if needed
  const originalWidth = printElement.style.width;
  
  // Set a fixed width if provided
  if (options.setWidth) {
    printElement.style.width = options.setWidth;
  }
  
  const canvas = await html2canvas(printElement, {
    scale: options.scale || 2, // Higher scale for better quality
    useCORS: true,
    logging: false,
    backgroundColor: '#FFFFFF',
    allowTaint: true,
    onclone: (document, element) => {
      // Ensure all images are loaded before rendering
      element.querySelectorAll('img').forEach(img => {
        if (!img.complete) {
          img.onload = () => {};
          img.src = img.src;
        }
      });
      return element;
    }
  });
  
  // Restore original width if needed
  if (options.restoreWidth && options.setWidth) {
    printElement.style.width = originalWidth;
  }
  
  return canvas;
};

// Generate a PDF from a canvas
export const generatePdfFromCanvas = (
  canvas: HTMLCanvasElement,
  options: {
    filename?: string;
    title?: string;
    subject?: string;
    author?: string;
    keywords?: string;
    creator?: string;
    handleMultiplePages?: boolean;
  } = {}
): jsPDF => {
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Calculate image dimensions to fit the page
  const imgWidth = pageWidth - 10; // 5mm margin on each side
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  // Handle multipage documents if needed
  if (options.handleMultiplePages && imgHeight > pageHeight - 10) {
    let positionY = 5;
    const availableHeight = pageHeight - 10;
    const totalPages = Math.ceil(imgHeight / availableHeight);
    
    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      // Calculate source position and height for the current page
      const sourceY = (canvas.height / imgHeight) * availableHeight * i;
      const sourceHeight = (canvas.height / imgHeight) * availableHeight;
      
      pdf.addImage({
        imageData: imgData,
        format: 'PNG',
        x: 5,
        y: 5,
        width: imgWidth,
        height: availableHeight,
        alias: `page-${i}`,
        compression: 'FAST'
      });
    }
  } else {
    // Single page document
    pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight);
  }
  
  // Add metadata if provided
  if (options.title || options.subject || options.author || options.keywords || options.creator) {
    pdf.setProperties({
      title: options.title || '',
      subject: options.subject || '',
      author: options.author || '',
      keywords: options.keywords || '',
      creator: options.creator || ''
    });
  }
  
  // Save the PDF if filename is provided
  if (options.filename) {
    pdf.save(options.filename);
  }
  
  return pdf;
};

// Open a PDF in a new window for preview
export const openPdfInNewWindow = (pdf: jsPDF): void => {
  const pdfOutput = pdf.output('datauristring');
  window.open(pdfOutput, '_blank');
};
