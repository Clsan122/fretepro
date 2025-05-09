
/**
 * Freight receipt-specific PDF generation utilities
 */

export const generateFreightReceiptPdf = async (freightId: string): Promise<boolean> => {
  try {
    console.log("Gerando PDF para recibo de frete:", freightId);
    console.log("Comando seria: chrome-headless-render-pdf --url=http://localhost:3000/freight-receipt/" + 
      freightId + "/pdf --pdf=recibo-" + freightId + ".pdf --include-background --display-header-footer");

    // Por enquanto só imprime a página atual usando a API de impressão do browser
    window.print();
    return true;
  } catch (error) {
    console.error("Erro ao gerar PDF do recibo de frete:", error);
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
    console.error("Erro ao gerar PDF do recibo múltiplo:", error);
    return false;
  }
};
