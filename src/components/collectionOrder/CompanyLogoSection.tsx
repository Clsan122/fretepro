
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Image, Upload, Trash2 } from "lucide-react";

interface CompanyLogoProps {
  companyLogo: string;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CompanyLogoSection: React.FC<CompanyLogoProps> = ({
  companyLogo,
  handleLogoUpload
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logotipo da Empresa</CardTitle>
        <CardDescription>Adicione o logotipo da sua empresa (opcional)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {companyLogo ? (
            <div className="relative">
              <img
                src={companyLogo}
                alt="Logotipo da empresa"
                className="h-32 object-contain mx-auto rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-0 right-0 h-8 w-8"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center">
                <Image className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Clique para adicionar um logotipo</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" /> Selecionar imagem
              </Button>
            </div>
          )}
          <Input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};
