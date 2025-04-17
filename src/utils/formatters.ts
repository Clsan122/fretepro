
export const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatBrazilianPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  
  if (digits.length === 0) return '';
  
  if (digits.length <= 2) {
    return `(${digits}`;
  }
  
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  
  if (digits.length <= 10) {
    // Telefone fixo (8 dígitos)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  
  // Celular (9 dígitos com o 9 na frente)
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
};

// Function to create a multi-freight receipt URL
export const createMultiFreightReceiptUrl = (freightIds: string[]) => {
  if (!freightIds.length) return "";
  return `/multi-freight-receipt?ids=${freightIds.join(",")}`;
};
