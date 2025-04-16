
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, FilePen } from "lucide-react";

interface InvoiceNotesSectionProps {
  invoiceNumber: string;
  setInvoiceNumber: (value: string) => void;
  observations: string;
  setObservations: (value: string) => void;
}

export const InvoiceNotesSection: React.FC<InvoiceNotesSectionProps> = ({
  invoiceNumber,
  setInvoiceNumber,
  observations,
  setObservations
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Adicionais</CardTitle>
        <CardDescription>Número de NF/Pedido e observações</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber" className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              Número da NF/Pedido
            </Label>
            <Input
              id="invoiceNumber"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="Informe o número da nota fiscal ou pedido"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observations" className="flex items-center gap-1.5">
              <FilePen className="h-4 w-4" />
              Observações
            </Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Observações adicionais sobre esta ordem de coleta"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
