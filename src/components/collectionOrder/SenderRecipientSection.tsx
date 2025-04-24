
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Client } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { useAuth } from "@/context/AuthContext";

interface SenderRecipientProps {
  sender: string;
  setSender: (value: string) => void;
  senderAddress: string;
  setSenderAddress: (value: string) => void;
  recipient: string;
  setRecipient: (value: string) => void;
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
  selectedSenderType: 'my-company' | 'client';
  handleSenderTypeChange: (type: 'my-company' | 'client') => void;
  handleSenderClientChange: (clientId: string) => void;
  selectedSenderId: string;
  clients: Client[];
  senderLogo: string;
}

export const SenderRecipientSection: React.FC<SenderRecipientProps> = ({
  sender,
  setSender,
  senderAddress,
  setSenderAddress,
  recipient,
  setRecipient,
  recipientAddress,
  setRecipientAddress,
  selectedSenderType,
  handleSenderTypeChange,
  handleSenderClientChange,
  selectedSenderId,
  clients,
  senderLogo
}) => {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Remetente e Destinatário</CardTitle>
        <CardDescription>Informe os dados do remetente e destinatário</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Tipo de Remetente</Label>
              <RadioGroup
                value={selectedSenderType}
                onValueChange={(value: 'my-company' | 'client') => handleSenderTypeChange(value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="my-company" id="my-company" />
                  <Label htmlFor="my-company">Minha Empresa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="client" id="client" />
                  <Label htmlFor="client">Cliente Cadastrado</Label>
                </div>
              </RadioGroup>
            </div>

            {selectedSenderType === 'client' && (
              <div className="space-y-2">
                <Label>Selecionar Cliente Remetente</Label>
                <Select
                  value={selectedSenderId}
                  onValueChange={handleSenderClientChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Selecione...</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {senderLogo && (
              <div className="mt-4">
                <img 
                  src={senderLogo} 
                  alt="Logo do Remetente" 
                  className="max-h-20 max-w-[200px] object-contain"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="sender">Remetente / Exportador</Label>
              <Input
                id="sender"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Nome do remetente ou exportador"
                readOnly={selectedSenderType === 'my-company'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderAddress">Endereço do Remetente</Label>
              <Input
                id="senderAddress"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                placeholder="Endereço completo"
                readOnly={selectedSenderType === 'my-company'}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Destinatário / Importador</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Nome do destinatário ou importador"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Endereço do Destinatário</Label>
              <Input
                id="recipientAddress"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Endereço completo"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
