
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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
      // Simular uma consulta à API de CNPJ
      // Em um ambiente real, isso seria uma chamada à API
      setTimeout(() => {
        // Dados fictícios para demonstração
        const companyData = {
          name: "Transportadora " + cnpj.substring(0, 5),
          address: "Av. Brasil, 1500 - Centro",
          cnpj: cnpj,
          city: "São Paulo",
          state: "SP"
        };
        
        onDataFetched(companyData);
        toast.success("Dados da empresa encontrados!");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao buscar dados do CNPJ:", error);
      toast.error("Erro ao buscar dados. Tente novamente.");
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
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
