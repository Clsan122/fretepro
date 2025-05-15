
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
import { UseFormReturn } from "react-hook-form";
import { CollectionOrderFormValues } from "./schema";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

interface InvoiceNotesSectionProps {
  invoiceNumber: string;
  setInvoiceNumber: (value: string) => void;
  observations: string;
  setObservations: (value: string) => void;
  form: UseFormReturn<CollectionOrderFormValues>;
}

export const InvoiceNotesSection: React.FC<InvoiceNotesSectionProps> = ({
  invoiceNumber,
  setInvoiceNumber,
  observations,
  setObservations,
  form
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Adicionais</CardTitle>
        <CardDescription>Número de NF/Pedido e observações</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="invoiceNumber" className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Número da NF/Pedido
                </Label>
                <FormControl>
                  <Input
                    id="invoiceNumber"
                    value={invoiceNumber}
                    onChange={(e) => {
                      setInvoiceNumber(e.target.value);
                      field.onChange(e.target.value);
                    }}
                    placeholder="Informe o número da nota fiscal ou pedido"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="observations" className="flex items-center gap-1.5">
                  <FilePen className="h-4 w-4" />
                  Observações
                </Label>
                <FormControl>
                  <Textarea
                    id="observations"
                    value={observations}
                    onChange={(e) => {
                      setObservations(e.target.value);
                      field.onChange(e.target.value);
                    }}
                    placeholder="Observações adicionais sobre esta ordem de coleta"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
