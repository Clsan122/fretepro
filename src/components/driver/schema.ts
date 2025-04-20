
import { z } from "zod";

export const driverFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(11, "CPF inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  address: z.string().optional(),
  licensePlate: z.string().min(1, "Placa do veículo é obrigatória"),
  trailerPlate: z.string().optional(),
  vehicleType: z.string().min(1, "Tipo de veículo é obrigatório"),
  bodyType: z.string().min(1, "Tipo de carroceria é obrigatório"),
  anttCode: z.string().min(1, "Código ANTT é obrigatório"),
  vehicleYear: z.string().min(1, "Ano do veículo é obrigatório"),
  vehicleModel: z.string().min(1, "Modelo do veículo é obrigatório"),
});

export type DriverFormData = z.infer<typeof driverFormSchema>;
