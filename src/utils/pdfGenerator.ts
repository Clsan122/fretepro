
/**
 * Módulo para geração de PDF usando chrome-headless-render-pdf
 */

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generateQuotationPdf = async (quotationId: string): Promise<boolean> => {
  try {
    const printElement = document.getElementById('quotation-pdf');
    
    if (!printElement) {
      throw new Error("Elemento de impressão não encontrado");
    }
    
    const canvas = await html2canvas(printElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 800,
      backgroundColor: '#FFFFFF'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20; // Margem de 10mm em cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    
    pdf.save(`cotacao-${quotationId}.pdf`);
    return true;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return false;
  }
};

// Função para visualizar PDF no formato de pré-visualização
export const previewQuotationPdf = async (quotationData: any): Promise<boolean> => {
  try {
    const tempContainer = document.createElement('div');
    tempContainer.id = 'quotation-pdf-preview';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);
    
    // Renderizar o conteúdo da cotação no container temporário
    // Isto depende de como sua estrutura do QuotationPdfDocument está implementada
    // e seria substituído por um componente React real em uma aplicação
    
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 800,
      backgroundColor: '#FFFFFF'
    });
    
    document.body.removeChild(tempContainer);
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    
    // Abre o PDF em uma nova janela
    const pdfOutput = pdf.output('datauristring');
    window.open(pdfOutput, '_blank');
    
    return true;
  } catch (error) {
    console.error("Erro ao gerar pré-visualização do PDF:", error);
    return false;
  }
};

export const generateCollectionOrderPdf = async (orderId: string): Promise<boolean> => {
  try {
    console.log("Gerando PDF para ordem de coleta:", orderId);
    console.log("Comando seria: chrome-headless-render-pdf --url=http://localhost:3000/collection-order/" + 
      orderId + "/pdf --pdf=ordem-coleta-" + orderId + ".pdf --include-background --display-header-footer");

    // Por enquanto só imprime a página atual usando a API de impressão do browser
    window.print();
    return true;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return false;
  }
};

export const generateFreightReceiptPdf = async (freightId: string): Promise<boolean> => {
  try {
    console.log("Gerando PDF para recibo de frete:", freightId);
    console.log("Comando seria: chrome-headless-render-pdf --url=http://localhost:3000/freight-receipt/" + 
      freightId + "/pdf --pdf=recibo-" + freightId + ".pdf --include-background --display-header-footer");

    // Por enquanto só imprime a página atual usando a API de impressão do browser
    window.print();
    return true;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return false;
  }
};

export const generateMultiFreightReceiptPdf = async (freightIds: string[]): Promise<boolean> => {
  try {
    const idsParam = freightIds.join(',');
    
    console.log("Gerando PDF para recibo múltiplo de fretes:", idsParam);
    console.log("Comando seria: chrome-headless-render-pdf --url=http://localhost:3000/multi-freight-receipt?ids=" + 
      idsParam + " --pdf=recibo-multiplo.pdf --include-background --display-header-footer");

    // Por enquanto só imprime a página atual usando a API de impressão do browser
    window.print();
    return true;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return false;
  }
};

export const sendQuotationByEmail = async (quotationId: string, emailTo: string): Promise<boolean> => {
  try {
    // Esta é uma função simulada para envio de email com a cotação
    // Em um ambiente real, você faria uma chamada para o backend
    console.log(`Enviando cotação ${quotationId} por email para ${emailTo}`);
    
    // Simula o sucesso do envio
    return true;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return false;
  }
};
