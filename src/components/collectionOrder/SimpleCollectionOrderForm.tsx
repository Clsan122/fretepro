import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { CollectionOrder } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { generateOrderNumber } from "@/utils/orderNumber";

const schema = z.object({
  // Transportadora (Emissor)
  transporterName: z.string().min(1, "Nome da transportadora é obrigatório"),
  transporterAddress: z.string().min(1, "Endereço da transportadora é obrigatório"),
  transporterCnpj: z.string().optional(),
  
  // Remetente
  shipperName: z.string().min(1, "Nome do remetente é obrigatório"),
  shipperAddress: z.string().min(1, "Endereço do remetente é obrigatório"),
  
  // Destinatário
  recipientName: z.string().min(1, "Nome do destinatário é obrigatório"),
  recipientAddress: z.string().min(1, "Endereço do destinatário é obrigatório"),
  
  // Localização
  originCity: z.string().min(1, "Cidade de origem é obrigatória"),
  originState: z.string().min(2, "Estado de origem é obrigatório").max(2),
  destinationCity: z.string().min(1, "Cidade de destino é obrigatória"),
  destinationState: z.string().min(2, "Estado de destino é obrigatório").max(2),
  
  // Carga
  volumes: z.number().min(1, "Quantidade de volumes deve ser maior que zero"),
  weight: z.number().min(0.1, "Peso deve ser maior que zero"),
  merchandiseValue: z.number().min(0, "Valor da mercadoria deve ser maior ou igual a zero"),
  cargoDescription: z.string().min(1, "Descrição da carga é obrigatória"),
  
  // Motorista
  driverName: z.string().optional(),
  driverCpf: z.string().optional(),
  licensePlate: z.string().optional(),
  
  // Documento
  invoiceNumber: z.string().min(1, "Número da nota fiscal é obrigatório"),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface SimpleCollectionOrderFormProps {
  onSave: (order: CollectionOrder) => void;
  onCancel: () => void;
  orderToEdit?: CollectionOrder;
  isSaving?: boolean;
}

const SimpleCollectionOrderForm: React.FC<SimpleCollectionOrderFormProps> = ({
  onSave,
  onCancel,
  orderToEdit,
  isSaving = false,
}) => {
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      transporterName: orderToEdit?.sender || user?.companyName || "",
      transporterAddress: orderToEdit?.senderAddress || user?.address || "",
      transporterCnpj: orderToEdit?.senderCnpj || user?.cnpj || "",
      shipperName: orderToEdit?.shipper || "",
      shipperAddress: orderToEdit?.shipperAddress || "",
      recipientName: orderToEdit?.recipient || "",
      recipientAddress: orderToEdit?.recipientAddress || "",
      originCity: orderToEdit?.originCity || "",
      originState: orderToEdit?.originState || "",
      destinationCity: orderToEdit?.destinationCity || "",
      destinationState: orderToEdit?.destinationState || "",
      volumes: orderToEdit?.volumes || 1,
      weight: orderToEdit?.weight || 0,
      merchandiseValue: orderToEdit?.merchandiseValue || 0,
      cargoDescription: orderToEdit?.observations || "",
      driverName: orderToEdit?.driverName || "",
      driverCpf: orderToEdit?.driverCpf || "",
      licensePlate: orderToEdit?.licensePlate || "",
      invoiceNumber: orderToEdit?.invoiceNumber || "",
      observations: orderToEdit?.observations || "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (!user) return;

    const orderNumber = orderToEdit?.orderNumber || generateOrderNumber();
    const id = orderToEdit?.id || uuidv4();

    const newOrder: CollectionOrder = {
      id,
      orderNumber,
      userId: user.id,
      createdAt: orderToEdit?.createdAt || new Date().toISOString(),
      
      // Transportadora (Emissor)
      sender: values.transporterName,
      senderAddress: values.transporterAddress,
      senderCnpj: values.transporterCnpj,
      senderCity: user?.city,
      senderState: user?.state,
      
      // Remetente
      shipper: values.shipperName,
      shipperAddress: values.shipperAddress,
      
      // Destinatário
      recipient: values.recipientName,
      recipientAddress: values.recipientAddress,
      
      // Recebedor (mesmo que destinatário por padrão)
      receiver: values.recipientName,
      receiverAddress: values.recipientAddress,
      
      // Localização
      originCity: values.originCity,
      originState: values.originState,
      destinationCity: values.destinationCity,
      destinationState: values.destinationState,
      
      // Carga
      volumes: values.volumes,
      weight: values.weight,
      merchandiseValue: values.merchandiseValue,
      cubicMeasurement: 0,
      measurements: [],
      
      // Motorista
      driverName: values.driverName,
      driverCpf: values.driverCpf,
      licensePlate: values.licensePlate,
      
      // Documento
      invoiceNumber: values.invoiceNumber,
      observations: `${values.cargoDescription}${values.observations ? '\n\nObservações adicionais: ' + values.observations : ''}`,
      
      // Metadados
      companyLogo: user?.companyLogo || "",
      issuerId: user?.id || "",
      syncId: orderToEdit?.syncId,
      syncVersion: orderToEdit ? (orderToEdit.syncVersion || 1) + 1 : 1,
    };

    onSave(newOrder);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-lg px-4 py-2">
            Ordem de Coleta {orderToEdit ? `#${orderToEdit.orderNumber}` : "(Nova)"}
          </Badge>
        </div>

        {/* Transportadora */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚛 Transportadora (Emissor)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="transporterName"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nome/Razão Social</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da empresa transportadora" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transporterAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, bairro, cidade/UF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transporterCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="00.000.000/0000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Remetente e Destinatário */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📦 Remetente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="shipperName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome/Razão Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Quem está enviando" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipperAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço de Coleta</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Endereço completo para coleta"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Destinatário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome/Razão Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Quem vai receber" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço de Entrega</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Endereço completo para entrega"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Rota */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🗺️ Rota do Transporte
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <FormField
              control={form.control}
              name="originCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade de Origem</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: São Paulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="originState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UF Origem</FormLabel>
                  <FormControl>
                    <Input placeholder="SP" maxLength={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destinationCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade de Destino</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destinationState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UF Destino</FormLabel>
                  <FormControl>
                    <Input placeholder="RJ" maxLength={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Carga */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Informações da Carga
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="volumes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de Volumes</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso Total (kg)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1"
                      min="0"
                      placeholder="0.0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="merchandiseValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Mercadoria (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cargoDescription"
              render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>Descrição da Carga</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o que está sendo transportado..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Motorista e Veículo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👤 Motorista e Veículo (opcional)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Motorista</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="driverCpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF do Motorista</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa do Veículo</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC-1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📄 Documentos e Observações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da Nota Fiscal</FormLabel>
                  <FormControl>
                    <Input placeholder="000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações Adicionais</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informações importantes sobre o transporte..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : orderToEdit ? "Atualizar Ordem" : "Criar Ordem de Coleta"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SimpleCollectionOrderForm;