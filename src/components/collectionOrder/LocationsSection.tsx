
// Refatorado para componentes menores para facilitar a manutenção
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OriginLocationFields } from "./OriginLocationFields";
import { DestinationLocationFields } from "./DestinationLocationFields";
import { ReceiverFields } from "./ReceiverFields";

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
  receiverAddress: string;
  setReceiverAddress: (value: string) => void;
}

export const LocationsSection: React.FC<LocationsProps> = (props) => {
  const {
    originCity, setOriginCity, originState, setOriginState,
    destinationCity, setDestinationCity, destinationState, setDestinationState,
    receiver, setReceiver, receiverAddress, setReceiverAddress
  } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Localidades</CardTitle>
        <CardDescription>Informe a origem e destino da carga</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OriginLocationFields
            originCity={originCity}
            setOriginCity={setOriginCity}
            originState={originState}
            setOriginState={setOriginState}
          />
          <DestinationLocationFields
            destinationCity={destinationCity}
            setDestinationCity={setDestinationCity}
            destinationState={destinationState}
            setDestinationState={setDestinationState}
          />
        </div>
        <ReceiverFields
          receiver={receiver}
          setReceiver={setReceiver}
          receiverAddress={receiverAddress}
          setReceiverAddress={setReceiverAddress}
        />
      </CardContent>
    </Card>
  );
};
