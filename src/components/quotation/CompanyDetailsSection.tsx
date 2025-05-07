
import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Image } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface CompanyDetailsSectionProps {
  companyLogo: string;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  creatorId: string;
  onCreatorChange: (id: string) => void;
  clients: any[];
}

export const CompanyDetailsSection: React.FC<CompanyDetailsSectionProps> = ({
  companyLogo,
  handleLogoUpload,
  creatorId,
  onCreatorChange,
  clients,
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveLogo = () => {
    onCreatorChange(creatorId); // Reset to default logo for current creator
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-freight-100 dark:border-freight-800">
      <CardHeader className="bg-freight-50/50 dark:bg-freight-900/50">
        <CardTitle className="text-freight-700 dark:text-freight-300">
          Dados do Emissor
        </CardTitle>
        <CardDescription>
          Selecione quem está emitindo a cotação e adicione um logotipo
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Label htmlFor="creator" className="text-base">Emissor da Cotação</Label>
            <Select
              value={creatorId}
              onValueChange={onCreatorChange}
            >
              <SelectTrigger id="creator" className="w-full">
                <SelectValue placeholder="Selecione o emissor" />
              </SelectTrigger>
              <SelectContent>
                {user && (
                  <SelectItem value={user.id} className="cursor-pointer">
                    {user.companyName || user.name || "Minha Empresa"}
                  </SelectItem>
                )}
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id} className="cursor-pointer">
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label htmlFor="logo" className="text-base">Logotipo</Label>
            <div className="flex items-center gap-4">
              <div className="w-40 h-24 border-2 border-dashed border-freight-200 dark:border-freight-700 rounded-md flex items-center justify-center bg-white dark:bg-freight-800/50 p-2 overflow-hidden">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt="Logotipo"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center text-freight-400 dark:text-freight-500">
                    <Image className="h-8 w-8 mb-2" />
                    <span className="text-xs text-center">Sem logotipo</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {companyLogo ? "Trocar logo" : "Enviar logo"}
                </Button>
                {companyLogo && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveLogo}
                    className="w-full text-destructive hover:text-destructive"
                  >
                    Remover logo
                  </Button>
                )}
                <input
                  type="file"
                  id="logo"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
