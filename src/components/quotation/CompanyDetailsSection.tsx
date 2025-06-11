
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { User } from '@/types';

interface CompanyDetailsSectionProps {
  user: User | null;
  onLogoUpload: (file: File) => Promise<string | null>;
}

const CompanyDetailsSection: React.FC<CompanyDetailsSectionProps> = ({ user, onLogoUpload }) => {
  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await onLogoUpload(file);
      } catch (error) {
        console.error('Erro ao fazer upload do logo:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Transportador</CardTitle>
        <CardDescription>
          Estas informações aparecerão na cotação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="transporterName">Nome do Transportador</Label>
            <Input 
              id="transporterName" 
              value={user?.name || ''} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label htmlFor="transporterCpf">CPF</Label>
            <Input 
              id="transporterCpf" 
              value={user?.cpf || ''} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="transporterEmail">Email</Label>
            <Input 
              id="transporterEmail" 
              value={user?.email || ''} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label htmlFor="transporterPhone">Telefone</Label>
            <Input 
              id="transporterPhone" 
              value={user?.phone || ''} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="logo">Logo (Opcional)</Label>
          <div className="mt-2">
            <input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('logo')?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Fazer upload do logo
            </Button>
          </div>
          {user?.avatar && (
            <div className="mt-2">
              <img 
                src={user.avatar} 
                alt="Logo atual" 
                className="h-16 w-16 object-contain border rounded"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyDetailsSection;
