
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
    <div className="pb-2 mb-3 border-b border-freight-100">
      <Label className="text-lg font-bold text-freight-700">
        {text}
      </Label>
    </div>
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
    <div className="space-y-5 bg-white p-4 rounded-lg border border-freight-100">
      {createHighlightedLabel("DESTINATÁRIO")}
      <div className="space-y-4">
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
              <FormLabel variant="required">Nome do Destinatário</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    {...field}
                    value={recipient}
                    onChange={handleRecipientChange}
                    placeholder="Digite o nome do destinatário"
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
          name="recipientAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel variant="required">Endereço do Destinatário</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={recipientAddress}
                  onChange={handleRecipientAddressChange}
                  placeholder="Digite o endereço do destinatário"
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
