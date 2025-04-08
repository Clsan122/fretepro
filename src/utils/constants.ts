
import { BrazilianState } from "@/types";

export const BRAZILIAN_STATES: BrazilianState[] = [
  { name: "Acre", abbreviation: "AC" },
  { name: "Alagoas", abbreviation: "AL" },
  { name: "Amapá", abbreviation: "AP" },
  { name: "Amazonas", abbreviation: "AM" },
  { name: "Bahia", abbreviation: "BA" },
  { name: "Ceará", abbreviation: "CE" },
  { name: "Distrito Federal", abbreviation: "DF" },
  { name: "Espírito Santo", abbreviation: "ES" },
  { name: "Goiás", abbreviation: "GO" },
  { name: "Maranhão", abbreviation: "MA" },
  { name: "Mato Grosso", abbreviation: "MT" },
  { name: "Mato Grosso do Sul", abbreviation: "MS" },
  { name: "Minas Gerais", abbreviation: "MG" },
  { name: "Pará", abbreviation: "PA" },
  { name: "Paraíba", abbreviation: "PB" },
  { name: "Paraná", abbreviation: "PR" },
  { name: "Pernambuco", abbreviation: "PE" },
  { name: "Piauí", abbreviation: "PI" },
  { name: "Rio de Janeiro", abbreviation: "RJ" },
  { name: "Rio Grande do Norte", abbreviation: "RN" },
  { name: "Rio Grande do Sul", abbreviation: "RS" },
  { name: "Rondônia", abbreviation: "RO" },
  { name: "Roraima", abbreviation: "RR" },
  { name: "Santa Catarina", abbreviation: "SC" },
  { name: "São Paulo", abbreviation: "SP" },
  { name: "Sergipe", abbreviation: "SE" },
  { name: "Tocantins", abbreviation: "TO" }
];

export const CARGO_TYPES = [
  { value: "general", label: "Carga Geral" },
  { value: "dangerous", label: "Carga Perigosa" },
  { value: "liquid", label: "Carga Líquida" },
  { value: "sackCargo", label: "Sacaria" },
  { value: "drum", label: "Tambor" },
  { value: "pallet", label: "Pallet" }
];

export const VEHICLE_TYPES = [
  { value: "fiorino", label: "Fiorino" },
  { value: "van", label: "Van" },
  { value: "vlc", label: "VLC (Iveco, Sprinter, Master - Baú)" },
  { value: "threeQuarter", label: "3/4" },
  { value: "toco", label: "Toco" },
  { value: "truck", label: "Truck" },
  { value: "trailer", label: "Carreta" }
];
