
import { Freight, Client } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getClientById } from "@/utils/storage";

// Agrupa fretes por cliente para melhor organização
export const groupFreightsByClient = (freights: Freight[]): Record<string, {client: Client, freights: Freight[]}> => {
  return freights.reduce((acc, freight) => {
    const client = getClientById(freight.clientId);
    if (!client) return acc;
    
    if (!acc[client.id]) {
      acc[client.id] = {
        client,
        freights: []
      };
    }
    
    acc[client.id].freights.push(freight);
    return acc;
  }, {} as Record<string, {client: Client, freights: Freight[]}>);
};

// Calcula o valor total dos fretes
export const getTotalAmount = (freights: Freight[]): number => {
  return freights.reduce((sum, freight) => sum + freight.totalValue, 0);
};

// Obtém o intervalo de datas para o título do recibo
export const getDateRangeText = (freights: Freight[]): string => {
  if (freights.length === 0) return "";
  
  const dates = freights.map(f => new Date(f.createdAt));
  const earliestDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Se for o mesmo dia
  if (earliestDate.toDateString() === latestDate.toDateString()) {
    return format(earliestDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  }
  
  // Se for o mesmo mês e ano
  if (
    earliestDate.getMonth() === latestDate.getMonth() &&
    earliestDate.getFullYear() === latestDate.getFullYear()
  ) {
    return `${earliestDate.getDate()} a ${format(latestDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
  }
  
  // Meses diferentes
  return `${format(earliestDate, "d 'de' MMMM", { locale: ptBR })} a ${format(latestDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
};
