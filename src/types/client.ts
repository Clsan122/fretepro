
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

// Ensure Client interface includes all fields needed for address auto-fill
export interface Client {
  id: string;
  name: string;
  city: string;
  state: string;
  cnpj?: string;
  cpf?: string;
  address?: string;
  phone?: string;
  logo?: string;
  personType: 'physical' | 'legal';
  userId?: string;     // Added userId field for better data association
  createdAt?: string;  // Added creation timestamp
}
