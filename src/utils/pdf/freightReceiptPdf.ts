
/**
 * Freight receipt-specific PDF generation utilities
 */
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { generateCanvasFromElement, generatePdfFromCanvas } from "./pdfCore";

/**
 * Prepara o elemento para o modo de impressão
 */
export const prepareForPrintMode = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add("pdf-generation-mode");
    // Adicionar classe para ajudar a estilizar para impressão
    document.body.classList.add("printing-receipt");
  }
};

/**
 * Restaura o elemento do modo de impressão
 */
export const restoreFromPrintMode = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.remove("pdf-generation-mode");
    // Remover classe de estilo de impressão
    document.body.classList.remove("printing-receipt");
  }
};

/**
 * Gerar PDF para um único recibo de frete
 */
export const generateFreightReceiptPdf = async (freightId: string): Promise<boolean> => {
  try {
    const printElement = document.getElementById("receipt-container");
    if (!printElement) {
      console.error("Elemento de recibo não encontrado");
      return false;
    }

    // Preparar o elemento para impressão
    prepareForPrintMode("receipt-container");

    // Gerar canvas a partir do elemento
    const canvas = await generateCanvasFromElement("receipt-container", {
      scale: 2,
      setWidth: "800px",
      restoreWidth: true
    });

    // Restaurar o elemento
    restoreFromPrintMode("receipt-container");

    // Gerar PDF do canvas
    const pdf = generatePdfFromCanvas(canvas, {
      filename: `recibo-frete-${freightId}.pdf`,
      title: "Recibo de Frete",
      subject: "Recibo de prestação de serviços de frete",
      author: "FreteValor"
    });

    return true;
  } catch (error) {
    console.error("Erro ao gerar PDF do recibo de frete:", error);
    return false;
  }
};

/**
 * Gerar PDF para múltiplos recibos de frete
 */
export const generateMultiFreightReceiptPdf = async (freightIds: string[]): Promise<boolean> => {
  try {
    const printElement = document.getElementById("multi-receipt-container");
    if (!printElement) {
      console.error("Elemento de recibo múltiplo não encontrado");
      return false;
    }

    // Preparar o elemento para impressão
    prepareForPrintMode("multi-receipt-container");

    // Gerar canvas a partir do elemento
    const canvas = await generateCanvasFromElement("multi-receipt-container", {
      scale: 2,
      setWidth: "800px",
      restoreWidth: true
    });

    // Restaurar o elemento
    restoreFromPrintMode("multi-receipt-container");

    // Gerar PDF do canvas
    const pdf = generatePdfFromCanvas(canvas, {
      filename: `recibo-multiplo-fretes.pdf`,
      title: "Recibo Múltiplo de Fretes",
      subject: "Recibo de prestação de serviços de múltiplos fretes",
      author: "FreteValor"
    });

    return true;
  } catch (error) {
    console.error("Erro ao gerar PDF do recibo múltiplo:", error);
    return false;
  }
};

/**
 * Abre o PDF em uma nova janela
 */
export const previewFreightReceiptPdf = async (freightId: string): Promise<boolean> => {
  try {
    const printElement = document.getElementById("receipt-container");
    if (!printElement) {
      console.error("Elemento de recibo não encontrado");
      return false;
    }

    // Preparar o elemento para impressão
    prepareForPrintMode("receipt-container");

    // Gerar canvas a partir do elemento
    const canvas = await generateCanvasFromElement("receipt-container", {
      scale: 2,
      setWidth: "800px",
      restoreWidth: true
    });

    // Restaurar o elemento
    restoreFromPrintMode("receipt-container");

    // Gerar PDF do canvas e abrir em nova janela
    const pdf = generatePdfFromCanvas(canvas, {
      title: "Recibo de Frete",
      subject: "Recibo de prestação de serviços de frete",
      author: "FreteValor"
    });

    const pdfOutput = pdf.output('datauristring');
    window.open(pdfOutput, '_blank');

    return true;
  } catch (error) {
    console.error("Erro ao gerar preview do PDF:", error);
    return false;
  }
};
