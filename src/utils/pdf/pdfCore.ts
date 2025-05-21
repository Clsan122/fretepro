
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
  
  // Verificar se estamos em um dispositivo móvel
  const isMobile = window.innerWidth <= 640;
  
  // Ajustar a escala para melhorar a qualidade da imagem (maior em desktop, adequada para mobile)
  const scale = isMobile ? (options.scale || 2) : (options.scale || 4);
  
  // Save original width if needed
  const originalWidth = printElement.style.width;
  const originalMaxWidth = printElement.style.maxWidth;
  const originalOverflow = printElement.style.overflow;
  
  // Set a fixed width if provided
  if (options.setWidth) {
    printElement.style.width = options.setWidth;
    printElement.style.maxWidth = "100%";
  } else if (isMobile) {
    // Ajustar a largura para dispositivos móveis se não foi especificado
    printElement.style.width = "100%";
    printElement.style.maxWidth = "100%";
    printElement.style.overflow = "hidden";
  }
  
  const canvas = await html2canvas(printElement, {
    scale: scale, 
    useCORS: true,
    logging: false,
    backgroundColor: '#FFFFFF',
    allowTaint: true,
    imageTimeout: 15000, // Aumento do timeout para carregar imagens
    onclone: (document, element) => {
      // Ensure all images are loaded before rendering
      element.querySelectorAll('img').forEach(img => {
        if (!img.complete) {
          img.onload = () => {};
          img.src = img.src;
        }
      });

      // Ajustar elementos para impressão em dispositivos móveis
      if (isMobile) {
        const styles = document.createElement('style');
        styles.innerHTML = `
          .w-full, .max-w-3xl, .max-w-4xl, .max-w-5xl, .max-w-6xl, .max-w-7xl {
            width: 100% !important;
            max-width: 100% !important;
          }
          table {
            table-layout: fixed !important;
            width: 100% !important;
          }
          table td, table th {
            padding: 2px !important;
            font-size: 8px !important;
            word-break: break-word !important;
          }
          .text-sm, .text-xs {
            font-size: 8px !important;
          }
          .grid-cols-2, .grid-cols-3, .grid-cols-4 {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
          }
        `;
        document.head.appendChild(styles);
      }
      
      // Adicionar estilo para garantir tudo em uma página
      const singlePageStyle = document.createElement('style');
      singlePageStyle.innerHTML = `
        #${elementId} {
          max-height: 280mm !important; /* Altura aproximada de uma página A4 com margens */
          width: ${isMobile ? '100%' : '210mm'} !important;
          page-break-inside: avoid !important;
        }
        #${elementId} .no-break {
          page-break-inside: avoid !important;
        }
        #${elementId} * {
          page-break-inside: avoid !important;
        }
        #${elementId} table {
          page-break-inside: avoid !important;
          font-size: ${isMobile ? '8px' : '8px'} !important;
        }
        .text-sm {
          font-size: 7px !important;
        }
        .text-xs {
          font-size: 6px !important;
        }
        p.text-sm {
          font-size: 7px !important;
          line-height: 1.1 !important;
          margin: 0.5mm 0 !important;
        }
        p.text-xs {
          font-size: 6px !important;
          line-height: 1.1 !important;
          margin: 0 !important;
        }
        .p-4, .p-3, .p-2 {
          padding: 0.5mm !important;
        }
        .mb-4, .mb-3, .mb-2 {
          margin-bottom: 0.5mm !important;
        }
        .mt-4, .mt-3, .mt-2 {
          margin-top: 0.5mm !important;
        }
        .gap-4, .gap-3, .gap-2 {
          gap: 0.5mm !important;
        }
      `;
      document.head.appendChild(singlePageStyle);
      
      return element;
    }
  });
  
  // Restore original width if needed
  if (options.restoreWidth) {
    printElement.style.width = originalWidth;
    printElement.style.maxWidth = originalMaxWidth;
    printElement.style.overflow = originalOverflow;
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
    compress?: boolean;
    quality?: number; // 0.1 (lowest) to 1.0 (highest)
    fitToPage?: boolean;
  } = {}
): jsPDF => {
  // Definir qualidade padrão alta se não especificada
  const imageQuality = options.quality || 0.98;
  
  // Gerar imagem com qualidade definida
  const imgData = canvas.toDataURL('image/png', imageQuality);
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: options.compress || true,
  });
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Calculate image dimensions to fit the page
  const imgWidth = options.fitToPage ? pageWidth - 6 : Math.min(pageWidth - 6, (canvas.width * 0.264583));
  const ratio = canvas.width / imgWidth;
  const imgHeight = canvas.height / ratio;
  
  // Use single page approach when fitToPage is true or height is reasonable
  if (options.fitToPage || imgHeight <= pageHeight - 6) {
    pdf.addImage(
      imgData,
      'PNG',
      3, // x position - margem de 3mm na esquerda
      3, // y position - margem de 3mm no topo 
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );
  }
  // Handle multipage documents if needed
  else if (options.handleMultiplePages) {
    let positionY = 5;
    const availableHeight = pageHeight - 10;
    const totalPages = Math.ceil(imgHeight / availableHeight);
    
    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      // Fixed: Use correct parameters for jsPDF 3.x addImage method
      pdf.addImage(
        imgData,
        'PNG',
        5,
        5,
        imgWidth,
        Math.min(availableHeight, imgHeight / totalPages),
        `page-${i}`,
        'FAST'
      );
    }
  } else {
    // Single page document (scaling down if needed)
    const scaleFactor = Math.min(1, (pageHeight - 6) / imgHeight);
    const finalWidth = imgWidth * scaleFactor;
    const finalHeight = imgHeight * scaleFactor;
    
    pdf.addImage(
      imgData,
      'PNG',
      3 + (pageWidth - 6 - finalWidth) / 2, // centralizar horizontalmente
      3,
      finalWidth,
      finalHeight,
      undefined,
      'FAST'
    );
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
