
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CNPJLookupFieldProps {
  label: string;
  onDataFetched: (data: {
    name: string;
    address: string;
    cnpj: string;
    city: string;
    state: string;
  }) => void;
  initialValue?: string;
}

interface CNPJApiResponse {
  razao_social: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  cnpj: string;
}

export const CNPJLookupField: React.FC<CNPJLookupFieldProps> = ({
  label,
  onDataFetched,
  initialValue = ""
}) => {
  const [cnpj, setCnpj] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  // Formata o CNPJ para o padrão XX.XXX.XXX/XXXX-XX
  const formatCnpj = (value: string) => {
    value = value.replace(/\D/g, "");
    
    if (value.length > 14) {
      value = value.substring(0, 14);
    }
    
    if (value.length > 12) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, "$1.$2.$3/$4-$5");
    } else if (value.length > 8) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d*).*/, "$1.$2.$3/$4");
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{3})(\d*).*/, "$1.$2.$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d*).*/, "$1.$2");
    }
    
    return value;
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCnpj(formatCnpj(e.target.value));
  };

  const fetchCompanyData = async () => {
    if (!cnpj) {
      toast.error("Por favor, informe um CNPJ.");
      return;
    }

    const cleanCnpj = cnpj.replace(/\D/g, "");
    if (cleanCnpj.length !== 14) {
      toast.error("CNPJ inválido. Por favor, digite os 14 dígitos.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Buscando dados do CNPJ:", cleanCnpj);
      
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("CNPJ não encontrado");
        } else if (response.status === 429) {
          throw new Error("Muitas consultas. Tente novamente em alguns segundos");
        } else {
          throw new Error("Erro na consulta. Tente novamente");
        }
      }

      const data: CNPJApiResponse = await response.json();
      console.log("Dados recebidos da API:", data);
      
      // Monta o endereço completo
      const addressParts = [
        data.logradouro,
        data.numero,
        data.bairro
      ].filter(part => part && part.trim() !== "");
      
      const fullAddress = addressParts.join(", ");
      
      const companyData = {
        name: data.razao_social || "",
        address: fullAddress,
        cnpj: cnpj, // Mantém o CNPJ formatado
        city: data.municipio || "",
        state: data.uf || ""
      };
      
      console.log("Dados processados:", companyData);
      onDataFetched(companyData);
      toast.success("Dados da empresa encontrados!");
      
    } catch (error) {
      console.error("Erro ao buscar dados do CNPJ:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao buscar dados. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="cnpj">{label}</Label>
      <div className="flex gap-2">
        <Input
          id="cnpj"
          placeholder="XX.XXX.XXX/XXXX-XX"
          value={cnpj}
          onChange={handleCnpjChange}
          maxLength={18}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={fetchCompanyData}
          disabled={isLoading}
          variant="outline"
          size="icon"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
