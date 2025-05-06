
import React from "react";
import { OriginLocationFields } from "./OriginLocationFields";
import { DestinationLocationFields } from "./DestinationLocationFields";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LocationsSectionProps {
  originCity: string;
  setOriginCity: (value: string) => void;
  originState: string;
  setOriginState: (value: string) => void;
  destinationCity: string;
  setDestinationCity: (value: string) => void;
  destinationState: string;
  setDestinationState: (value: string) => void;
  receiver?: string;
  setReceiver?: (value: string) => void;
  receiverAddress?: string;
  setReceiverAddress?: (value: string) => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  originCity,
  setOriginCity,
  originState,
  setOriginState,
  destinationCity,
  setDestinationCity,
  destinationState,
  setDestinationState,
  receiver,
  setReceiver,
  receiverAddress,
  setReceiverAddress,
}) => {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Localidades</CardTitle>
        <CardDescription>Informe as cidades e estados de origem e destino</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <OriginLocationFields 
              originCity={originCity}
              setOriginCity={setOriginCity}
              originState={originState}
              setOriginState={setOriginState}
            />
          </div>
          
          <div className="space-y-2">
            <DestinationLocationFields
              destinationCity={destinationCity}
              setDestinationCity={setDestinationCity}
              destinationState={destinationState}
              setDestinationState={setDestinationState}
            />
          </div>
        </div>
        
        {/* Only render receiver fields if they are provided */}
        {setReceiver && setReceiverAddress && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="receiver">Recebedor / Destinatário</Label>
              <Input
                id="receiver"
                value={receiver || ""}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="Nome de quem vai receber a mercadoria no destino"
                autoComplete="name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="receiverAddress">Endereço do Destinatário</Label>
              <Input
                id="receiverAddress"
                value={receiverAddress || ""}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="Endereço completo do destinatário"
                autoComplete="street-address"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
