
import { BRAZILIAN_CITIES } from "./cities-data";

/**
 * Retorna uma lista de cidades para um determinado estado brasileiro
 * @param stateAbbreviation Sigla do estado (ex: SP, RJ)
 * @returns Array de strings com os nomes das cidades ordenadas alfabeticamente
 */
export const getBrazilianCities = (stateAbbreviation: string): string[] => {
  if (!stateAbbreviation || stateAbbreviation === "EX") {
    return [];
  }
  
  const cities = BRAZILIAN_CITIES[stateAbbreviation] || [];
  return [...cities].sort((a, b) => a.localeCompare(b, 'pt-BR'));
};
