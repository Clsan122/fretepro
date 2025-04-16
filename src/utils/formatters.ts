
export const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatBrazilianPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 11) {
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length > 7) {
      // For mobile numbers (with 9 digits)
      if (digits.length > 10) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
      } else {
        // For landline numbers (with 8 digits)
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      }
    }
    return formatted;
  }
  return value;
};

// Function to create a multi-freight receipt URL
export const createMultiFreightReceiptUrl = (freightIds: string[]) => {
  if (!freightIds.length) return "";
  return `/multi-freight-receipt?ids=${freightIds.join(",")}`;
};
