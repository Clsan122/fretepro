
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import CompanyLogoSection from '../CompanyLogoSection';
import { CollectionOrderFormData } from '../schema';

interface CompanyDetailsSectionProps {
  form: UseFormReturn<CollectionOrderFormData>;
  logoFile: File | null;
  onLogoChange: (file: File | null) => void;
}

export const CompanyDetailsSection: React.FC<CompanyDetailsSectionProps> = ({
  form,
  logoFile,
  onLogoChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Nome da Empresa
          </label>
          <Input
            {...form.register('companyName')}
            placeholder="Nome da empresa"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            CNPJ
          </label>
          <Input
            {...form.register('companyCnpj')}
            placeholder="00.000.000/0000-00"
          />
        </div>
      </div>
      
      <CompanyLogoSection 
        logoFile={logoFile}
        onLogoChange={onLogoChange}
      />
    </div>
  );
};
