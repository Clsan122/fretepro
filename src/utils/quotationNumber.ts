
/**
 * Gera um número sequencial para cotações no formato YYYYNNNN
 * onde YYYY é o ano atual e NNNN é um número sequencial começando em 1001
 */
export function generateQuotationNumber(): string {
  // Obter cotações existentes do localStorage
  const quotations = JSON.parse(localStorage.getItem('quotations') || '[]');
  
  // Obter ano atual
  const year = new Date().getFullYear();
  
  // Se não existirem cotações, começar com o número 1001
  if (quotations.length === 0) {
    return `${year}1001`;
  }
  
  // Filtrar cotações do ano atual
  const currentYearQuotations = quotations.filter((quotation: any) => 
    quotation.orderNumber?.startsWith(year.toString())
  );
  
  // Se não houver cotações para o ano atual, começar com 1001
  if (currentYearQuotations.length === 0) {
    return `${year}1001`;
  }
  
  // Obter o maior número e incrementar em 1
  const highestNumber = Math.max(
    ...currentYearQuotations.map((quotation: any) => 
      parseInt(quotation.orderNumber?.slice(-4) || '1000')
    )
  );
  
  return `${year}${(highestNumber + 1).toString().padStart(4, '0')}`;
}
