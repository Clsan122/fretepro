
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Upload, Image as ImageIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CNPJLookupField } from "../CNPJLookupField";
import { Client } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getClientsByUserId } from "@/utils/storage";
import { UseFormReturn } from "react-hook-form";
import { CollectionOrderFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ClientAutocompleteInput } from "@/components/common/ClientAutocompleteInput";

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
  clients: Client[];
  senderLogo?: string;
  setSenderLogo?: (value: string) => void;
}

export const TransporterSection: React.FC<TransporterSectionProps> = ({
  sender,
  setSender,
  senderAddress,
  setSenderAddress,
  senderCnpj = "",
  setSenderCnpj = () => {},
  senderCity = "",
  setSenderCity = () => {},
  senderState = "",
  setSenderState = () => {},
  selectedSenderType,
  handleSenderTypeChange,
  handleSenderClientChange,
  onOpenClientDialog,
  form,
  clients = [],
  senderLogo = "",
  setSenderLogo = () => {}
}) => {
  // Garantimos que clients é sempre um array
  const availableClients = Array.isArray(clients) ? clients : [];
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const createHighlightedLabel = (text: string) => (
    <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1 rounded-none">
      {text}
    </Label>
  );

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

  const handleClientSelect = (clientId: string) => {
    if (!clientId) {
      // Limpar campos quando nenhum cliente for selecionado
      setSender("");
      setSenderAddress("");
      setSenderCnpj("");
      setSenderCity("");
      setSenderState("");
      setSenderLogo("");
      return;
    }

    const selectedClient = availableClients.find(client => client.id === clientId);
    if (selectedClient) {
      setSender(selectedClient.name);
      setSenderAddress(selectedClient.address || "");
      setSenderCnpj(selectedClient.cnpj || "");
      setSenderCity(selectedClient.city || "");
      setSenderState(selectedClient.state || "");
      if (selectedClient.logo) {
        setSenderLogo(selectedClient.logo);
      }

      // Atualizar o formulário
      form.setValue("sender", selectedClient.name, {
        shouldValidate: true
      });
      form.setValue("senderAddress", selectedClient.address || "", {
        shouldValidate: true
      });

      // Chamar o handler original
      handleSenderClientChange(clientId);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSenderLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <Label htmlFor="my-company">Minha Empresa</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="client" id="client" />
          <Label htmlFor="client">Cliente</Label>
        </div>
      </RadioGroup>
      
      {/* Seleção de cliente quando tipo for 'client' */}
      {selectedSenderType === 'client' && (
        <div className="mb-4">
          <Label className="block mb-2">Selecionar Cliente</Label>
          <ClientAutocompleteInput 
            clients={availableClients} 
            onChange={handleClientSelect} 
            placeholder="Buscar cliente..."
            value={availableClients.find(c => c.name === sender)?.id || ""}
          />
        </div>
      )}
      
      {/* CNPJ Lookup - apenas quando tipo for 'client' */}
      {selectedSenderType === 'client' && (
        <CNPJLookupField 
          label="CNPJ da Transportadora" 
          onDataFetched={(data) => {
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
          }} 
          initialValue={senderCnpj} 
        />
      )}
      
      {/* Logo da transportadora - apenas quando tipo for 'client' */}
      {selectedSenderType === 'client' && (
        <div className="mb-4">
          <Label htmlFor="senderLogo" className="block mb-1">Logo da Transportadora</Label>
          <input 
            type="file" 
            id="senderLogo" 
            accept="image/*" 
            onChange={handleLogoUpload} 
            className="hidden" 
            ref={fileInputRef} 
          />
          <div className="w-full flex items-center justify-center border-2 border-dashed border-gray-300 p-3 rounded-lg min-h-[84px] bg-white relative">
            {senderLogo ? (
              <>
                <img 
                  src={senderLogo} 
                  alt="Logo da transportadora" 
                  className="max-h-16 max-w-[150px] object-contain" 
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1 right-1 bg-white border rounded-full shadow" 
                  onClick={() => setSenderLogo("")} 
                  aria-label="Remover logo"
                >
                  ×
                </Button>
              </>
            ) : (
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="flex flex-col items-center text-gray-500 hover:text-freight-700 transition-colors"
              >
                <ImageIcon className="h-7 w-7 mb-2" />
                <span className="text-xs">Clique para fazer upload do logo</span>
              </button>
            )}
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {senderLogo ? "Trocar logo" : "Enviar logo"}
          </Button>
        </div>
      )}
      
      <FormField 
        control={form.control} 
        name="sender" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Transportadora</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input 
                  {...field} 
                  value={sender} 
                  onChange={handleSenderChange} 
                  placeholder="Digite o nome da transportadora" 
                  readOnly={selectedSenderType === 'my-company'} 
                />
              </FormControl>
              {selectedSenderType === 'client' && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={onOpenClientDialog}
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <div>
        <Label>CNPJ da Transportadora</Label>
        <Input 
          value={senderCnpj} 
          onChange={(e) => setSenderCnpj(e.target.value)} 
          placeholder="Digite o CNPJ da transportadora" 
          readOnly={selectedSenderType === 'my-company'} 
        />
      </div>
      
      <FormField 
        control={form.control} 
        name="senderAddress" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço da Transportadora</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                value={senderAddress} 
                onChange={handleSenderAddressChange} 
                placeholder="Digite o endereço da transportadora" 
                readOnly={selectedSenderType === 'my-company'} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Cidade</Label>
          <Input 
            value={senderCity} 
            onChange={(e) => setSenderCity(e.target.value)} 
            placeholder="Cidade" 
            readOnly={selectedSenderType === 'my-company'} 
          />
        </div>
        <div>
          <Label>Estado</Label>
          <Input 
            value={senderState} 
            onChange={(e) => setSenderState(e.target.value)} 
            placeholder="UF" 
            maxLength={2} 
            readOnly={selectedSenderType === 'my-company'} 
          />
        </div>
      </div>
    </div>
  );
};
