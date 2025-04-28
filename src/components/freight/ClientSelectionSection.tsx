
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ClientListDialog } from "@/components/client/ClientListDialog";

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
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);

  const handleSelectClient = (client: Client) => {
    setClientId(client.id);
    setIsClientDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Cliente</CardTitle>
        <CardDescription>Selecione o cliente para este frete</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
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
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsClientDialogOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Diálogo para busca e seleção de cliente */}
        <ClientListDialog 
          clients={clients}
          isOpen={isClientDialogOpen}
          onClose={() => setIsClientDialogOpen(false)}
          onSelectClient={handleSelectClient}
        />
      </CardContent>
    </Card>
  );
};
