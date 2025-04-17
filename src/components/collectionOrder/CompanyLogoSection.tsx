
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

interface CompanyLogoSectionProps {
  companyLogo: string;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedIssuerId?: string;
  onIssuerChange?: (id: string) => void;
}

export const CompanyLogoSection: React.FC<CompanyLogoSectionProps> = ({
  companyLogo,
  handleLogoUpload,
  selectedIssuerId,
  onIssuerChange,
}) => {
  const { user } = useAuth();
  const clients = user ? getClientsByUserId(user.id) : [];

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex-1">
            <div className="mb-4">
              <Label htmlFor="logo">Logo da Empresa</Label>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt="Logo da empresa"
                    className="max-h-32 object-contain"
                  />
                ) : (
                  <label
                    htmlFor="logo"
                    className="cursor-pointer text-sm text-gray-600 dark:text-gray-400"
                  >
                    Clique para fazer upload do logo
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Label htmlFor="issuer">Emissor da Ordem</Label>
            <Select
              value={selectedIssuerId}
              onValueChange={onIssuerChange}
            >
              <SelectTrigger id="issuer" className="w-full">
                <SelectValue placeholder="Selecione o emissor" />
              </SelectTrigger>
              <SelectContent>
                {user && (
                  <SelectItem value={user.id}>
                    {user.name || "Minha Empresa"}
                  </SelectItem>
                )}
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
