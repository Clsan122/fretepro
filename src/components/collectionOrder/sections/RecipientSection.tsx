
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CNPJLookupField } from "../CNPJLookupField";

interface RecipientSectionProps {
  recipient: string;
  setRecipient: (value: string) => void;
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
  onOpenClientDialog: () => void;
}

export const RecipientSection: React.FC<RecipientSectionProps> = ({
  recipient,
  setRecipient,
  recipientAddress,
  setRecipientAddress,
  onOpenClientDialog
}) => {
  const createHighlightedLabel = (text: string) => (
    <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1 rounded-none">
      {text}
    </Label>
  );

  return (
    <div className="space-y-4">
      {createHighlightedLabel("DESTINATÁRIO")}
      <CNPJLookupField 
        label="CNPJ do Destinatário" 
        onDataFetched={data => {
          setRecipient(data.name);
          setRecipientAddress(data.address);
        }} 
      />
      <div>
        <Label>Nome do Destinatário</Label>
        <div className="flex gap-2">
          <Input 
            value={recipient} 
            onChange={e => setRecipient(e.target.value)} 
            placeholder="Digite o nome do destinatário" 
          />
          <Button type="button" variant="outline" size="icon" onClick={onOpenClientDialog}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label>Endereço do Destinatário</Label>
        <Input 
          value={recipientAddress} 
          onChange={e => setRecipientAddress(e.target.value)} 
          placeholder="Digite o endereço do destinatário" 
        />
      </div>
    </div>
  );
};
