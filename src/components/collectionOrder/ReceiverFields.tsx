
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ReceiverFieldsProps {
  receiver: string;
  setReceiver: (value: string) => void;
  receiverAddress: string;
  setReceiverAddress: (value: string) => void;
}

export const ReceiverFields: React.FC<ReceiverFieldsProps> = ({
  receiver,
  setReceiver,
  receiverAddress,
  setReceiverAddress,
}) => (
  <>
    <div className="mt-6 space-y-2">
      <Label htmlFor="receiver">Recebedor</Label>
      <Input
        id="receiver"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        placeholder="Nome do recebedor"
      />
    </div>
    <div className="mt-4 space-y-2">
      <Label htmlFor="receiverAddress">Endereço do Recebedor</Label>
      <Input
        id="receiverAddress"
        value={receiverAddress}
        onChange={(e) => setReceiverAddress(e.target.value)}
        placeholder="Endereço de entrega"
      />
    </div>
  </>
);
