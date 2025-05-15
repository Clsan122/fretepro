import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FreightCompositionSection } from "@/components/quotation/FreightCompositionSection";
import { CompanyDetailsSection } from "@/components/quotation/CompanyDetailsSection";
import { QuotationPdfDocument } from "@/components/quotation/QuotationPdfDocument";
import { QuotationActionsButtons } from "@/components/quotation/QuotationActionsButtons";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Printer, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getClientsByUserId } from "@/utils/storage";
import { QuotationData, QuotationMeasurement } from "@/components/quotation/types";
import { generateQuotationNumber } from "@/utils/quotationNumber";
import { generateQuotationPdf } from "@/utils/pdfGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

const CARGO_TYPES = [
  { value: "general", label: "Carga Geral" },
  { value: "sacks", label: "Sacaria" },
  { value: "boxes", label: "Caixas" },
  { value: "units", label: "Unidades" },
  { value: "bulk", label: "Granel" },
  { value: "dangerous", label: "Carga Perigosa" },
  { value: "refrigerated", label: "Refrigerada" },
];

const VEHICLE_TYPES = [
  { value: "van", label: "Van de Carga" },
  { value: "utility", label: "Utilitário Pequeno" },
  { value: "truck_small", label: "Caminhão 3/4" },
  { value: "truck_medium", label: "Caminhão Toco" },
  { value: "truck_large", label: "Caminhão Truck" },
  { value: "truck_extra", label: "Caminhão Bitruck" },
  { value: "trailer", label: "Carreta Simples" },
  { value: "trailer_extended", label: "Carreta Estendida" },
  { value: "trailer_refrigerated", label: "Carreta Refrigerada" },
];

const QuotationForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Form state
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [creatorId, setCreatorId] = useState<string>(user?.id || "");
  const [creatorName, setCreatorName] = useState<string>(user?.name || "");
  
  // Location information
  const [originCity, setOriginCity] = useState<string>("");
  const [originState, setOriginState] = useState<string>("");
  const [destinationCity, setDestinationCity] = useState<string>("");
  const [destinationState, setDestinationState] = useState<string>("");
  
  // Cargo information
  const [volumes, setVolumes] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [measurements, setMeasurements] = useState<QuotationMeasurement[]>([
    { id: uuidv4(), length: 0, width: 0, height: 0, quantity: 1 }
  ]);
  const [cargoType, setCargoType] = useState<string>("general");
  const [merchandiseValue, setMerchandiseValue] = useState<number>(0);
  const [vehicleType, setVehicleType] = useState<string>("");
  
  // Freight composition
  const [freightValue, setFreightValue] = useState<number>(0);
  const [tollValue, setTollValue] = useState<number>(0);
  const [insuranceValue, setInsuranceValue] = useState<number>(0);
  const [insuranceRate, setInsuranceRate] = useState<number>(0.15);
  const [otherCosts, setOtherCosts] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  
  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isPdfOpen, setIsPdfOpen] = useState<boolean>(false);
  const [quotationForPdf, setQuotationForPdf] = useState<QuotationData | null>(null);
  const [tempOrderNumber, setTempOrderNumber] = useState<string>("");
  const [generatingPdf, setGeneratingPdf] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  useEffect(() => {
    // Calculate insurance value based on merchandise value and rate
    if (merchandiseValue > 0) {
      const calculatedInsurance = merchandiseValue * (insuranceRate / 100);
      setInsuranceValue(calculatedInsurance);
    }
  }, [merchandiseValue, insuranceRate]);
  
  // Função para calcular o valor total do frete
  useEffect(() => {
    // Calculate total value
    const total = freightValue + tollValue + insuranceValue + otherCosts;
    setTotalValue(total);
  }, [freightValue, tollValue, insuranceValue, otherCosts]);
  
  useEffect(() => {
    // Load clients for creator selection
    if (user) {
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);
    }
  }, [user]);
  
  // Gerar temporariamente um número de cotação para pré-visualização
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setTempOrderNumber(`${currentYear}XXXX`);
  }, []);
  
  const handleMeasurementChange = (id: string, field: keyof QuotationMeasurement, value: number) => {
    setMeasurements(
      measurements.map(measurement =>
        measurement.id === id ? { ...measurement, [field]: value } : measurement
      )
    );
  };

  const handleAddMeasurement = () => {
    const newMeasurement: QuotationMeasurement = {
      id: uuidv4(),
      length: 0,
      width: 0,
      height: 0,
      quantity: 1
    };
    setMeasurements([...measurements, newMeasurement]);
  };

  const handleRemoveMeasurement = (id: string) => {
    if (measurements.length > 1) {
      setMeasurements(measurements.filter(measurement => measurement.id !== id));
    }
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCreatorChange = (id: string) => {
    setCreatorId(id);
    if (id === user?.id) {
      setCreatorName(user?.name || "");
      setCompanyLogo(user?.companyLogo || "");
    } else {
      const selectedClient = clients.find(client => client.id === id);
      if (selectedClient) {
        setCreatorName(selectedClient.name);
        setCompanyLogo(selectedClient.logo || "");
      }
    }
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    if (!originCity || !originState || !destinationCity || !destinationState) {
      toast({
        title: "Erro",
        description: "Por favor, preencha os campos de origem e destino",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate a sequential order number
      const orderNumber = generateQuotationNumber();
      
      // Create quotation object
      const quotation: QuotationData = {
        id: uuidv4(),
        orderNumber,
        creatorId,
        creatorName,
        creatorLogo: companyLogo,
        originCity,
        originState,
        destinationCity,
        destinationState,
        volumes,
        weight,
        measurements,
        cargoType,
        merchandiseValue,
        vehicleType,
        freightValue,
        tollValue,
        insuranceValue,
        insuranceRate,
        otherCosts,
        totalValue,
        notes,
        createdAt: new Date().toISOString(),
        userId: user.id,
        status: "open" // Nova cotação sempre começa como aberta
      };
      
      // Save to localStorage (in a real app, this would be saved to a database)
      const existingQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
      localStorage.setItem('quotations', JSON.stringify([...existingQuotations, quotation]));
      
      toast({
        title: "Sucesso",
        description: "Cotação salva com sucesso"
      });
      
      // Navigate to quotation view instead of list
      navigate(`/quotation/view/${quotation.id}`);
    } catch (error) {
      console.error("Error saving quotation:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a cotação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGeneratePdf = () => {
    // Validar dados mínimos necessários
    if (!creatorName || !originCity || !originState || !destinationCity || !destinationState) {
      toast({
        title: "Dados incompletos",
        description: "Preencha pelo menos origem, destino e dados do emissor para gerar o PDF",
        variant: "destructive"
      });
      return;
    }

    // Criar objeto temporário de cotação para a visualização do PDF
    const tempQuotation: QuotationData = {
      id: "preview",
      orderNumber: tempOrderNumber,
      creatorId,
      creatorName,
      creatorLogo: companyLogo,
      originCity,
      originState,
      destinationCity,
      destinationState,
      volumes,
      weight,
      measurements,
      cargoType,
      merchandiseValue,
      vehicleType,
      freightValue,
      tollValue,
      insuranceValue,
      insuranceRate,
      otherCosts,
      totalValue,
      notes,
      createdAt: new Date().toISOString(),
      userId: user?.id || "",
      status: "open"
    };
    
    setQuotationForPdf(tempQuotation);
    setIsPdfOpen(true);
  };
  
  const handlePrintPdf = async () => {
    setTimeout(() => {
      window.print();
    }, 500);
  };
  
  const handleDownloadPdf = async () => {
    try {
      if (quotationForPdf) {
        setGeneratingPdf(true);
        
        toast({
          title: "Gerando PDF",
          description: "Aguarde enquanto preparamos o documento..."
        });
        
        // Use the utility function to generate the PDF
        const success = await generateQuotationPdf("preview");
        
        if (success) {
          toast({
            title: "PDF gerado",
            description: "O PDF foi baixado com sucesso"
          });
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível gerar o PDF",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF",
        variant: "destructive"
      });
    } finally {
      setGeneratingPdf(false);
    }
  };
  
  // Criar objeto com todos os dados da cotação para passar ao componente de botões
  const quotationData = {
    creatorId,
    creatorName,
    creatorLogo: companyLogo,
    originCity,
    originState,
    destinationCity,
    destinationState,
    volumes,
    weight,
    measurements,
    cargoType,
    merchandiseValue,
    vehicleType,
    freightValue,
    tollValue,
    insuranceValue,
    insuranceRate,
    otherCosts,
    totalValue,
    notes
  };
  
  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <Card className="bg-gradient-to-br from-card to-card/90 backdrop-blur-sm shadow-lg dark:from-gray-800 dark:to-gray-900/90">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-center md:text-left text-freight-700 dark:text-freight-300">
                Nova Cotação de Frete
              </CardTitle>
              <CardDescription className="text-center md:text-left">
                Preencha os dados abaixo para gerar uma cotação completa
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="all">Visão Completa</TabsTrigger>
              <TabsTrigger value="edit">Modo Edição</TabsTrigger>
            </TabsList>
            
            {/* Visão Completa - Todos os campos em uma página */}
            <TabsContent value="all" className="space-y-6">
              {/* Company Details Section */}
              <CompanyDetailsSection
                companyLogo={companyLogo}
                handleLogoUpload={handleLogoUpload}
                creatorId={creatorId}
                onCreatorChange={handleCreatorChange}
                clients={clients}
              />
              
              {/* Resumo Completo */}
              <FreightCompositionSection 
                freightValue={freightValue}
                setFreightValue={setFreightValue}
                tollValue={tollValue}
                setTollValue={setTollValue}
                insuranceValue={insuranceValue}
                setInsuranceValue={setInsuranceValue}
                insuranceRate={insuranceRate}
                setInsuranceRate={setInsuranceRate}
                merchandiseValue={merchandiseValue}
                otherCosts={otherCosts}
                setOtherCosts={setOtherCosts}
                totalValue={totalValue}
                notes={notes}
                setNotes={setNotes}
                // Campos adicionais
                originCity={originCity}
                originState={originState}
                destinationCity={destinationCity}
                destinationState={destinationState}
                volumes={volumes}
                weight={weight}
                vehicleType={vehicleType}
                cargoType={cargoType}
              />
            </TabsContent>
            
            {/* Modo de Edição - Campos editáveis */}
            <TabsContent value="edit" className="space-y-6">
              {/* Company Details Section */}
              <CompanyDetailsSection
                companyLogo={companyLogo}
                handleLogoUpload={handleLogoUpload}
                creatorId={creatorId}
                onCreatorChange={handleCreatorChange}
                clients={clients}
              />
              
              {/* Location Section - Editar origem e destino */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-freight-100 dark:border-freight-800">
                <CardHeader className="bg-freight-50/50 dark:bg-freight-900/50">
                  <CardTitle className="text-freight-700 dark:text-freight-300">
                    Origem e Destino
                  </CardTitle>
                  <CardDescription>
                    Informe as cidades e estados de origem e destino da carga
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Origin */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-freight-700 dark:text-freight-300">Origem</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="originState">Estado</Label>
                        <Select value={originState} onValueChange={(value) => {
                          setOriginState(value);
                          // Limpar cidade quando mudar o estado
                          setOriginCity("");
                        }}>
                          <SelectTrigger id="originState" className="w-full">
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EX" className="cursor-pointer">Exterior</SelectItem>
                            {BRAZILIAN_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value} className="cursor-pointer">
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originCity">Cidade</Label>
                        <Input
                          id="originCity"
                          value={originCity}
                          onChange={(e) => setOriginCity(e.target.value)}
                          placeholder="Digite a cidade de origem"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-freight-700 dark:text-freight-300">Destino</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="destinationState">Estado</Label>
                        <Select value={destinationState} onValueChange={(value) => {
                          setDestinationState(value);
                          // Limpar cidade quando mudar o estado
                          setDestinationCity("");
                        }}>
                          <SelectTrigger id="destinationState" className="w-full">
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EX" className="cursor-pointer">Exterior</SelectItem>
                            {BRAZILIAN_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value} className="cursor-pointer">
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destinationCity">Cidade</Label>
                        <Input
                          id="destinationCity"
                          value={destinationCity}
                          onChange={(e) => setDestinationCity(e.target.value)}
                          placeholder="Digite a cidade de destino"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Cargo Section - Editar dados da carga */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-freight-100 dark:border-freight-800">
                <CardHeader className="bg-freight-50/50 dark:bg-freight-900/50">
                  <CardTitle className="text-freight-700 dark:text-freight-300">
                    Dados do Material
                  </CardTitle>
                  <CardDescription>
                    Informe as características da carga a ser transportada
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Basic cargo details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="volumes">Quantidade de Volumes</Label>
                      <Input 
                        id="volumes" 
                        type="number" 
                        value={volumes.toString()} 
                        onChange={e => setVolumes(Number(e.target.value))} 
                        placeholder="Quantidade de volumes" 
                        min="0"
                        className="transition-all focus:ring-freight-500 focus:border-freight-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso (kg)</Label>
                      <Input 
                        id="weight" 
                        type="number" 
                        step="0.01" 
                        value={weight.toString()} 
                        onChange={e => setWeight(Number(e.target.value))} 
                        placeholder="Peso total em kg" 
                        min="0"
                        className="transition-all focus:ring-freight-500 focus:border-freight-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cargoType">Tipo de Carga</Label>
                      <Select value={cargoType} onValueChange={setCargoType}>
                        <SelectTrigger id="cargoType" className="w-full">
                          <SelectValue placeholder="Selecione o tipo de carga" />
                        </SelectTrigger>
                        <SelectContent>
                          {CARGO_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="merchandiseValue">Valor da Mercadoria (R$)</Label>
                      <Input 
                        id="merchandiseValue" 
                        type="number" 
                        step="0.01" 
                        value={merchandiseValue.toString()} 
                        onChange={e => setMerchandiseValue(Number(e.target.value))} 
                        placeholder="Valor da mercadoria" 
                        min="0"
                        className="transition-all focus:ring-freight-500 focus:border-freight-500"
                      />
                    </div>
                  </div>

                  {/* Vehicle Type */}
                  <div className="border-t pt-4 border-freight-100 dark:border-freight-800">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType" className="text-lg font-medium text-freight-700 dark:text-freight-300">
                        Tipo de Veículo
                      </Label>
                      <Select value={vehicleType} onValueChange={setVehicleType}>
                        <SelectTrigger id="vehicleType" className="w-full">
                          <SelectValue placeholder="Selecione o tipo de veículo" />
                        </SelectTrigger>
                        <SelectContent>
                          {VEHICLE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Dimensões - Novo campo */}
                  <div className="border-t pt-4 border-freight-100 dark:border-freight-800">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-lg font-medium text-freight-700 dark:text-freight-300">
                          Dimensões (cm)
                        </Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={handleAddMeasurement}
                        >
                          Adicionar Dimensão
                        </Button>
                      </div>
                      
                      {measurements.map((measurement, index) => (
                        <div key={measurement.id} className="grid grid-cols-5 gap-2 items-end border p-2 rounded-md">
                          <div className="space-y-1">
                            <Label htmlFor={`length-${measurement.id}`}>Comprimento</Label>
                            <Input
                              id={`length-${measurement.id}`}
                              type="number"
                              min="0"
                              step="0.1"
                              value={measurement.length || ''}
                              onChange={(e) => handleMeasurementChange(measurement.id, 'length', Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`width-${measurement.id}`}>Largura</Label>
                            <Input
                              id={`width-${measurement.id}`}
                              type="number"
                              min="0"
                              step="0.1"
                              value={measurement.width || ''}
                              onChange={(e) => handleMeasurementChange(measurement.id, 'width', Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`height-${measurement.id}`}>Altura</Label>
                            <Input
                              id={`height-${measurement.id}`}
                              type="number"
                              min="0"
                              step="0.1"
                              value={measurement.height || ''}
                              onChange={(e) => handleMeasurementChange(measurement.id, 'height', Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`quantity-${measurement.id}`}>Quantidade</Label>
                            <Input
                              id={`quantity-${measurement.id}`}
                              type="number"
                              min="1"
                              value={measurement.quantity || 1}
                              onChange={(e) => handleMeasurementChange(measurement.id, 'quantity', Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveMeasurement(measurement.id)}
                            disabled={measurements.length <= 1}
                            className="self-end"
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Freight Composition Section */}
              <FreightCompositionSection 
                freightValue={freightValue}
                setFreightValue={setFreightValue}
                tollValue={tollValue}
                setTollValue={setTollValue}
                insuranceValue={insuranceValue}
                setInsuranceValue={setInsuranceValue}
                insuranceRate={insuranceRate}
                setInsuranceRate={setInsuranceRate}
                merchandiseValue={merchandiseValue}
                otherCosts={otherCosts}
                setOtherCosts={setOtherCosts}
                totalValue={totalValue}
                notes={notes}
                setNotes={setNotes}
                // Campos adicionais
                originCity={originCity}
                originState={originState}
                destinationCity={destinationCity}
                destinationState={destinationState}
                volumes={volumes}
                weight={weight}
                vehicleType={vehicleType}
                cargoType={cargoType}
              />
            </TabsContent>
          </Tabs>
          
          {/* Action Buttons */}
          <QuotationActionsButtons 
            loading={loading}
            handleSave={handleSave}
            handleGeneratePdf={handleGeneratePdf}
            quotationData={quotationData}
          />
        </div>
      </div>

      {/* Modal para exibição do PDF */}
      <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="flex justify-between items-center">
            <span>Pré-visualização da Cotação</span>
          </DialogTitle>
          
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" onClick={handlePrintPdf} className="gap-2">
              <Printer className="h-5 w-5" />
              <span className="hidden sm:inline">Imprimir</span>
            </Button>
            <Button 
              onClick={handleDownloadPdf} 
              disabled={generatingPdf}
              className="gap-2"
            >
              <FileDown className="h-5 w-5" />
              <span className="hidden sm:inline">
                {generatingPdf ? "Gerando..." : "Baixar PDF"}
              </span>
            </Button>
          </div>
          
          <div className="p-2 border rounded-md bg-white">
            <div id="quotation-pdf-preview" className="overflow-auto scale-[0.7] origin-top-left mx-auto">
              {quotationForPdf && <QuotationPdfDocument quotation={quotationForPdf} />}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default QuotationForm;
