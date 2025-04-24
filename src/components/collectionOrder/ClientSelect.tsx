
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
  onClientChange: (clientId: string) => void;
  clientInfo?: string;
  clientAddress?: string;
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
    <div className="space-y-2">
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
              : `Selecionar cliente`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Buscar cliente...`} />
            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  onSelect={() => {
                    onClientChange(client.id);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start"
                >
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === client.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{client.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-6 mt-1">
                    {client.city}/{client.state}{client.address ? ` • ${client.address}` : ''}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
