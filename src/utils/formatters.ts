
/**
 * Formata um valor numérico como moeda (R$)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formata um valor numérico como moeda (R$) sem o símbolo
 */
export const formatCurrencyWithoutSymbol = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formata um percentual com até 7 casas decimais (para o campo de seguro)
 */
export const formatInsuranceRate = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 1,
    maximumFractionDigits: 7,
  }).format(value);
};

/**
 * Converte uma string formatada como moeda pt-BR para número
 */
export const parseCurrencyString = (value: string): number => {
  if (!value) return 0;
  return Number(value.replace(/\./g, "").replace(",", "."));
};

/**
 * Formata uma data para o formato brasileiro (dia/mês/ano)
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("pt-BR");
};

/**
 * Formata um número para exibição com separador de milhares
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("pt-BR").format(value);
};

/**
 * Formata um CPF (000.000.000-00)
 */
export const formatCPF = (value: string): string => {
  const cpf = value.replace(/\D/g, '').slice(0, 11);
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
};

/**
 * Formata um CEP (00000-000)
 */
export const formatCEP = (value: string): string => {
  const cep = value.replace(/\D/g, '').slice(0, 8);
  if (cep.length <= 5) return cep;
  return `${cep.slice(0, 5)}-${cep.slice(5)}`;
};

/**
 * Formata um CNPJ (00.000.000/0000-00)
 */
export const formatCNPJ = (value: string): string => {
  const cnpj = value.replace(/\D/g, '').slice(0, 14);
  if (cnpj.length <= 2) return cnpj;
  if (cnpj.length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
  if (cnpj.length <= 8) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
  if (cnpj.length <= 12) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
};

/**
 * Formata um telefone brasileiro ((00) 00000-0000)
 */
export const formatBrazilianPhone = (value: string): string => {
  const phone = value.replace(/\D/g, '').slice(0, 11);
  if (phone.length <= 2) return phone;
  if (phone.length <= 7) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
  return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
};

/**
 * Formata um CPF ou CNPJ dependendo do tamanho
 */
export const formatCPFCNPJ = (value: string): string => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return formatCPF(numbers);
  } else {
    return formatCNPJ(numbers);
  }
};

/**
 * Formata um número de telefone brasileiro
 */
export const formatPhone = (value: string): string => {
  return formatBrazilianPhone(value);
};

/**
 * Cria uma URL para o recibo de múltiplos fretes
 */
export const createMultiFreightReceiptUrl = (freightIds: string[]): string => {
  return `/multi-freight-receipt?ids=${freightIds.join(',')}`;
};

/**
 * Formata uma placa de veículo (AAA-0000)
 */
export const formatLicensePlate = (value: string): string => {
  const plate = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (plate.length <= 3) return plate;
  return `${plate.slice(0, 3)}-${plate.slice(3, 7)}`;
};

/**
 * Formata um percentual para exibição
 */
export const formatPercent = (value: number): string => {
  return `${value.toFixed(2).replace('.', ',')}%`;
};

/**
 * Converte um valor de percentual de string para número
 */
export const parsePercentString = (value: string): number => {
  const cleaned = value.replace(/[^\d,\.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};
