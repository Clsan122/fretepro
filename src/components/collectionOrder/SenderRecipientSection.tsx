
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SenderRecipientProps {
  sender: string;
  setSender: (value: string) => void;
  recipient: string;
  setRecipient: (value: string) => void;
}

export const SenderRecipientSection: React.FC<SenderRecipientProps> = ({
  sender,
  setSender,
  recipient,
  setRecipient
}) => {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Informações de Remetente e Destinatário</CardTitle>
        <CardDescription>Informe os dados do remetente e destinatário</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sender">Remetente / Exportador</Label>
            <Input
              id="sender"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Nome do remetente ou exportador"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Destinatário / Importador</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Nome do destinatário ou importador"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
