
import { z } from "zod";

export const collectionOrderSchema = z.object({
  sender: z.string().min(1, { message: "Nome da transportadora é obrigatório" }),
  senderAddress: z.string().min(1, { message: "Endereço da transportadora é obrigatório" }),
  recipient: z.string().min(1, { message: "Nome do destinatário é obrigatório" }),
  recipientAddress: z.string().min(1, { message: "Endereço do destinatário é obrigatório" }),
  shipper: z.string().min(1, { message: "Nome do remetente é obrigatório" }),
  shipperAddress: z.string().min(1, { message: "Endereço do remetente é obrigatório" }),
  originCity: z.string().min(1, { message: "Cidade de origem é obrigatória" }),
  originState: z.string().length(2, { message: "Estado de origem inválido" }),
  destinationCity: z.string().min(1, { message: "Cidade de destino é obrigatória" }),
  destinationState: z.string().length(2, { message: "Estado de destino inválido" }),
  volumes: z.number().int().min(1, { message: "Quantidade de volumes deve ser maior que zero" }),
  weight: z.number().min(0.1, { message: "Peso deve ser maior que zero" }),
  
  // Campos opcionais
  receiver: z.string().optional(),
  receiverAddress: z.string().optional(),
  senderCnpj: z.string().optional(),
  senderCity: z.string().optional(),
  senderState: z.string().optional(),
  invoiceNumber: z.string().optional(),
  observations: z.string().optional(),
  driverId: z.string().optional(),
  merchandiseValue: z.number().min(0).optional(),
});

export type CollectionOrderFormValues = z.infer<typeof collectionOrderSchema>;
