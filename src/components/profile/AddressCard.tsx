
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAZILIAN_STATES } from "@/utils/constants";
import { Home, Building, MapPin, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddressCardProps {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  setAddress: (address: string) => void;
  setCity: (city: string) => void;
  setState: (state: string) => void;
  setZipCode: (zipCode: string) => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  city,
  state,
  zipCode,
  setAddress,
  setCity,
  setState,
  setZipCode,
  handleUpdateProfile,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço</CardTitle>
        <CardDescription>
          Informe seu endereço completo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
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
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
          
          <Button type="submit" className="w-full" onClick={handleUpdateProfile}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Endereço
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
