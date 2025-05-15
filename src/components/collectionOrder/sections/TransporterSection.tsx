
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
import { UseFormReturn } from "react-hook-form";
import { CollectionOrderFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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
  form: UseFormReturn<CollectionOrderFormValues>;
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
  onOpenClientDialog,
  form
}) => {
  const createHighlightedLabel = (text: string) => <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1 rounded-none">
      {text}
    </Label>;
  const handleSenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSender(e.target.value);
    form.setValue("sender", e.target.value, {
      shouldValidate: true
    });
  };
  const handleSenderAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenderAddress(e.target.value);
    form.setValue("senderAddress", e.target.value, {
      shouldValidate: true
    });
  };
  return <div className="space-y-4">
      {createHighlightedLabel("TRANSPORTADORA")}
      
      {/* Opção de escolha entre transportadora ou cliente */}
      <RadioGroup value={selectedSenderType} onValueChange={value => handleSenderTypeChange(value as 'my-company' | 'client')} className="flex gap-4 mb-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="my-company" id="my-company" />
          <Label htmlFor="my-company">FreteValor</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="client" id="client" />
          <Label htmlFor="client">Cliente</Label>
        </div>
      </RadioGroup>
      
      {selectedSenderType === 'client' && <CNPJLookupField label="CNPJ da Transportadora" onDataFetched={data => {
      setSender(data.name);
      setSenderAddress(data.address);
      form.setValue("sender", data.name, {
        shouldValidate: true
      });
      form.setValue("senderAddress", data.address, {
        shouldValidate: true
      });
      if (data.cnpj) {
        setSenderCnpj(data.cnpj);
      }
      setSenderCity(data.city);
      setSenderState(data.state);
    }} />}
      
      <FormField control={form.control} name="sender" render={({
      field
    }) => <FormItem>
            <FormLabel>Nome da Transportadora</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input {...field} value={sender} onChange={handleSenderChange} placeholder="Digite o nome da transportadora" readOnly={selectedSenderType === 'my-company'} />
              </FormControl>
              {selectedSenderType === 'client' && <Button type="button" variant="outline" size="icon" onClick={onOpenClientDialog}>
                  <Search className="h-4 w-4" />
                </Button>}
            </div>
            <FormMessage />
          </FormItem>} />
      
      <div>
        <Label>CNPJ da Transportadora</Label>
        <Input value={senderCnpj} onChange={e => setSenderCnpj(e.target.value)} placeholder="Digite o CNPJ da transportadora" readOnly={selectedSenderType === 'my-company'} />
      </div>
      
      <FormField control={form.control} name="senderAddress" render={({
      field
    }) => <FormItem>
            <FormLabel>Endereço da Transportadora</FormLabel>
            <FormControl>
              <Input {...field} value={senderAddress} onChange={handleSenderAddressChange} placeholder="Digite o endereço da transportadora" readOnly={selectedSenderType === 'my-company'} />
            </FormControl>
            <FormMessage />
          </FormItem>} />
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Cidade</Label>
          <Input value={senderCity} onChange={e => setSenderCity(e.target.value)} placeholder="Cidade" readOnly={selectedSenderType === 'my-company'} />
        </div>
        <div>
          <Label>Estado</Label>
          <Input value={senderState} onChange={e => setSenderState(e.target.value)} placeholder="UF" maxLength={2} readOnly={selectedSenderType === 'my-company'} />
        </div>
      </div>
    </div>;
};
