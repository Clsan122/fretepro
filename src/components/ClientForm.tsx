
import React, { useState, useEffect } from "react";
import { Client } from "@/types";
import { BRAZILIAN_STATES } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ClientFormProps {
  onSave: (client: Client) => void;
  onCancel: () => void;
  clientToEdit?: Client;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSave, onCancel, clientToEdit }) => {
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setState(clientToEdit.state);
      setCity(clientToEdit.city);
    }
  }, [clientToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !state || !city) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos!",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cadastrar um cliente!",
        variant: "destructive",
      });
      return;
    }

    const newClient: Client = {
      id: clientToEdit ? clientToEdit.id : uuidv4(),
      name,
      state,
      city,
      createdAt: clientToEdit ? clientToEdit.createdAt : new Date().toISOString(),
      userId: user.id,
    };

    onSave(newClient);
    
    // Reset form if not editing
    if (!clientToEdit) {
      setName("");
      setState("");
      setCity("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Cliente</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome completo do cliente"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">Estado</Label>
        <Select
          value={state}
          onValueChange={(value) => setState(value)}
        >
          <SelectTrigger id="state">
            <SelectValue placeholder="Selecione um estado" />
          </SelectTrigger>
          <SelectContent>
            {BRAZILIAN_STATES.map((state) => (
              <SelectItem key={state.abbreviation} value={state.abbreviation}>
                {state.name} ({state.abbreviation})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">Cidade</Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Nome da cidade"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {clientToEdit ? "Atualizar Cliente" : "Cadastrar Cliente"}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;
