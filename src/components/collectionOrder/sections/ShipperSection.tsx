
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CNPJLookupField } from "../CNPJLookupField";
import { UseFormReturn } from "react-hook-form";
import { CollectionOrderFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface ShipperSectionProps {
  shipper: string;
  setShipper: (value: string) => void;
  shipperAddress: string;
  setShipperAddress: (value: string) => void;
  onOpenClientDialog: () => void;
  form: UseFormReturn<CollectionOrderFormValues>;
}

export const ShipperSection: React.FC<ShipperSectionProps> = ({
  shipper,
  setShipper,
  shipperAddress,
  setShipperAddress,
  onOpenClientDialog,
  form
}) => {
  const createHighlightedLabel = (text: string) => (
    <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1 rounded-none">
      {text}
    </Label>
  );

  const handleShipperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipper(e.target.value);
    form.setValue("shipper", e.target.value, { shouldValidate: true });
  };

  const handleShipperAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipperAddress(e.target.value);
    form.setValue("shipperAddress", e.target.value, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      {createHighlightedLabel("REMETENTE")}
      <CNPJLookupField 
        label="CNPJ do Remetente" 
        onDataFetched={data => {
          setShipper(data.name);
          setShipperAddress(data.address);
          form.setValue("shipper", data.name, { shouldValidate: true });
          form.setValue("shipperAddress", data.address, { shouldValidate: true });
        }} 
      />
      
      <FormField
        control={form.control}
        name="shipper"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Remetente</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  {...field}
                  value={shipper}
                  onChange={handleShipperChange}
                  placeholder="Digite o nome do remetente"
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
        name="shipperAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço do Remetente</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={shipperAddress}
                onChange={handleShipperAddressChange}
                placeholder="Digite o endereço do remetente"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
