
import React, { useRef, useState } from "react";
import { AddressCardProps } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAZILIAN_STATES } from "@/utils/constants";
import { Home, Building, MapPin, Save, Upload, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CitySelectAutocomplete } from "@/components/common/CitySelectAutocomplete";
import { useToast } from "@/hooks/use-toast";
import { formatCNPJ } from "@/utils/formatters";

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  city,
  state,
  zipCode,
  companyName,
  cnpj,
  companyLogo,
  setAddress,
  setCity,
  setState,
  setZipCode,
  setCompanyName,
  setCnpj,
  setCompanyLogo,
  handleUpdateProfile,
  handleCompanyLogoUpload,
  isUpdating,
  isUploading
}) => {
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isFetching, setIsFetching] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && handleCompanyLogoUpload) {
      const url = await handleCompanyLogoUpload(file);
      if (url) {
        setCompanyLogo(url);
      }
    }
  };

  const handleBuscarCNPJ = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!cnpj || cnpj.replace(/\D/g, "").length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "Digite um CNPJ válido para buscar.",
        variant: "destructive",
      });
      return;
    }
    setIsFetching(true);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj.replace(/\D/g, "")}`);
      if (!res.ok) throw new Error("CNPJ não encontrado");
      const data = await res.json();
      setCompanyName(data.razao_social || "");
      setAddress([data.logradouro, data.numero, data.bairro, data.municipio].filter(Boolean).join(", "));
      setCity(data.municipio || "");
      setState(data.uf || "");
      setZipCode(data.cep || "");
      toast({
        title: "Dados encontrados!",
        description: "Os campos foram preenchidos automaticamente.",
      });
    } catch {
      toast({
        title: "CNPJ não encontrado",
        description: "Não foi possível buscar dados para este CNPJ.",
        variant: "destructive",
      });
    }
    setIsFetching(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Empresa e Endereço</CardTitle>
        <CardDescription>
          Informe os dados da sua empresa e endereço
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24 border-2 border-muted">
                <AvatarImage src={companyLogo} alt={companyName} />
                <AvatarFallback className="text-2xl bg-primary/10">
                  {companyName?.charAt(0) || <Building className="h-10 w-10" />}
                </AvatarFallback>
              </Avatar>
              
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="gap-2"
                onClick={() => logoFileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Logo da empresa
                  </>
                )}
              </Button>
              
              <input
                type="file"
                ref={logoFileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="cnpj"
                  value={cnpj}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setCnpj(formatCNPJ(value));
                  }}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={handleBuscarCNPJ}
                  disabled={isFetching}
                >
                  {isFetching ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <div className="flex items-center space-x-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, complemento"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <CitySelectAutocomplete
                uf={state}
                value={city}
                onChange={setCity}
                placeholder="Selecione a cidade"
                id="city"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um estado" />
              </SelectTrigger>
              <SelectContent>
                {BRAZILIAN_STATES.map((brazilianState) => (
                  <SelectItem key={brazilianState.abbreviation} value={brazilianState.abbreviation}>
                    {brazilianState.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="00000-000"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Informações
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
