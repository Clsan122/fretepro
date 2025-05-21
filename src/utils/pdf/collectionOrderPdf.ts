
/**
 * Collection order-specific PDF generation utilities
 */
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CollectionOrder } from "@/types";
import { generateCanvasFromElement, generatePdfFromCanvas } from "./pdfCore";

export const prepareForPrintMode = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Esconder elementos que não devem aparecer no PDF
  const elementsToHide = element.querySelectorAll('.print-exclude');
  elementsToHide.forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // Adicionar classe para estilo específico de impressão
  element.classList.add('print-mode');
};

export const restoreFromPrintMode = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Restaurar elementos escondidos
  const elementsToHide = element.querySelectorAll('.print-exclude');
  elementsToHide.forEach(el => {
    (el as HTMLElement).style.display = '';
  });
  
  // Remover classe de estilo de impressão
  element.classList.remove('print-mode');
};

export const generateCollectionOrderPdf = async (
  elementId: string,
  order: CollectionOrder,
  options: { 
    filename?: string; 
    savePdf?: boolean;
    openInNewTab?: boolean;
  } = {}
): Promise<Blob> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Elemento para geração de PDF não encontrado");
    }
    
    // Preparar para impressão
    prepareForPrintMode(elementId);
    
    try {
      // Usar as funções core otimizadas para geração de PDF
      const canvas = await generateCanvasFromElement(elementId, {
        scale: 3,
        setWidth: '800px',
        restoreWidth: true
      });
      
      const pdf = generatePdfFromCanvas(canvas, {
        title: `Ordem de Coleta - ${order.orderNumber}`,
        subject: `Transporte de ${order.originCity}/${order.originState} para ${order.destinationCity}/${order.destinationState}`,
        author: order.sender,
        creator: 'FreteValor',
        quality: 0.95,
        fitToPage: true,
        filename: options.savePdf ? (options.filename || `ordem-coleta-${order.orderNumber}.pdf`) : undefined
      });
      
      if (options.openInNewTab) {
        const pdfOutput = pdf.output('datauristring');
        window.open(pdfOutput, '_blank');
      }
      
      return pdf.output('blob');
    } finally {
      // Restaurar estado original do elemento
      restoreFromPrintMode(elementId);
    }
  } catch (error) {
    console.error("Erro ao gerar PDF da ordem de coleta:", error);
    throw error;
  }
};
