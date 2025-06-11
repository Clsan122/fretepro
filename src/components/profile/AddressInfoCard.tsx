
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, MapPin, Loader2 } from "lucide-react";
import { formatCEP } from "@/utils/formatters";

interface AddressInfoCardProps {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  setAddress: (value: string) => void;
  setCity: (value: string) => void;
  setState: (value: string) => void;
  setZipCode: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isUpdating?: boolean;
}

const AddressInfoCard: React.FC<AddressInfoCardProps> = ({
  address,
  city,
  state,
  zipCode,
  setAddress,
  setCity,
  setState,
  setZipCode,
  onSubmit,
  isUpdating
}) => {
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(formatCEP(e.target.value));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Endereço
        </CardTitle>
        <CardDescription>
          Suas informações de endereço
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rua, número, bairro, complemento"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Estado"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={handleZipCodeChange}
                placeholder="00000-000"
                maxLength={9}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Endereço
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressInfoCard;
