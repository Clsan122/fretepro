
import React from "react";
import { Label } from "@/components/ui/label";
import { BRAZILIAN_STATES } from "@/utils/constants";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { CitySelectAutocomplete } from "@/components/common/CitySelectAutocomplete";

interface OriginLocationFieldsProps {
  originCity: string;
  setOriginCity: (value: string) => void;
  originState: string;
  setOriginState: (value: string) => void;
}

export const OriginLocationFields: React.FC<OriginLocationFieldsProps> = ({
  originCity,
  setOriginCity,
  originState,
  setOriginState,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="originState">Estado de Origem</Label>
        <Select 
          value={originState} 
          onValueChange={(value) => {
            setOriginState(value);
            setOriginCity("");
          }}
        >
          <SelectTrigger id="originState">
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
        <Label htmlFor="originCity">
          {originState === 'EX' ? 'País de Origem' : 'Cidade de Origem'}
        </Label>
        <CitySelectAutocomplete
          uf={originState}
          value={originCity}
          onChange={setOriginCity}
          placeholder={originState === 'EX' ? "Digite o país de origem" : "Digite para buscar a cidade"}
          id="originCity"
        />
      </div>
    </div>
  );
};
