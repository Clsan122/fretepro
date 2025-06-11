
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CollectionOrderFormValues } from '../schema';
import { User } from '@/types';

interface CompanyDetailsSectionProps {
  selectedIssuerId: string;
  onIssuerChange: (value: string) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoRemove: () => void;
  user: User | null;
}

const CompanyDetailsSection: React.FC<CompanyDetailsSectionProps> = ({
  selectedIssuerId,
  onIssuerChange,
  onLogoUpload,
  onLogoRemove,
  user
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes da Empresa</CardTitle>
        <CardDescription>
          Configure as informações da empresa que aparecerão na ordem de coleta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome da Empresa</label>
            <p className="text-sm text-gray-600">{user?.name || 'Não informado'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CPF</label>
            <p className="text-sm text-gray-600">{user?.cpf || 'Não informado'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <p className="text-sm text-gray-600">{user?.email || 'Não informado'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Telefone</label>
            <p className="text-sm text-gray-600">{user?.phone || 'Não informado'}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Logo (Opcional)</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={onLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <button
              type="button"
              onClick={() => document.getElementById('logo-upload')?.click()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Fazer upload do logo
            </button>
            {user?.avatar && (
              <div className="flex items-center space-x-2">
                <img 
                  src={user.avatar} 
                  alt="Logo atual" 
                  className="h-12 w-12 object-contain border rounded"
                />
                <button
                  type="button"
                  onClick={onLogoRemove}
                  className="text-red-600 hover:text-red-800"
                >
                  Remover
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyDetailsSection;
