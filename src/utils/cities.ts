
import { BRAZILIAN_CITIES } from "./cities-data";

/**
 * Retorna uma lista de cidades para um determinado estado brasileiro
 * @param stateAbbreviation Sigla do estado (ex: SP, RJ)
 * @returns Array de strings com os nomes das cidades
 */
export const getBrazilianCities = (stateAbbreviation: string): string[] => {
  if (!stateAbbreviation || stateAbbreviation === "EX") {
    return [];
  }
  
  return BRAZILIAN_CITIES[stateAbbreviation] || [];
};
