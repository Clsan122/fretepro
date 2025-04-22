import React, { useRef } from "react";
import { AddressCardProps } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAZILIAN_STATES } from "@/utils/constants";
import { Home, Building, MapPin, Save, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CitySelectAutocomplete } from "@/components/common/CitySelectAutocomplete";

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
}) => {
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
              >
                <Upload className="h-4 w-4" />
                Logo da empresa
              </Button>
              
              <input
                type="file"
                ref={logoFileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
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
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
              />
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
          
          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Salvar Informações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
