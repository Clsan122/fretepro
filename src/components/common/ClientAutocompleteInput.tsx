
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Client } from "@/types";
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

interface ClientAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onClientSelect: (client: Client) => void;
  clients: Client[];
  label: string;
  placeholder?: string;
}

export const ClientAutocompleteInput: React.FC<ClientAutocompleteInputProps> = ({
  value,
  onChange,
  onClientSelect,
  clients,
  label,
  placeholder
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          ref={triggerRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSearchTerm(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder || `Digite o nome do ${label}`}
          onClick={() => setOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={`Buscar ${label}...`}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {filteredClients.map((client) => (
              <CommandItem
                key={client.id}
                onSelect={() => {
                  onClientSelect(client);
                  setOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span>{client.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {client.city}/{client.state}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
