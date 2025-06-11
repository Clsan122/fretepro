import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Building } from "lucide-react";
import { useAuth } from '@/context/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { CompanyDetailsSection } from '@/components/quotation/CompanyDetailsSection';

const quotationFormSchema = z.object({
  originCity: z.string().min(2, { message: "A cidade de origem deve ter pelo menos 2 caracteres." }),
  originState: z.string().length(2, { message: "O estado de origem deve ter 2 caracteres." }),
  destinationCity: z.string().min(2, { message: "A cidade de destino deve ter pelo menos 2 caracteres." }),
  destinationState: z.string().length(2, { message: "O estado de destino deve ter 2 caracteres." }),
  volumes: z.number().min(1, { message: "O número de volumes deve ser pelo menos 1." }),
  weight: z.number().min(1, { message: "O peso deve ser pelo menos 1." }),
  dimensions: z.string().min(3, { message: "As dimensões devem ter pelo menos 3 caracteres." }),
  cubicMeasurement: z.number().min(0.01, { message: "A cubagem deve ser maior que 0." }),
  cargoType: z.string().min(3, { message: "O tipo de carga deve ter pelo menos 3 caracteres." }),
  vehicleType: z.string().min(3, { message: "O tipo de veículo deve ter pelo menos 3 caracteres." }),
  pricePerKm: z.number().min(0.01, { message: "O preço por km deve ser maior que 0." }),
  tollCost: z.number().min(0, { message: "O custo de pedágio deve ser pelo menos 0." }),
  additionalCosts: z.number().min(0, { message: "Custos adicionais devem ser pelo menos 0." }),
  totalPrice: z.number().min(0.01, { message: "O preço total deve ser maior que 0." }),
  notes: z.string().optional(),
});

type QuotationFormValues = z.infer<typeof quotationFormSchema>;

const QuotationForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      originCity: "",
      originState: "",
      destinationCity: "",
      destinationState: "",
      volumes: 1,
      weight: 1,
      dimensions: "",
      cubicMeasurement: 1,
      cargoType: "",
      vehicleType: "",
      pricePerKm: 1,
      tollCost: 0,
      additionalCosts: 0,
      totalPrice: 1,
      notes: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: QuotationFormValues) => {
    setIsCreating(true);
    try {
      if (!user) {
        toast({
          title: "Não autenticado",
          description: "Você deve estar autenticado para criar uma cotação.",
          variant: "destructive",
        });
        return;
      }

      const { data: quotation, error } = await supabase
        .from('quotations')
        .insert([
          {
            userId: user.id,
            originCity: data.originCity,
            originState: data.originState,
            destinationCity: data.destinationCity,
            destinationState: data.destinationState,
            volumes: data.volumes,
            weight: data.weight,
            dimensions: data.dimensions,
            cubicMeasurement: data.cubicMeasurement,
            cargoType: data.cargoType,
            vehicleType: data.vehicleType,
            pricePerKm: data.pricePerKm,
            tollCost: data.tollCost,
            additionalCosts: data.additionalCosts,
            totalPrice: data.totalPrice,
            notes: data.notes,
          },
        ])
        .select()

      if (error) {
        console.error("Erro ao criar cotação:", error);
        toast({
          title: "Erro ao criar cotação",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cotação criada",
          description: "Cotação criada com sucesso!",
        });
        router.push('/quotations');
      }
    } catch (error: any) {
      console.error("Erro ao criar cotação:", error);
      toast({
        title: "Erro ao criar cotação",
        description: error.message || "Ocorreu um erro ao criar a cotação.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogoUpload = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("URL_TEMPORARIA_DO_LOGO");
      }, 1000);
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova Cotação</CardTitle>
          <CardDescription>Preencha os detalhes da cotação abaixo.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="originCity">Cidade de Origem</Label>
                <Controller
                  name="originCity"
                  control={control}
                  render={({ field }) => <Input id="originCity" placeholder="Ex: São Paulo" {...field} />}
                />
                {form.formState.errors.originCity && (
                  <p className="text-red-500 text-sm">{form.formState.errors.originCity.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="originState">Estado de Origem</Label>
                <Controller
                  name="originState"
                  control={control}
                  render={({ field }) => (
                    <Input id="originState" placeholder="Ex: SP" maxLength={2} {...field} />
                  )}
                />
                {form.formState.errors.originState && (
                  <p className="text-red-500 text-sm">{form.formState.errors.originState.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="destinationCity">Cidade de Destino</Label>
                <Controller
                  name="destinationCity"
                  control={control}
                  render={({ field }) => <Input id="destinationCity" placeholder="Ex: Rio de Janeiro" {...field} />}
                />
                {form.formState.errors.destinationCity && (
                  <p className="text-red-500 text-sm">{form.formState.errors.destinationCity.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="destinationState">Estado de Destino</Label>
                <Controller
                  name="destinationState"
                  control={control}
                  render={({ field }) => (
                    <Input id="destinationState" placeholder="Ex: RJ" maxLength={2} {...field} />
                  )}
                />
                {form.formState.errors.destinationState && (
                  <p className="text-red-500 text-sm">{form.formState.errors.destinationState.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="volumes">Volumes</Label>
                <Controller
                  name="volumes"
                  control={control}
                  render={({ field }) => <Input id="volumes" type="number" placeholder="Ex: 10" {...field} />}
                />
                {form.formState.errors.volumes && (
                  <p className="text-red-500 text-sm">{form.formState.errors.volumes.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="weight">Peso (em KG)</Label>
                <Controller
                  name="weight"
                  control={control}
                  render={({ field }) => <Input id="weight" type="number" placeholder="Ex: 100" {...field} />}
                />
                {form.formState.errors.weight && (
                  <p className="text-red-500 text-sm">{form.formState.errors.weight.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="dimensions">Dimensões (AxLxP em metros)</Label>
              <Controller
                name="dimensions"
                control={control}
                render={({ field }) => <Input id="dimensions" placeholder="Ex: 1.20x0.80x0.50" {...field} />}
              />
              {form.formState.errors.dimensions && (
                <p className="text-red-500 text-sm">{form.formState.errors.dimensions.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cubicMeasurement">Cubagem (m³)</Label>
              <Controller
                name="cubicMeasurement"
                control={control}
                render={({ field }) => <Input id="cubicMeasurement" type="number" placeholder="Ex: 0.48" {...field} />}
              />
              {form.formState.errors.cubicMeasurement && (
                <p className="text-red-500 text-sm">{form.formState.errors.cubicMeasurement.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cargoType">Tipo de Carga</Label>
              <Controller
                name="cargoType"
                control={control}
                render={({ field }) => <Input id="cargoType" placeholder="Ex: Eletrônicos" {...field} />}
              />
              {form.formState.errors.cargoType && (
                <p className="text-red-500 text-sm">{form.formState.errors.cargoType.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="vehicleType">Tipo de Veículo</Label>
              <Controller
                name="vehicleType"
                control={control}
                render={({ field }) => <Input id="vehicleType" placeholder="Ex: Caminhão 3/4" {...field} />}
              />
              {form.formState.errors.vehicleType && (
                <p className="text-red-500 text-sm">{form.formState.errors.vehicleType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pricePerKm">Preço por KM (R$)</Label>
                <Controller
                  name="pricePerKm"
                  control={control}
                  render={({ field }) => <Input id="pricePerKm" type="number" placeholder="Ex: 2.50" {...field} />}
                />
                {form.formState.errors.pricePerKm && (
                  <p className="text-red-500 text-sm">{form.formState.errors.pricePerKm.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="tollCost">Custo de Pedágio (R$)</Label>
                <Controller
                  name="tollCost"
                  control={control}
                  render={({ field }) => <Input id="tollCost" type="number" placeholder="Ex: 50.00" {...field} />}
                />
                {form.formState.errors.tollCost && (
                  <p className="text-red-500 text-sm">{form.formState.errors.tollCost.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="additionalCosts">Custos Adicionais (R$)</Label>
              <Controller
                name="additionalCosts"
                control={control}
                render={({ field }) => <Input id="additionalCosts" type="number" placeholder="Ex: 100.00" {...field} />}
              />
              {form.formState.errors.additionalCosts && (
                <p className="text-red-500 text-sm">{form.formState.errors.additionalCosts.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="totalPrice">Preço Total (R$)</Label>
              <Controller
                name="totalPrice"
                control={control}
                render={({ field }) => <Input id="totalPrice" type="number" placeholder="Ex: 1250.00" {...field} />}
              />
              {form.formState.errors.totalPrice && (
                <p className="text-red-500 text-sm">{form.formState.errors.totalPrice.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => <Textarea id="notes" placeholder="Observações adicionais" {...field} />}
              />
            </div>

            <Button disabled={isCreating} type="submit">
              {isCreating ? "Criando..." : "Criar Cotação"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <CompanyDetailsSection 
        user={user} 
        onLogoUpload={handleLogoUpload}
      />
      
    </div>
  );
};

export default QuotationForm;
