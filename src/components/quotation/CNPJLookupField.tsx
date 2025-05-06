
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCNPJ } from "@/utils/formatters";
import { Client } from "@/types";
import { saveClient } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";

interface CNPJLookupResponse {
  name: string;
  address: string;
  city: string;
  state: string;
  cnpj?: string;
}

interface CNPJLookupFieldProps {
  label: string;
  onDataFetched: (data: CNPJLookupResponse) => void;
}

const CNPJLookupField: React.FC<CNPJLookupFieldProps> = ({
  label,
  onDataFetched,
}) => {
  const [cnpj, setCnpj] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCnpj(formatCNPJ(value));
  };

  const handleLookup = async () => {
    const cleanCNPJ = cnpj.replace(/\D/g, "");
    if (cleanCNPJ.length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "Por favor, insira um CNPJ válido",
        variant: "destructive",
      });
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`);
      if (!response.ok) throw new Error("CNPJ não encontrado");
      
      const data = await response.json();
      
      const clientData: CNPJLookupResponse = {
        name: data.razao_social,
        address: [
          data.logradouro,
          data.numero,
          data.complemento,
          data.bairro
        ].filter(Boolean).join(", "),
        city: data.municipio,
        state: data.uf,
        cnpj: cleanCNPJ,
      };

      // Save as client if user is logged in
      if (user) {
        const newClient: Client = {
          id: uuidv4(),
          userId: user.id,
          name: clientData.name,
          cnpj: cleanCNPJ,
          address: clientData.address,
          city: clientData.city,
          state: clientData.state,
          phone: data.ddd_telefone_1 || "",
          personType: 'legal',
          createdAt: new Date().toISOString()
        };
        
        saveClient(newClient);
        toast({
          title: "Cliente salvo",
          description: "Os dados foram salvos automaticamente no cadastro de clientes",
        });
      }

      onDataFetched(clientData);
      
      toast({
        title: "Dados encontrados",
        description: "Os campos foram preenchidos automaticamente",
      });
    } catch (error) {
      toast({
        title: "Erro ao buscar CNPJ",
        description: "Não foi possível encontrar os dados para este CNPJ",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Label>{label}</Label>
        <Input
          value={cnpj}
          onChange={handleCNPJChange}
          placeholder="00.000.000/0000-00"
          maxLength={18}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleLookup}
        disabled={isFetching}
      >
        {isFetching ? "Buscando..." : "Buscar CNPJ"}
      </Button>
    </div>
  );
};

export default CNPJLookupField;
