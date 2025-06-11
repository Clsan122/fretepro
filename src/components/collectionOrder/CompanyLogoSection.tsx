
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface CompanyLogoSectionProps {
  logoFile: File | null;
  onLogoChange: (file: File | null) => void;
}

const CompanyLogoSection: React.FC<CompanyLogoSectionProps> = ({
  logoFile,
  onLogoChange,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onLogoChange(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo da Empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="company-logo">Selecionar Logo</Label>
          <div className="mt-2">
            <Input
              id="company-logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('company-logo')?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {logoFile ? 'Trocar Logo' : 'Selecionar Logo'}
            </Button>
          </div>
          {logoFile && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Arquivo selecionado: {logoFile.name}
              </p>
              <img
                src={URL.createObjectURL(logoFile)}
                alt="Preview do logo"
                className="mt-2 h-16 w-16 object-contain border rounded"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyLogoSection;
