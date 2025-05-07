
import React from "react";
import { Label } from "@/components/ui/label";
import { BRAZILIAN_STATES } from "@/utils/constants";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { CitySelectAutocomplete } from "@/components/common/CitySelectAutocomplete";

interface DestinationLocationFieldsProps {
  destinationCity: string;
  setDestinationCity: (value: string) => void;
  destinationState: string;
  setDestinationState: (value: string) => void;
}

export const DestinationLocationFields: React.FC<DestinationLocationFieldsProps> = ({
  destinationCity,
  setDestinationCity,
  destinationState,
  setDestinationState,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="destinationState">Estado de Destino</Label>
        <Select 
          value={destinationState} 
          onValueChange={(value) => {
            setDestinationState(value);
            setDestinationCity("");
          }}
        >
          <SelectTrigger id="destinationState">
            <SelectValue placeholder="Selecione o estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EX">Exterior</SelectItem>
            {BRAZILIAN_STATES.map((state) => (
              <SelectItem key={state.abbreviation} value={state.abbreviation}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="destinationCity">
          {destinationState === 'EX' ? 'País de Destino' : 'Cidade de Destino'}
        </Label>
        <CitySelectAutocomplete
          uf={destinationState}
          value={destinationCity}
          onChange={setDestinationCity}
          placeholder={destinationState === 'EX' ? "Digite o país de destino" : "Digite para buscar a cidade"}
          id="destinationCity"
        />
      </div>
    </div>
  );
};
