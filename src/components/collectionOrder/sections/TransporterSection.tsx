
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CNPJLookupField } from "../CNPJLookupField";
import { Client } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getClientsByUserId } from "@/utils/storage";

interface TransporterSectionProps {
  sender: string;
  setSender: (value: string) => void;
  senderAddress: string;
  setSenderAddress: (value: string) => void;
  senderCnpj: string;
  setSenderCnpj: (value: string) => void;
  senderCity: string;
  setSenderCity: (value: string) => void;
  senderState: string;
  setSenderState: (value: string) => void;
  selectedSenderType: 'my-company' | 'client';
  handleSenderTypeChange: (type: 'my-company' | 'client') => void;
  handleSenderClientChange: (clientId: string) => void;
  onOpenClientDialog: () => void;
}

export const TransporterSection: React.FC<TransporterSectionProps> = ({
  sender,
  setSender,
  senderAddress,
  setSenderAddress,
  senderCnpj,
  setSenderCnpj,
  senderCity,
  setSenderCity,
  senderState,
  setSenderState,
  selectedSenderType,
  handleSenderTypeChange,
  handleSenderClientChange,
  onOpenClientDialog
}) => {
  const createHighlightedLabel = (text: string) => (
    <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1 rounded-none">
      {text}
    </Label>
  );

  return (
    <div className="space-y-4">
      {createHighlightedLabel("TRANSPORTADORA")}
      
      {/* Opção de escolha entre transportadora ou cliente */}
      <RadioGroup 
        value={selectedSenderType} 
        onValueChange={(value) => handleSenderTypeChange(value as 'my-company' | 'client')}
        className="flex gap-4 mb-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="my-company" id="my-company" />
          <Label htmlFor="my-company">Minha Transportadora</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="client" id="client" />
          <Label htmlFor="client">Cliente</Label>
        </div>
      </RadioGroup>
      
      {selectedSenderType === 'client' && (
        <CNPJLookupField 
          label="CNPJ da Transportadora" 
          onDataFetched={data => {
            setSender(data.name);
            setSenderAddress(data.address);
            if (data.cnpj) {
              setSenderCnpj(data.cnpj);
            }
            setSenderCity(data.city);
            setSenderState(data.state);
          }} 
        />
      )}
      
      <div>
        <Label>Nome da Transportadora</Label>
        <div className="flex gap-2">
          <Input 
            value={sender} 
            onChange={e => setSender(e.target.value)} 
            placeholder="Digite o nome da transportadora" 
            readOnly={selectedSenderType === 'my-company'}
          />
          {selectedSenderType === 'client' && (
            <Button type="button" variant="outline" size="icon" onClick={onOpenClientDialog}>
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div>
        <Label>CNPJ da Transportadora</Label>
        <Input 
          value={senderCnpj} 
          onChange={e => setSenderCnpj(e.target.value)} 
          placeholder="Digite o CNPJ da transportadora" 
          readOnly={selectedSenderType === 'my-company'}
        />
      </div>
      
      <div>
        <Label>Endereço da Transportadora</Label>
        <Input 
          value={senderAddress} 
          onChange={e => setSenderAddress(e.target.value)} 
          placeholder="Digite o endereço da transportadora"
          readOnly={selectedSenderType === 'my-company'} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Cidade</Label>
          <Input 
            value={senderCity} 
            onChange={e => setSenderCity(e.target.value)} 
            placeholder="Cidade" 
            readOnly={selectedSenderType === 'my-company'}
          />
        </div>
        <div>
          <Label>Estado</Label>
          <Input 
            value={senderState} 
            onChange={e => setSenderState(e.target.value)} 
            placeholder="UF" maxLength={2}
            readOnly={selectedSenderType === 'my-company'} 
          />
        </div>
      </div>
    </div>
  );
};
