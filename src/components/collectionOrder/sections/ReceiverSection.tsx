
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CNPJLookupField } from "../CNPJLookupField";

interface ReceiverSectionProps {
  receiver: string;
  setReceiver: (value: string) => void;
  receiverAddress: string;
  setReceiverAddress: (value: string) => void;
  onOpenClientDialog: () => void;
}

export const ReceiverSection: React.FC<ReceiverSectionProps> = ({
  receiver,
  setReceiver,
  receiverAddress,
  setReceiverAddress,
  onOpenClientDialog
}) => {
  const createHighlightedLabel = (text: string) => (
    <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1 rounded-none">
      {text}
    </Label>
  );

  return (
    <div className="space-y-4">
      {createHighlightedLabel("RECEBEDOR")}
      <CNPJLookupField 
        label="CNPJ do Recebedor" 
        onDataFetched={data => {
          setReceiver(data.name);
          setReceiverAddress(data.address);
        }} 
      />
      <div>
        <Label>Nome do Recebedor</Label>
        <div className="flex gap-2">
          <Input 
            value={receiver} 
            onChange={e => setReceiver(e.target.value)} 
            placeholder="Digite o nome do recebedor" 
          />
          <Button type="button" variant="outline" size="icon" onClick={onOpenClientDialog}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label>Endereço do Recebedor</Label>
        <Input 
          value={receiverAddress} 
          onChange={e => setReceiverAddress(e.target.value)} 
          placeholder="Digite o endereço do recebedor" 
        />
      </div>
    </div>
  );
};
