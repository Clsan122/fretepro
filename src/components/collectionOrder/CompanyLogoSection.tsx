import React, { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Building } from "lucide-react";
import { Input, Label } from "@/components/ui";
import { User } from "@/types";

interface CompanyLogoSectionProps {
  user: User | null;
  companyLogo: string;
  setCompanyLogo: (logo: string) => void;
  handleCompanyLogoUpload: (file: File) => Promise<string | null>;
}

const CompanyLogoSection: React.FC<CompanyLogoSectionProps> = ({
  user,
  companyLogo,
  setCompanyLogo,
  handleCompanyLogoUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && handleCompanyLogoUpload) {
      const logoUrl = await handleCompanyLogoUpload(file);
      if (logoUrl) {
        setCompanyLogo(logoUrl);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Logo da Transportadora
        </CardTitle>
        <CardDescription>
          Logo que aparecerá na ordem de coleta para {user?.name || 'Usuário'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            {companyLogo ? (
              <div className="text-center">
                <img 
                  src={companyLogo} 
                  alt="Logo da empresa" 
                  className="max-w-32 max-h-32 mx-auto mb-2 object-contain"
                />
                <p className="text-sm text-gray-600">Logo carregada</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Faça upload do logo da transportadora
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              {companyLogo ? 'Alterar Logo' : 'Selecionar Logo'}
            </Button>
            
            {companyLogo && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCompanyLogo('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-xs text-gray-500">
            Recomendado: PNG ou JPG, máximo 2MB
          </p>

          <div className="text-sm text-gray-600">
            <p><strong>Transportadora:</strong> {user?.name || 'Não informado'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyLogoSection;
