
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

  // Assegurar que todas as imagens estão carregadas
  const images = element.querySelectorAll('img');
  images.forEach(img => {
    if (!img.complete) {
      img.style.opacity = '0';
      img.onload = () => {
        img.style.opacity = '1';
      };
    }
  });
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

  // Restaurar opacidade de imagens
  const images = element.querySelectorAll('img');
  images.forEach(img => {
    img.style.opacity = '1';
  });
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
        scale: 4, // Alta resolução para melhor qualidade
        setWidth: '800px',
        restoreWidth: true,
        // Adicionar os seguintes parâmetros para melhorar a qualidade
        logging: false,
        allowTaint: true,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const pdf = generatePdfFromCanvas(canvas, {
        title: `Ordem de Coleta - ${order.orderNumber || 'Nova'}`,
        subject: `Transporte de ${order.originCity}/${order.originState || ''} para ${order.destinationCity}/${order.destinationState || ''}`,
        author: order.sender || 'FreteValor',
        creator: 'FreteValor',
        quality: 0.98, // Alta qualidade
        fitToPage: true, // Forçar ajuste para uma página
        filename: options.savePdf ? (options.filename || `ordem-coleta-${order.orderNumber || 'nova'}.pdf`) : undefined,
        compress: true, // Compressão para otimizar o tamanho
        keywords: `ordem de coleta, frete, transporte, ${order.originCity}, ${order.destinationCity}`
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

// Função para gerar HTML preview
export const generateOrderHtmlPreview = (
  elementId: string,
  order: CollectionOrder
): void => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Elemento para geração de HTML não encontrado");
    }
    
    // Implementação está no hook useCollectionOrderPdf
    // para evitar duplicação de código
  } catch (error) {
    console.error("Erro ao gerar HTML da ordem de coleta:", error);
    throw error;
  }
};
