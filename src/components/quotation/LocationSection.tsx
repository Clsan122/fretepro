
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

interface LocationSectionProps {
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  onOriginCityChange: (city: string) => void;
  onOriginStateChange: (state: string) => void;
  onDestinationCityChange: (city: string) => void;
  onDestinationStateChange: (state: string) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  originCity,
  originState,
  destinationCity,
  destinationState,
  onOriginCityChange,
  onOriginStateChange,
  onDestinationCityChange,
  onDestinationStateChange,
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-freight-100 dark:border-freight-800">
      <CardHeader className="bg-freight-50/50 dark:bg-freight-900/50">
        <CardTitle className="text-freight-700 dark:text-freight-300">
          Origem e Destino
        </CardTitle>
        <CardDescription>
          Informe as cidades e estados de origem e destino da carga
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Origin */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-freight-700 dark:text-freight-300">Origem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originState">Estado</Label>
              <Select value={originState} onValueChange={onOriginStateChange}>
                <SelectTrigger id="originState" className="w-full">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value} className="cursor-pointer">
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="originCity">Cidade</Label>
              <Input
                id="originCity"
                placeholder="Digite a cidade de origem"
                value={originCity}
                onChange={(e) => onOriginCityChange(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-freight-700 dark:text-freight-300">Destino</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destinationState">Estado</Label>
              <Select value={destinationState} onValueChange={onDestinationStateChange}>
                <SelectTrigger id="destinationState" className="w-full">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value} className="cursor-pointer">
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationCity">Cidade</Label>
              <Input
                id="destinationCity"
                placeholder="Digite a cidade de destino"
                value={destinationCity}
                onChange={(e) => onDestinationCityChange(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
