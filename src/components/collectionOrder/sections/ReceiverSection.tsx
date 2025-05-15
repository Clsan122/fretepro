
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
    <div className="pb-2 mb-3 border-b border-freight-100">
      <Label className="text-lg font-bold text-freight-700">
        {text}
      </Label>
    </div>
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
    <div className="space-y-5 bg-white p-4 rounded-lg border border-freight-100">
      {createHighlightedLabel("RECEBEDOR")}
      <div className="space-y-4">
        <CNPJLookupField 
          label="CNPJ do Recebedor" 
          onDataFetched={data => {
            setReceiver(data.name);
            setReceiverAddress(data.address);
            form.setValue("receiver", data.name, { shouldValidate: true });
            form.setValue("receiverAddress", data.address, { shouldValidate: true });
          }} 
        />
        
        <FormField
          control={form.control}
          name="receiver"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Recebedor</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input 
                    {...field}
                    value={receiver} 
                    onChange={handleReceiverChange}
                    placeholder="Digite o nome do recebedor" 
                    className="bg-white"
                  />
                </FormControl>
                <Button type="button" variant="outline" size="icon" onClick={onOpenClientDialog}
                  className="hover:bg-freight-50 transition-colors">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="receiverAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço do Recebedor</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  value={receiverAddress} 
                  onChange={handleReceiverAddressChange}
                  placeholder="Digite o endereço do recebedor" 
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
