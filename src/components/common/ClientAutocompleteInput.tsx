
import React, { useState, useRef } from "react";
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
import { formatCNPJ } from "@/utils/formatters";

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
  const [inputValue, setInputValue] = useState(value || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const safeClients = Array.isArray(clients) ? clients : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder || `Digite o nome ou CNPJ do ${label}`}
          onClick={() => setOpen(true)}
          className="w-full"
        />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={`Buscar ${label}...`}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {safeClients
              .filter(client => 
                client && 
                ((client.name && client.name.toLowerCase().includes(inputValue.toLowerCase())) ||
                (client.cnpj && client.cnpj.includes(inputValue.replace(/\D/g, ''))))
              )
              .map((client) => (
                <CommandItem
                  key={client.id}
                  onSelect={() => {
                    onClientSelect(client);
                    setInputValue(client.name || "");
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{client.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {client.cnpj && `CNPJ: ${formatCNPJ(client.cnpj)}`}
                      {client.city && client.state && ` • ${client.city}/${client.state}`}
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
