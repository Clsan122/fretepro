
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SenderRecipientSectionProps {
  sender: string;
  senderAddress: string;
  recipient: string;
  recipientAddress: string;
  shipper: string;
  shipperAddress: string;
  updateField: (field: string, value: any) => void;
}

const SenderRecipientSection: React.FC<SenderRecipientSectionProps> = ({
  sender,
  senderAddress,
  recipient,
  recipientAddress,
  shipper,
  shipperAddress,
  updateField,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3 px-3 md:px-4">
        <CardTitle className="text-lg md:text-xl text-purple-700">Remetente e Destinatário</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3 md:px-4">
        <div className="space-y-5">
          <div className="space-y-3">
            <Label className="text-base md:text-lg font-semibold pb-1 text-purple-700 border-b-2 border-purple-300 inline-block">
              REMETENTE
            </Label>
            <div>
              <Label>Nome do Remetente</Label>
              <Input 
                value={sender} 
                onChange={(e) => updateField("sender", e.target.value)}
                placeholder="Digite o nome do remetente" 
              />
            </div>
            <div>
              <Label>Endereço do Remetente</Label>
              <Input 
                value={senderAddress} 
                onChange={(e) => updateField("senderAddress", e.target.value)}
                placeholder="Digite o endereço do remetente" 
              />
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <Label className="text-base md:text-lg font-semibold pb-1 text-purple-700 border-b-2 border-purple-300 inline-block">
              DESTINATÁRIO
            </Label>
            <div>
              <Label>Nome do Destinatário</Label>
              <Input 
                value={recipient} 
                onChange={(e) => updateField("recipient", e.target.value)}
                placeholder="Digite o nome do destinatário" 
              />
            </div>
            <div>
              <Label>Endereço do Destinatário</Label>
              <Input 
                value={recipientAddress} 
                onChange={(e) => updateField("recipientAddress", e.target.value)}
                placeholder="Digite o endereço do destinatário" 
              />
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <Label className="text-base md:text-lg font-semibold pb-1 text-purple-700 border-b-2 border-purple-300 inline-block">
              EXPEDIDOR
            </Label>
            <div>
              <Label>Nome do Expedidor</Label>
              <Input 
                value={shipper} 
                onChange={(e) => updateField("shipper", e.target.value)}
                placeholder="Digite o nome do expedidor" 
              />
            </div>
            <div>
              <Label>Endereço do Expedidor</Label>
              <Input 
                value={shipperAddress} 
                onChange={(e) => updateField("shipperAddress", e.target.value)}
                placeholder="Digite o endereço do expedidor" 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SenderRecipientSection;
