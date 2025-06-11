
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
import { useAuth } from "@/context/auth/useAuth";
import { getClientsByUserId } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompanyLogoSectionProps {
  companyLogo: string;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedIssuerId?: string;
  onIssuerChange?: (id: string) => void;
  handleRemoveLogo?: () => void;
  isUploading?: boolean;
}

export const CompanyLogoSection: React.FC<CompanyLogoSectionProps> = ({
  companyLogo,
  handleLogoUpload,
  selectedIssuerId,
  onIssuerChange,
  handleRemoveLogo,
  isUploading = false,
}) => {
  const { user } = useAuth();
  const clients = user ? getClientsByUserId(user.id) : [];
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Usar preferencialmente os dados da empresa se disponíveis
  const issuerName = user?.companyName || user?.name || "";
  
  const handleIssuerChange = (value: string) => {
    if (onIssuerChange) {
      onIssuerChange(value);
      // Mostrar toast de confirmação
      toast({
        title: "Emissor selecionado",
        description: "As informações do emissor foram atualizadas.",
      });
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-4 print:pt-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex-1 flex flex-col items-center">
            <Label htmlFor="logo" className="!mb-2">
              Logo da Empresa
            </Label>
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              ref={fileInputRef}
              disabled={isUploading}
            />
            <div className="w-full flex items-center justify-center border-2 border-dashed border-gray-300 p-3 rounded-lg min-h-[84px] bg-white relative">
              {companyLogo ? (
                <>
                  <img
                    src={companyLogo}
                    alt="Logo da empresa"
                    className="max-h-20 max-w-[150px] object-contain"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 bg-white border rounded-full shadow print:hidden"
                    onClick={handleRemoveLogo}
                    aria-label="Remover logo"
                    disabled={isUploading}
                  >
                    ×
                  </Button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center text-gray-500 hover:text-freight-700 transition-colors focus:outline-none"
                  tabIndex={0}
                  disabled={isUploading}
                >
                  <ImageIcon className="h-7 w-7 mb-2" />
                  <span className="text-xs">Clique para fazer upload do logo</span>
                </button>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-freight-700" />
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {companyLogo ? "Trocar logo" : "Enviar logo"}
                </>
              )}
            </Button>
          </div>
          <div className="flex-1">
            <Label htmlFor="issuer">Emissor da Ordem</Label>
            <Select
              value={selectedIssuerId}
              onValueChange={handleIssuerChange}
              disabled={isUploading}
            >
              <SelectTrigger id="issuer" className="w-full">
                <SelectValue placeholder="Selecione o emissor" />
              </SelectTrigger>
              <SelectContent>
                {user && (
                  <SelectItem value={user.id}>
                    {user.companyName || user.name || "Minha Empresa"}
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
