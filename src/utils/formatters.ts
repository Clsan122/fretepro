
export const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 3) return digits;
  if (digits.length < 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length < 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
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
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export const formatCNPJ = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
};

export const createMultiFreightReceiptUrl = (freightIds: string[]) => {
  if (!freightIds.length) return "";
  return `/multi-freight-receipt?ids=${freightIds.join(",")}`;
};

// Format date to DD/MM/YYYY
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Format number as Brazilian currency (R$)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
