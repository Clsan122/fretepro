
/**
 * Email-specific PDF functionality
 */

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
