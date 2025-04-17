
export interface ClientFormData {
  name: string;        // Required field
  city: string;        // Required field
  state: string;       // Required field
  cnpj?: string;       // Optional for legal person
  cpf?: string;        // Optional for natural person
  address?: string;    // Optional field
  phone: string;       // Required field with national format
  personType: 'physical' | 'legal'; // Required field
}
