
import React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Client } from "@/types"

interface ClientComboboxProps {
  clients: Client[]
  value: string
  onValueChange: (value: string, address?: string) => void
  label: string
  placeholder?: string
}

export const ClientCombobox = ({
  clients,
  value,
  onValueChange,
  label,
  placeholder = "Selecione um cliente..."
}: ClientComboboxProps) => {
  const [open, setOpen] = React.useState(false)
  
  // Ensure clients is always an array
  const safeClients = Array.isArray(clients) ? clients : []
  
  const selectedClient = safeClients.find(client => client.name === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? value : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder={`Procurar ${label.toLowerCase()}...`} />
          <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
          <CommandGroup>
            {safeClients.map((client) => (
              <CommandItem
                key={client.id}
                value={client.name}
                onSelect={() => {
                  onValueChange(client.name, client.address)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === client.name ? "opacity-100" : "opacity-0"
                  )}
                />
                {client.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
