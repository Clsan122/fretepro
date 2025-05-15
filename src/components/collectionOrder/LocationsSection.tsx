
import React from "react";
import { OriginLocationFields } from "./OriginLocationFields";
import { DestinationLocationFields } from "./DestinationLocationFields";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationsSectionProps {
  originCity: string;
  setOriginCity: (value: string) => void;
  originState: string;
  setOriginState: (value: string) => void;
  destinationCity: string;
  setDestinationCity: (value: string) => void;
  destinationState: string;
  setDestinationState: (value: string) => void;
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
}) => {
  return (
    <Card className="border border-freight-100 overflow-hidden">
      <CardHeader className="p-4 sm:p-5 bg-gradient-to-r from-freight-50 to-white">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-freight-600" />
          Informações de Localidades
        </CardTitle>
        <CardDescription>Informe as cidades e estados de origem e destino</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-freight-50/30 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-freight-700 border-b pb-2 border-freight-100">Origem</h3>
            <OriginLocationFields 
              originCity={originCity}
              setOriginCity={setOriginCity}
              originState={originState}
              setOriginState={setOriginState}
            />
          </div>
          
          <div className="space-y-3 bg-freight-50/30 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-freight-700 border-b pb-2 border-freight-100">Destino</h3>
            <DestinationLocationFields
              destinationCity={destinationCity}
              setDestinationCity={setDestinationCity}
              destinationState={destinationState}
              setDestinationState={setDestinationState}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
