
import React from "react";
import { Client } from "@/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ClientSelectionProps {
  clientId: string;
  clients: Client[];
  setClientId: (value: string) => void;
}

export const ClientSelectionSection: React.FC<ClientSelectionProps> = ({
  clientId,
  clients,
  setClientId
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Cliente</CardTitle>
        <CardDescription>Selecione o cliente para este frete</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="clientId">Cliente</Label>
          <Select
            value={clientId}
            onValueChange={(value) => setClientId(value)}
          >
            <SelectTrigger id="clientId">
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} - {client.city}/{client.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
