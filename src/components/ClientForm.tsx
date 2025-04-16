
import React, { useState, useEffect } from "react";
import { Client } from "@/types";
import { BRAZILIAN_STATES } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
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
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setState(clientToEdit.state);
      setCity(clientToEdit.city);
      setCnpj(clientToEdit.cnpj || "");
      setAddress(clientToEdit.address || "");
    }
  }, [clientToEdit]);

  const formatCNPJ = (value: string) => {
    // Remove non-digit characters
    const nums = value.replace(/\D/g, '');
    
    // Apply CNPJ mask: XX.XXX.XXX/XXXX-XX
    let formatted = nums;
    if (nums.length > 2) formatted = nums.replace(/(\d{2})(\d)/, '$1.$2');
    if (nums.length > 5) formatted = formatted.replace(/(\d{2}\.\d{3})(\d)/, '$1.$2');
    if (nums.length > 8) formatted = formatted.replace(/(\d{2}\.\d{3}\.\d{3})(\d)/, '$1/$2');
    if (nums.length > 12) formatted = formatted.replace(/(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/, '$1-$2');
    
    return formatted.slice(0, 18); // Limit to 18 characters (including format)
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCNPJ = formatCNPJ(e.target.value);
    setCnpj(formattedCNPJ);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !state || !city) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios!",
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
      cnpj: cnpj || undefined,
      address: address || undefined,
      createdAt: clientToEdit ? clientToEdit.createdAt : new Date().toISOString(),
      userId: user.id,
    };

    onSave(newClient);
    
    // Reset form if not editing
    if (!clientToEdit) {
      setName("");
      setState("");
      setCity("");
      setCnpj("");
      setAddress("");
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
        <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
        <Input
          id="cnpj"
          value={cnpj}
          onChange={handleCNPJChange}
          placeholder="XX.XXX.XXX/XXXX-XX"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço (Opcional)</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Endereço completo"
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
