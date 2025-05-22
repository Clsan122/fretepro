
import React, { useRef, useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Client } from '@/types';

interface ClientAutocompleteInputProps {
  clients: Client[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ClientAutocompleteInput: React.FC<ClientAutocompleteInputProps> = ({
  clients = [],
  value,
  onChange,
  placeholder = "Selecione um cliente..."
}) => {
  const [open, setOpen] = useState(false);
  
  // Garantindo que clients é sempre um array não vazio para o Command
  const availableClients = Array.isArray(clients) ? clients : [];
  const selectedClient = availableClients.find((client) => client.id === value);
  
  // Use correct ref type for button element
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Se não tivermos clientes, apenas renderizamos um botão desativado
  if (availableClients.length === 0) {
    return (
      <Button
        variant="outline"
        className="w-full justify-between"
        disabled
      >
        Nenhum cliente disponível
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          ref={triggerRef}
        >
          {selectedClient ? selectedClient.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar cliente..." />
          <CommandEmpty>Cliente não encontrado.</CommandEmpty>
          <CommandGroup>
            {availableClients.map((client) => (
              <CommandItem
                key={client.id}
                value={client.id}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === client.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {client.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
