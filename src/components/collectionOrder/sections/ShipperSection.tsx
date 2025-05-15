
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
    <div className="pb-2 mb-3 border-b border-freight-100">
      <Label className="text-lg font-bold text-freight-700">
        {text}
      </Label>
    </div>
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
    <div className="space-y-5 bg-white p-4 rounded-lg border border-freight-100">
      {createHighlightedLabel("REMETENTE")}
      <div className="space-y-4">
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
