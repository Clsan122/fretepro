
import React from "react";
import { Client } from "@/types";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientSelectProps {
  label: string;
  clients: Client[];
  selectedValue: string;
  onClientChange: (value: string) => void;
  clientInfo: string;
  clientAddress: string;
}

export const ClientSelect: React.FC<ClientSelectProps> = ({
  label,
  clients,
  selectedValue,
  onClientChange,
  clientInfo,
  clientAddress
}) => {
  const [open, setOpen] = React.useState(false);
  const selectedClient = clients.find(client => client.id === selectedValue);

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedValue && selectedClient
              ? selectedClient.name
              : `Selecionar ${label}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Buscar ${label.toLowerCase()}...`} />
            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  onSelect={() => {
                    onClientChange(client.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === client.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{client.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {client.cnpj && `CNPJ: ${client.cnpj}`}
                      {client.address && ` • ${client.address}`}
                      {client.city && client.state && ` • ${client.city}/${client.state}`}
                      {client.phone && ` • Tel: ${client.phone}`}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedValue && clientInfo && (
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Nome:</strong> {clientInfo}</p>
          {clientAddress && <p><strong>Endereço:</strong> {clientAddress}</p>}
          {selectedClient?.cnpj && <p><strong>CNPJ:</strong> {selectedClient.cnpj}</p>}
          {selectedClient?.city && selectedClient?.state && (
            <p><strong>Cidade/Estado:</strong> {selectedClient.city}/{selectedClient.state}</p>
          )}
          {selectedClient?.phone && <p><strong>Telefone:</strong> {selectedClient.phone}</p>}
        </div>
      )}
    </div>
  );
};
