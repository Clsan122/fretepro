
/**
 * Collection order-specific PDF generation utilities
 */

export const generateCollectionOrderPdf = async (orderId: string): Promise<boolean> => {
  try {
    console.log("Gerando PDF para ordem de coleta:", orderId);
    console.log("Comando seria: chrome-headless-render-pdf --url=http://localhost:3000/collection-order/" + 
      orderId + "/pdf --pdf=ordem-coleta-" + orderId + ".pdf --include-background --display-header-footer");

    // Por enquanto só imprime a página atual usando a API de impressão do browser
    window.print();
    return true;
  } catch (error) {
    console.error("Erro ao gerar PDF da ordem de coleta:", error);
    return false;
  }
};
