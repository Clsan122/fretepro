
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CNPJLookupField } from "../CNPJLookupField";
import { UseFormReturn } from "react-hook-form";
import { CollectionOrderFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface RecipientSectionProps {
  recipient: string;
  setRecipient: (value: string) => void;
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
  onOpenClientDialog: () => void;
  form: UseFormReturn<CollectionOrderFormValues>;
}

export const RecipientSection: React.FC<RecipientSectionProps> = ({
  recipient,
  setRecipient,
  recipientAddress,
  setRecipientAddress,
  onOpenClientDialog,
  form
}) => {
  const createHighlightedLabel = (text: string) => (
    <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1 rounded-none">
      {text}
    </Label>
  );

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
    form.setValue("recipient", e.target.value, { shouldValidate: true });
  };

  const handleRecipientAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(e.target.value);
    form.setValue("recipientAddress", e.target.value, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      {createHighlightedLabel("DESTINATÁRIO")}
      <CNPJLookupField 
        label="CNPJ do Destinatário" 
        onDataFetched={data => {
          setRecipient(data.name);
          setRecipientAddress(data.address);
          form.setValue("recipient", data.name, { shouldValidate: true });
          form.setValue("recipientAddress", data.address, { shouldValidate: true });
        }} 
      />
      
      <FormField
        control={form.control}
        name="recipient"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Destinatário</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  {...field}
                  value={recipient}
                  onChange={handleRecipientChange}
                  placeholder="Digite o nome do destinatário"
                />
              </FormControl>
              <Button type="button" variant="outline" size="icon" onClick={onOpenClientDialog}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="recipientAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço do Destinatário</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={recipientAddress}
                onChange={handleRecipientAddressChange}
                placeholder="Digite o endereço do destinatário"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
