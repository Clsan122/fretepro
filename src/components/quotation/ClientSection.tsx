
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Client } from "@/types";

interface ClientSectionProps {
  clientId: string;
  clients: Client[];
  onClientChange: (clientId: string) => void;
}

const ClientSection: React.FC<ClientSectionProps> = ({ 
  clientId, 
  clients, 
  onClientChange 
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3 px-3 md:px-4">
        <CardTitle className="text-lg md:text-xl text-purple-700">Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3 md:px-4">
        <div className="space-y-3">
          <div>
            <Label>Cliente</Label>
            <Select 
              value={clientId} 
              onValueChange={(value) => onClientChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientSection;
