
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { getClientsByUserId } from "@/utils/storage";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";

interface CompanyLogoSectionProps {
  selectedIssuerId: string;
  onIssuerChange: (id: string) => void;
  issuerType: 'my-company' | 'client';
  onIssuerTypeChange: (type: 'my-company' | 'client') => void;
}

export const CompanyLogoSection: React.FC<CompanyLogoSectionProps> = ({
  selectedIssuerId,
  onIssuerChange,
  issuerType,
  onIssuerTypeChange,
}) => {
  const { user } = useAuth();
  const clients = user ? getClientsByUserId(user.id) : [];

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-3">
          <Label>Emissor da Ordem</Label>
          
          <RadioGroup 
            value={issuerType} 
            onValueChange={(value) => onIssuerTypeChange(value as 'my-company' | 'client')}
            className="flex space-x-4 pt-1"
          >
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <RadioGroupItem value="my-company" />
              </FormControl>
              <FormLabel className="cursor-pointer font-normal">Minha Empresa</FormLabel>
            </FormItem>
            
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <RadioGroupItem value="client" />
              </FormControl>
              <FormLabel className="cursor-pointer font-normal">Cliente</FormLabel>
            </FormItem>
          </RadioGroup>
          
          {issuerType === 'client' && (
            <div className="pt-2">
              <Label htmlFor="issuer">Selecionar Cliente</Label>
              <Select
                value={selectedIssuerId}
                onValueChange={onIssuerChange}
              >
                <SelectTrigger id="issuer" className="w-full">
                  <SelectValue placeholder="Selecione o cliente emissor" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
