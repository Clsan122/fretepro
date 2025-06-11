import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useAuth } from '@/context/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import CompanyDetailsSection from '@/components/quotation/CompanyDetailsSection';

const quotationEditSchema = z.object({
  originCity: z.string().min(2, { message: "A cidade de origem deve ter pelo menos 2 caracteres." }),
  originState: z.string().length(2, { message: "O estado de origem deve ter 2 caracteres." }),
  destinationCity: z.string().min(2, { message: "A cidade de destino deve ter pelo menos 2 caracteres." }),
  destinationState: z.string().length(2, { message: "O estado de destino deve ter pelo menos 2 caracteres." }),
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

type QuotationEditValues = z.infer<typeof quotationEditSchema>;

const QuotationEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<QuotationEditValues>({
    resolver: zodResolver(quotationEditSchema),
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

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    const fetchQuotation = async () => {
      if (!id) return;

      try {
        const { data: quotation, error } = await supabase
          .from('quotations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Erro ao buscar cotação:", error);
          toast({
            title: "Erro ao carregar cotação",
            description: error.message,
            variant: "destructive",
          });
          navigate('/quotations');
          return;
        }

        if (quotation) {
          reset({
            originCity: quotation.originCity || "",
            originState: quotation.originState || "",
            destinationCity: quotation.destinationCity || "",
            destinationState: quotation.destinationState || "",
            volumes: quotation.volumes || 1,
            weight: quotation.weight || 1,
            dimensions: quotation.dimensions || "",
            cubicMeasurement: quotation.cubicMeasurement || 1,
            cargoType: quotation.cargoType || "",
            vehicleType: quotation.vehicleType || "",
            pricePerKm: quotation.pricePerKm || 1,
            tollCost: quotation.tollCost || 0,
            additionalCosts: quotation.additionalCosts || 0,
            totalPrice: quotation.totalPrice || 1,
            notes: quotation.notes || "",
          });
        }
      } catch (error: any) {
        console.error("Erro ao buscar cotação:", error);
        toast({
          title: "Erro ao carregar cotação",
          description: "Ocorreu um erro ao carregar a cotação.",
          variant: "destructive",
        });
        navigate('/quotations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotation();
  }, [id, reset, navigate, toast]);

  const onSubmit = async (data: QuotationEditValues) => {
    if (!id) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('quotations')
        .update({
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
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error("Erro ao atualizar cotação:", error);
        toast({
          title: "Erro ao atualizar cotação",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cotação atualizada",
          description: "Cotação atualizada com sucesso!",
        });
        navigate(`/quotations/${id}`);
      }
    } catch (error: any) {
      console.error("Erro ao atualizar cotação:", error);
      toast({
        title: "Erro ao atualizar cotação",
        description: error.message || "Ocorreu um erro ao atualizar a cotação.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoUpload = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("URL_TEMPORARIA_DO_LOGO");
      }, 1000);
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <div className="text-center">Carregando cotação...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/quotations')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Editar Cotação</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editar Cotação</CardTitle>
            <CardDescription>Modifique os detalhes da cotação abaixo.</CardDescription>
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

              <Button disabled={isUpdating} type="submit">
                {isUpdating ? "Atualizando..." : "Atualizar Cotação"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <CompanyDetailsSection 
          user={user} 
          onLogoUpload={handleLogoUpload}
        />
      </div>
    </Layout>
  );
};

export default QuotationEdit;
