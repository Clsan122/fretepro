
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuotationForm, QuotationFormData } from "@/hooks/useQuotationForm";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { CNPJLookupField } from "@/components/collectionOrder/CNPJLookupField";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { generateOrderNumber } from "@/utils/orderNumber";
import { CollectionOrder, Measurement } from "@/types";

interface QuotationFormProps {
  onSave?: (data: QuotationFormData) => void;
  onCancel?: () => void;
  onConvertToOrder?: (order: CollectionOrder) => void;
  initialData?: Partial<QuotationFormData>;
}

const QuotationForm: React.FC<QuotationFormProps> = ({
  onSave,
  onCancel,
  onConvertToOrder,
  initialData
}) => {
  const { formData, clients, drivers, updateField, handleClientChange, calculateCubicMeasurement } = useQuotationForm(initialData);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.sender || !formData.recipient || !formData.originCity || !formData.destinationCity) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    if (onSave) {
      onSave(formData);
    }
    
    toast({
      title: "Cotação salva",
      description: "Cotação salva com sucesso",
    });
    
    setIsSubmitting(false);
  };
  
  const handleConvertToOrder = () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar uma ordem de coleta",
        variant: "destructive",
      });
      return;
    }
    
    // Calcular a cubagem baseada nas dimensões
    const cubicMeasurement = calculateCubicMeasurement();
    
    // Criar o objeto de medida
    const measurement: Measurement = {
      id: uuidv4(),
      length: formData.length,
      width: formData.width,
      height: formData.height,
      quantity: 1
    };
    
    // Criar a ordem de coleta baseada na cotação
    const newOrder: CollectionOrder = {
      id: uuidv4(),
      orderNumber: generateOrderNumber(),
      sender: formData.sender,
      senderAddress: formData.senderAddress,
      senderCnpj: formData.senderCnpj,
      senderCity: formData.senderCity,
      senderState: formData.senderState,
      recipient: formData.recipient,
      recipientAddress: formData.recipientAddress,
      originCity: formData.originCity,
      originState: formData.originState,
      destinationCity: formData.destinationCity,
      destinationState: formData.destinationState,
      shipper: formData.shipper,
      shipperAddress: formData.shipperAddress,
      receiver: "", // A ser preenchido depois
      receiverAddress: "", // A ser preenchido depois
      volumes: formData.volumes,
      weight: formData.weight,
      measurements: [measurement],
      cubicMeasurement: cubicMeasurement,
      merchandiseValue: formData.merchandiseValue,
      invoiceNumber: "", // A ser preenchido depois
      observations: formData.observations,
      driverId: formData.driverId,
      companyLogo: user.companyLogo || "",
      issuerId: user.id,
      createdAt: new Date().toISOString(),
      userId: user.id
    };
    
    if (onConvertToOrder) {
      onConvertToOrder(newOrder);
    } else {
      // Navegar para a página de criação de ordem com os dados pré-preenchidos
      navigate("/collection-order", { state: { prefillData: newOrder } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      {/* Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Cliente</Label>
              <Select 
                value={formData.clientId} 
                onValueChange={(value) => handleClientChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Informações do Remetente e Destinatário */}
      <Card>
        <CardHeader>
          <CardTitle>Remetente e Destinatário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1">
                REMETENTE
              </Label>
              <CNPJLookupField 
                label="CNPJ do Remetente"
                onDataFetched={(data) => {
                  updateField("sender", data.name);
                  updateField("senderAddress", data.address);
                  updateField("senderCnpj", data.cnpj || "");
                  updateField("senderCity", data.city);
                  updateField("senderState", data.state);
                }}
              />
              <div>
                <Label>Nome do Remetente</Label>
                <Input 
                  value={formData.sender} 
                  onChange={(e) => updateField("sender", e.target.value)}
                  placeholder="Digite o nome do remetente" 
                />
              </div>
              <div>
                <Label>Endereço do Remetente</Label>
                <Input 
                  value={formData.senderAddress} 
                  onChange={(e) => updateField("senderAddress", e.target.value)}
                  placeholder="Digite o endereço do remetente" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Cidade</Label>
                  <Input 
                    value={formData.senderCity} 
                    onChange={(e) => updateField("senderCity", e.target.value)}
                    placeholder="Cidade" 
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Input 
                    value={formData.senderState} 
                    onChange={(e) => updateField("senderState", e.target.value)}
                    placeholder="UF" 
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1">
                DESTINATÁRIO
              </Label>
              <div>
                <Label>Nome do Destinatário</Label>
                <Input 
                  value={formData.recipient} 
                  onChange={(e) => updateField("recipient", e.target.value)}
                  placeholder="Digite o nome do destinatário" 
                />
              </div>
              <div>
                <Label>Endereço do Destinatário</Label>
                <Input 
                  value={formData.recipientAddress} 
                  onChange={(e) => updateField("recipientAddress", e.target.value)}
                  placeholder="Digite o endereço do destinatário" 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1">
                EXPEDIDOR
              </Label>
              <div>
                <Label>Nome do Expedidor</Label>
                <Input 
                  value={formData.shipper} 
                  onChange={(e) => updateField("shipper", e.target.value)}
                  placeholder="Digite o nome do expedidor" 
                />
              </div>
              <div>
                <Label>Endereço do Expedidor</Label>
                <Input 
                  value={formData.shipperAddress} 
                  onChange={(e) => updateField("shipperAddress", e.target.value)}
                  placeholder="Digite o endereço do expedidor" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Localização */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Origem e Destino</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1">
                ORIGEM
              </Label>
              <div>
                <Label>Cidade de Origem</Label>
                <Input 
                  value={formData.originCity} 
                  onChange={(e) => updateField("originCity", e.target.value)}
                  placeholder="Digite a cidade de origem" 
                />
              </div>
              <div>
                <Label>Estado de Origem</Label>
                <Input 
                  value={formData.originState} 
                  onChange={(e) => updateField("originState", e.target.value)}
                  placeholder="UF" 
                  maxLength={2}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1">
                DESTINO
              </Label>
              <div>
                <Label>Cidade de Destino</Label>
                <Input 
                  value={formData.destinationCity} 
                  onChange={(e) => updateField("destinationCity", e.target.value)}
                  placeholder="Digite a cidade de destino" 
                />
              </div>
              <div>
                <Label>Estado de Destino</Label>
                <Input 
                  value={formData.destinationState} 
                  onChange={(e) => updateField("destinationState", e.target.value)}
                  placeholder="UF" 
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Informações da Carga */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Carga</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Volumes</Label>
              <Input 
                type="number"
                value={formData.volumes} 
                onChange={(e) => updateField("volumes", Number(e.target.value))}
                placeholder="Quantidade de volumes" 
              />
            </div>
            <div>
              <Label>Peso (kg)</Label>
              <Input 
                type="number"
                value={formData.weight} 
                onChange={(e) => updateField("weight", Number(e.target.value))}
                placeholder="Peso em kg" 
              />
            </div>
            <div>
              <Label>Valor da Mercadoria (R$)</Label>
              <Input 
                type="number"
                value={formData.merchandiseValue} 
                onChange={(e) => updateField("merchandiseValue", Number(e.target.value))}
                placeholder="Valor da mercadoria" 
              />
            </div>
          </div>
          
          {/* Dimensões */}
          <div className="mt-4">
            <Label className="text-lg font-semibold mb-1 text-purple-700 border-b-2 border-purple-300 pb-1">
              DIMENSÕES
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <Label>Comprimento (cm)</Label>
                <Input 
                  type="number"
                  value={formData.length} 
                  onChange={(e) => updateField("length", Number(e.target.value))}
                  placeholder="Comprimento" 
                />
              </div>
              <div>
                <Label>Largura (cm)</Label>
                <Input 
                  type="number"
                  value={formData.width} 
                  onChange={(e) => updateField("width", Number(e.target.value))}
                  placeholder="Largura" 
                />
              </div>
              <div>
                <Label>Altura (cm)</Label>
                <Input 
                  type="number"
                  value={formData.height} 
                  onChange={(e) => updateField("height", Number(e.target.value))}
                  placeholder="Altura" 
                />
              </div>
            </div>
            {/* Mostrar Cubagem calculada */}
            {formData.length > 0 && formData.width > 0 && formData.height > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">
                  Cubagem: {calculateCubicMeasurement().toFixed(3)} m³
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <Label>Tipo de Veículo</Label>
            <Select 
              value={formData.vehicleType} 
              onValueChange={(value) => updateField("vehicleType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de veículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VUC">VUC</SelectItem>
                <SelectItem value="3/4">3/4</SelectItem>
                <SelectItem value="Toco">Toco</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
                <SelectItem value="Carreta">Carreta</SelectItem>
                <SelectItem value="Bi-trem">Bi-trem</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Valor da Cotação */}
      <Card>
        <CardHeader>
          <CardTitle>Valor da Cotação</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Valor Cotado (R$)</Label>
            <Input 
              type="number"
              value={formData.quotedValue} 
              onChange={(e) => updateField("quotedValue", Number(e.target.value))}
              placeholder="Valor da cotação" 
              className="text-lg font-bold text-green-700"
            />
          </div>
          
          <div className="mt-4">
            <Label>Observações</Label>
            <Textarea 
              value={formData.observations} 
              onChange={(e) => updateField("observations", e.target.value)}
              placeholder="Observações sobre a cotação" 
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        
        <Button 
          type="button" 
          variant="secondary"
          onClick={handleConvertToOrder}
        >
          Converter em Ordem de Coleta
        </Button>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Cotação"}
        </Button>
      </div>
    </form>
  );
};

export default QuotationForm;
