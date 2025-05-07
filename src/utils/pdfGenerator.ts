
/**
 * Módulo para geração de PDF usando html2canvas e jsPDF
 */

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generateQuotationPdf = async (quotationId: string): Promise<boolean> => {
  try {
    const printElement = document.getElementById('quotation-pdf');
    
    if (!printElement) {
      throw new Error("Elemento de impressão não encontrado");
    }
    
    // Salvar as dimensões originais
    const originalWidth = printElement.style.width;
    
    // Definir uma largura fixa para melhor qualidade
    printElement.style.width = '800px';
    
    const canvas = await html2canvas(printElement, {
      scale: 2, // Escala maior para melhor qualidade
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      allowTaint: true,
    });
    
    // Restaurar as dimensões originais
    printElement.style.width = originalWidth;
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calcular a proporção para ajustar à página A4
    const imgWidth = pageWidth - 20; // Margem de 10mm em cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Se a imagem for maior que a página, precisamos dividi-la
    if (imgHeight > pageHeight - 20) {
      let positionY = 10;
      const availableHeight = pageHeight - 20;
      const totalPages = Math.ceil(imgHeight / availableHeight);
      
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        // Recortes da imagem para cada página
        const sourceY = (canvas.height / imgHeight) * availableHeight * i;
        const sourceHeight = (canvas.height / imgHeight) * availableHeight;
        
        pdf.addImage(
          imgData, 
          'PNG', 
          10, 
          10, 
          imgWidth, 
          availableHeight, 
          `page-${i}`, 
          'FAST',
          0,
          sourceY,
          canvas.width,
          sourceHeight
        );
      }
    } else {
      // Se a imagem cabe em uma página, adicione-a centralmente
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    }
    
    // Adicionar metadados ao PDF
    pdf.setProperties({
      title: `Cotação de Frete - ${quotationId}`,
      subject: 'Cotação de serviços de transporte',
      author: 'Sistema de Gestão de Fretes',
      keywords: 'cotação, frete, transporte, logística',
      creator: 'FreteValor App'
    });
    
    // Salvar o PDF com nome personalizado
    pdf.save(`cotacao-frete-${quotationId}.pdf`);
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

// Restante das funções existentes
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
