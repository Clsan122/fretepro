
import { z } from "zod";

export const collectionOrderFormSchema = z.object({
  orderNumber: z.string().min(1, "Número da ordem é obrigatório"),
  
  // Remetente
  sender: z.string().min(1, "Nome do remetente é obrigatório"),
  senderCnpj: z.string().optional(),
  senderAddress: z.string().min(1, "Endereço do remetente é obrigatório"),
  senderCity: z.string().min(1, "Cidade do remetente é obrigatória"),
  senderState: z.string().min(1, "Estado do remetente é obrigatório"),
  
  // Destinatário
  recipient: z.string().min(1, "Nome do destinatário é obrigatório"),
  recipientAddress: z.string().min(1, "Endereço do destinatário é obrigatório"),
  
  // Expedidor
  shipper: z.string().min(1, "Nome do expedidor é obrigatório"),
  shipperAddress: z.string().min(1, "Endereço do expedidor é obrigatório"),
  
  // Recebedor
  receiver: z.string().optional(),
  receiverAddress: z.string().optional(),
  
  // Origem e destino
  originCity: z.string().min(1, "Cidade de origem é obrigatória"),
  originState: z.string().min(1, "Estado de origem é obrigatório"),
  destinationCity: z.string().min(1, "Cidade de destino é obrigatória"),
  destinationState: z.string().min(1, "Estado de destino é obrigatório"),
  
  // Carga
  cargoDescription: z.string().min(1, "Descrição da carga é obrigatória"),
  weight: z.number().min(0.01, "Peso deve ser maior que zero"),
  volumes: z.number().int().min(1, "Deve ter pelo menos 1 volume"),
  value: z.number().min(0, "Valor não pode ser negativo"),
  
  // Observações
  notes: z.string().optional(),
  invoiceNotes: z.string().optional(),
});

export type CollectionOrderFormData = z.infer<typeof collectionOrderFormSchema>;
export type CollectionOrderFormValues = CollectionOrderFormData;
