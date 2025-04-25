
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure clients is not null and always an array
  const safeClients = Array.isArray(clients) ? clients : [];
  
  const filteredClients = safeClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          ref={inputRef}
          value={value || ""}
          onChange={(e) => {
            const newValue = e.target.value;
            onChange(newValue);
            setSearchTerm(newValue);
            if (newValue.length > 0 && !open) {
              setOpen(true);
            }
          }}
          placeholder={placeholder || `Digite o nome do ${label}`}
          onClick={() => setOpen(true)}
          className="w-full"
        />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}> {/* Disable internal filtering to prevent Array.from error */}
          <CommandInput 
            placeholder={`Buscar ${label}...`}
            value={searchTerm}
            onValueChange={(value) => {
              setSearchTerm(value);
              onChange(value);
            }}
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
                className="cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{client.name}</span>
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
