
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BRAZILIAN_STATES } from "@/utils/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface LocationsProps {
  originCity: string;
  setOriginCity: (value: string) => void;
  originState: string;
  setOriginState: (value: string) => void;
  destinationCity: string;
  setDestinationCity: (value: string) => void;
  destinationState: string;
  setDestinationState: (value: string) => void;
  receiver: string;
  setReceiver: (value: string) => void;
}

export const LocationsSection: React.FC<LocationsProps> = ({
  originCity,
  setOriginCity,
  originState,
  setOriginState,
  destinationCity,
  setDestinationCity,
  destinationState,
  setDestinationState,
  receiver,
  setReceiver
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Localização</CardTitle>
        <CardDescription>Informe os dados de origem e destino</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Origem</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="originCity">Cidade</Label>
                <Input
                  id="originCity"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  placeholder="Cidade de origem"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originState">Estado</Label>
                <Select
                  value={originState}
                  onValueChange={(value) => setOriginState(value)}
                >
                  <SelectTrigger id="originState">
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAZILIAN_STATES.map((state) => (
                      <SelectItem key={state.abbreviation} value={state.abbreviation}>
                        {state.abbreviation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Destino</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="destinationCity">Cidade</Label>
                <Input
                  id="destinationCity"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  placeholder="Cidade de destino"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinationState">Estado</Label>
                <Select
                  value={destinationState}
                  onValueChange={(value) => setDestinationState(value)}
                >
                  <SelectTrigger id="destinationState">
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAZILIAN_STATES.map((state) => (
                      <SelectItem key={state.abbreviation} value={state.abbreviation}>
                        {state.abbreviation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="receiver">Recebedor / Destinatário</Label>
          <Input
            id="receiver"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Nome de quem vai receber a mercadoria no destino"
          />
        </div>
      </CardContent>
    </Card>
  );
};
