
/**
 * Collection order-specific PDF generation utilities
 */
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CollectionOrder } from "@/types";

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
    
    const originalWidth = element.style.width;
    element.style.width = '800px'; // Largura fixa para garantir qualidade
    
    // Preparar para impressão
    prepareForPrintMode(elementId);
    
    // Gerar o canvas com configurações otimizadas para PDF
    const canvas = await html2canvas(element, {
      scale: 2, // Aumenta a resolução
      useCORS: true, // Permite carregar recursos de outros domínios
      logging: false,
      backgroundColor: '#FFFFFF',
      allowTaint: true,
    });
    
    // Restaurar estado original do elemento
    element.style.width = originalWidth;
    restoreFromPrintMode(elementId);
    
    // Criar o PDF com qualidade otimizada
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Configurar metadados do PDF
    pdf.setProperties({
      title: `Ordem de Coleta - ${order.orderNumber}`,
      subject: `Transporte de ${order.originCity}/${order.originState} para ${order.destinationCity}/${order.destinationState}`,
      author: order.sender,
      creator: 'FreteValor',
    });
    
    // Calcular dimensões para manter proporção
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // Margens de 10mm em cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Adicionar a imagem ao PDF com margens
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    
    // Salvar o PDF se solicitado
    const filename = options.filename || `ordem-coleta-${order.orderNumber}.pdf`;
    if (options.savePdf) {
      pdf.save(filename);
    }
    
    // Abrir em nova aba se solicitado
    if (options.openInNewTab) {
      const pdfOutput = pdf.output('datauristring');
      window.open(pdfOutput, '_blank');
    }
    
    // Retornar o blob para uso posterior (compartilhamento, etc)
    return pdf.output('blob');
    
  } catch (error) {
    console.error("Erro ao gerar PDF da ordem de coleta:", error);
    throw error;
  }
};
