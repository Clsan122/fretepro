
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
    
    // Verificar se estamos em um dispositivo móvel
    const isMobile = window.innerWidth <= 640;
    
    // Gerar o canvas com configurações otimizadas para PDF
    const canvas = await html2canvas(element, {
      scale: isMobile ? 1.5 : 3, // Aumenta a resolução (mais para desktop)
      useCORS: true, // Permite carregar recursos de outros domínios
      logging: false,
      backgroundColor: '#FFFFFF',
      allowTaint: true,
      imageTimeout: 15000, // Maior timeout para imagens
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
            #${elementId} {
              width: 100% !important;
              max-width: 100% !important;
              padding: 5px !important;
            }
            #${elementId} * {
              font-size: 10px !important;
            }
            #${elementId} h1, #${elementId} h2 {
              font-size: 12px !important;
            }
            #${elementId} table {
              table-layout: fixed !important;
              width: 100% !important;
            }
            #${elementId} table td {
              word-break: break-word !important;
              overflow-wrap: break-word !important;
            }
            #${elementId} .grid-cols-2 {
              grid-template-columns: 1fr !important;
            }
          `;
          document.head.appendChild(styles);
        }
        
        // Adicionar estilo para garantir tudo em uma página
        const singlePageStyle = document.createElement('style');
        singlePageStyle.innerHTML = `
          #${elementId} {
            max-height: 270mm !important;
            width: ${isMobile ? '100%' : '210mm'} !important;
            page-break-inside: avoid !important;
          }
          #${elementId} .no-break {
            page-break-inside: avoid !important;
          }
          #${elementId} * {
            page-break-inside: avoid !important;
          }
        `;
        document.head.appendChild(singlePageStyle);
        
        return element;
      }
    });
    
    // Restaurar estado original do elemento
    element.style.width = originalWidth;
    restoreFromPrintMode(elementId);
    
    // Criar o PDF com qualidade otimizada
    const imgData = canvas.toDataURL('image/png', 0.95); // Alta qualidade
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true // Comprimir o PDF para reduzir o tamanho
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
    
    // Ajustar para caber em uma única página
    const imgWidth = pageWidth - 10; // Margens de 5mm em cada lado
    const ratio = canvas.width / imgWidth;
    const imgHeight = canvas.height / ratio;
    
    // Se a altura da imagem for maior que a página, redimensionar para caber em uma página
    if (imgHeight > pageHeight - 10) {
      const scaleFactor = (pageHeight - 10) / imgHeight;
      const finalWidth = imgWidth * scaleFactor;
      const finalHeight = imgHeight * scaleFactor;
      
      // Adicionar imagem ao PDF com margens e centralizada horizontalmente
      pdf.addImage(
        imgData,
        'PNG',
        5 + (pageWidth - finalWidth) / 2, // centralizar horizontalmente
        5, // 5mm de margem superior
        finalWidth,
        finalHeight
      );
    } else {
      // Adicionar a imagem ao PDF com margens
      pdf.addImage(
        imgData,
        'PNG', 
        5, // 5mm de margem esquerda
        5, // 5mm de margem superior
        imgWidth,
        imgHeight
      );
    }
    
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
