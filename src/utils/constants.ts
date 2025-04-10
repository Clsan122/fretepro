
// Vehicle types for the freight form
export const VEHICLE_TYPES = [
  { value: 'fiorino', label: 'Fiorino' },
  { value: 'van', label: 'Van' },
  { value: 'vlc', label: 'VLC' },
  { value: 'threeQuarter', label: 'Truck 3/4' },
  { value: 'toco', label: 'Truck Toco' },
  { value: 'truck', label: 'Truck' },
  { value: 'trailer', label: 'Trailer' }
];

// Body types for the vehicle
export const BODY_TYPES = [
  { value: 'open', label: 'Aberta' },
  { value: 'closed', label: 'Fechada' },
  { value: 'sider', label: 'Sider' },
  { value: 'van', label: 'Baú' },
  { value: 'utility', label: 'Utilitário' }
];

// Brazilian states 
export const BRAZILIAN_STATES = [
  { abbreviation: 'AC', name: 'Acre' },
  { abbreviation: 'AL', name: 'Alagoas' },
  { abbreviation: 'AP', name: 'Amapá' },
  { abbreviation: 'AM', name: 'Amazonas' },
  { abbreviation: 'BA', name: 'Bahia' },
  { abbreviation: 'CE', name: 'Ceará' },
  { abbreviation: 'DF', name: 'Distrito Federal' },
  { abbreviation: 'ES', name: 'Espírito Santo' },
  { abbreviation: 'GO', name: 'Goiás' },
  { abbreviation: 'MA', name: 'Maranhão' },
  { abbreviation: 'MT', name: 'Mato Grosso' },
  { abbreviation: 'MS', name: 'Mato Grosso do Sul' },
  { abbreviation: 'MG', name: 'Minas Gerais' },
  { abbreviation: 'PA', name: 'Pará' },
  { abbreviation: 'PB', name: 'Paraíba' },
  { abbreviation: 'PR', name: 'Paraná' },
  { abbreviation: 'PE', name: 'Pernambuco' },
  { abbreviation: 'PI', name: 'Piauí' },
  { abbreviation: 'RJ', name: 'Rio de Janeiro' },
  { abbreviation: 'RN', name: 'Rio Grande do Norte' },
  { abbreviation: 'RS', name: 'Rio Grande do Sul' },
  { abbreviation: 'RO', name: 'Rondônia' },
  { abbreviation: 'RR', name: 'Roraima' },
  { abbreviation: 'SC', name: 'Santa Catarina' },
  { abbreviation: 'SP', name: 'São Paulo' },
  { abbreviation: 'SE', name: 'Sergipe' },
  { abbreviation: 'TO', name: 'Tocantins' }
];

// Cargo types
export const CARGO_TYPES = [
  { value: 'general', label: 'Carga Geral' },
  { value: 'fragile', label: 'Frágil' },
  { value: 'perishable', label: 'Perecível' },
  { value: 'hazardous', label: 'Perigosa' },
  { value: 'refrigerated', label: 'Refrigerada' },
  { value: 'live', label: 'Viva' },
  { value: 'bulk', label: 'Granel' },
  { value: 'container', label: 'Container' },
  { value: 'other', label: 'Outro' }
];

// Payment terms for freight
export const PAYMENT_TERMS = [
  { value: 'cash', label: 'À Vista' },
  { value: '15days', label: '15 Dias' },
  { value: '30days', label: '30 Dias' },
  { value: '45days', label: '45 Dias' },
  { value: '60days', label: '60 Dias' },
  { value: 'other', label: 'Outro' }
];
