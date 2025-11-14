import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { DocumentUpload } from './DocumentUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Building, FileText, User, CheckCircle } from 'lucide-react';
import { CompanyRegistrationData } from '@/types/company';

const STEPS = [
  { title: 'Dados da Empresa', icon: Building },
  { title: 'Documentação', icon: FileText },
  { title: 'Representante Legal', icon: User },
  { title: 'Confirmação', icon: CheckCircle },
];

export const CompanyRegistrationWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyRegistrationData>>({});

  const updateFormData = (field: keyof CompanyRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Upload documents
      let registration_document_url = null;
      let license_document_url = null;

      if (formData.registration_document) {
        const fileName = `registration-${Date.now()}.pdf`;
        const { error: uploadError, data } = await supabase.storage
          .from('company-logos')
          .upload(fileName, formData.registration_document);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from('company-logos')
          .getPublicUrl(fileName);
        registration_document_url = publicUrl;
      }

      if (formData.license_document) {
        const fileName = `license-${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(fileName, formData.license_document);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from('company-logos')
          .getPublicUrl(fileName);
        license_document_url = publicUrl;
      }

      // Create company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{
          name: formData.name,
          cnpj: formData.cnpj,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          registration_document_url,
          license_document_url,
          status: 'pending_approval'
        }])
        .select()
        .single();

      if (companyError) throw companyError;

      toast.success('Cadastro enviado para aprovação!');
      navigate('/register/approval-pending');
    } catch (error: any) {
      console.error('Error registering company:', error);
      toast.error(error.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Ex: Transportadora ABC Ltda"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj || ''}
                  onChange={(e) => updateFormData('cnpj', e.target.value.replace(/\D/g, ''))}
                  placeholder="00.000.000/0000-00"
                  maxLength={14}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Corporativo *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="contato@empresa.com.br"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => updateFormData('phone', e.target.value.replace(/\D/g, ''))}
                  placeholder="(00) 00000-0000"
                  maxLength={11}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço Completo *</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => updateFormData('address', e.target.value)}
                placeholder="Rua, número, bairro"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  placeholder="São Paulo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  value={formData.state || ''}
                  onChange={(e) => updateFormData('state', e.target.value)}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip_code">CEP *</Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code || ''}
                  onChange={(e) => updateFormData('zip_code', e.target.value.replace(/\D/g, ''))}
                  placeholder="00000-000"
                  maxLength={8}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <DocumentUpload
              label="Contrato Social ou CNPJ"
              description="Upload do documento de constituição da empresa"
              onFileSelect={(file) => updateFormData('registration_document', file)}
              required
              value={formData.registration_document}
            />
            <DocumentUpload
              label="Licença de Operação"
              description="Documento de licença para operar (se aplicável)"
              onFileSelect={(file) => updateFormData('license_document', file)}
              value={formData.license_document}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rep_name">Nome Completo *</Label>
                <Input
                  id="rep_name"
                  value={formData.representative_name || ''}
                  onChange={(e) => updateFormData('representative_name', e.target.value)}
                  placeholder="João da Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rep_cpf">CPF *</Label>
                <Input
                  id="rep_cpf"
                  value={formData.representative_cpf || ''}
                  onChange={(e) => updateFormData('representative_cpf', e.target.value.replace(/\D/g, ''))}
                  placeholder="000.000.000-00"
                  maxLength={11}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rep_email">Email Pessoal *</Label>
                <Input
                  id="rep_email"
                  type="email"
                  value={formData.representative_email || ''}
                  onChange={(e) => updateFormData('representative_email', e.target.value)}
                  placeholder="joao@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rep_phone">Telefone *</Label>
                <Input
                  id="rep_phone"
                  value={formData.representative_phone || ''}
                  onChange={(e) => updateFormData('representative_phone', e.target.value.replace(/\D/g, ''))}
                  placeholder="(00) 00000-0000"
                  maxLength={11}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rep_role">Cargo na Empresa *</Label>
              <Input
                id="rep_role"
                value={formData.representative_role || ''}
                onChange={(e) => updateFormData('representative_role', e.target.value)}
                placeholder="Ex: Diretor, Sócio"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Dados da Empresa</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Nome:</span> {formData.name}</div>
                <div><span className="text-muted-foreground">CNPJ:</span> {formData.cnpj}</div>
                <div><span className="text-muted-foreground">Email:</span> {formData.email}</div>
                <div><span className="text-muted-foreground">Telefone:</span> {formData.phone}</div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Representante Legal</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Nome:</span> {formData.representative_name}</div>
                <div><span className="text-muted-foreground">CPF:</span> {formData.representative_cpf}</div>
                <div><span className="text-muted-foreground">Email:</span> {formData.representative_email}</div>
                <div><span className="text-muted-foreground">Cargo:</span> {formData.representative_role}</div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <p className="text-sm text-center">
                Ao confirmar, seu cadastro será enviado para análise da equipe FreteValor. 
                Você receberá um email quando seu cadastro for aprovado.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Cadastro de Transportadora</CardTitle>
          <CardDescription>
            Preencha os dados para criar sua conta corporativa
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              {STEPS.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${
                    index === currentStep ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  <step.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{step.title}</span>
                </div>
              ))}
            </div>
            <Progress value={(currentStep / (STEPS.length - 1)) * 100} />
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStep()}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
            >
              Voltar
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button onClick={handleNext}>
                Próximo
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Cadastro'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
