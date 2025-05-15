
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CNPJLookupField } from "../CNPJLookupField";

interface ShipperSectionProps {
  shipper: string;
  setShipper: (value: string) => void;
  shipperAddress: string;
  setShipperAddress: (value: string) => void;
  onOpenClientDialog: () => void;
}

export const ShipperSection: React.FC<ShipperSectionProps> = ({
  shipper,
  setShipper,
  shipperAddress,
  setShipperAddress,
  onOpenClientDialog
}) => {
  const createHighlightedLabel = (text: string) => (
    <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1 rounded-none">
      {text}
    </Label>
  );

  return (
    <div className="space-y-4">
      {createHighlightedLabel("REMETENTE")}
      <CNPJLookupField 
        label="CNPJ do Remetente" 
        onDataFetched={data => {
          setShipper(data.name);
          setShipperAddress(data.address);
        }} 
      />
      <div>
        <Label>Nome do Remetente</Label>
        <div className="flex gap-2">
          <Input 
            value={shipper} 
            onChange={e => setShipper(e.target.value)} 
            placeholder="Digite o nome do remetente" 
          />
          <Button type="button" variant="outline" size="icon" onClick={onOpenClientDialog}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label>Endereço do Remetente</Label>
        <Input 
          value={shipperAddress} 
          onChange={e => setShipperAddress(e.target.value)} 
          placeholder="Digite o endereço do remetente" 
        />
      </div>
    </div>
  );
};
