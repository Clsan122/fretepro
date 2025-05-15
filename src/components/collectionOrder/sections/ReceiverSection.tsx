
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CNPJLookupField } from "../CNPJLookupField";
import { UseFormReturn } from "react-hook-form";
import { CollectionOrderFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface ReceiverSectionProps {
  receiver: string;
  setReceiver: (value: string) => void;
  receiverAddress: string;
  setReceiverAddress: (value: string) => void;
  onOpenClientDialog: () => void;
  form: UseFormReturn<CollectionOrderFormValues>;
}

export const ReceiverSection: React.FC<ReceiverSectionProps> = ({
  receiver,
  setReceiver,
  receiverAddress,
  setReceiverAddress,
  onOpenClientDialog,
  form
}) => {
  const createHighlightedLabel = (text: string) => (
    <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1 rounded-none">
      {text}
    </Label>
  );

  const handleReceiverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiver(e.target.value);
    form.setValue("receiver", e.target.value, { shouldValidate: true });
  };

  const handleReceiverAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiverAddress(e.target.value);
    form.setValue("receiverAddress", e.target.value, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      {createHighlightedLabel("RECEBEDOR")}
      <CNPJLookupField 
        label="CNPJ do Recebedor" 
        onDataFetched={data => {
          setReceiver(data.name);
          setReceiverAddress(data.address);
          form.setValue("receiver", data.name, { shouldValidate: true });
          form.setValue("receiverAddress", data.address, { shouldValidate: true });
        }} 
      />
      
      <div>
        <Label>Nome do Recebedor</Label>
        <div className="flex gap-2">
          <Input 
            value={receiver} 
            onChange={handleReceiverChange}
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
          onChange={handleReceiverAddressChange}
          placeholder="Digite o endereço do recebedor" 
        />
      </div>
    </div>
  );
};
