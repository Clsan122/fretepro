
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CargoSection } from "@/components/quotation/CargoSection";
import { LocationSection } from "@/components/quotation/LocationSection";
import { FreightCompositionSection } from "@/components/quotation/FreightCompositionSection";
import { CompanyDetailsSection } from "@/components/quotation/CompanyDetailsSection";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { getClientsByUserId } from "@/utils/storage";
import { QuotationData, QuotationMeasurement } from "@/components/quotation/types";

const QuotationEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form state
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [creatorId, setCreatorId] = useState<string>(user?.id || "");
  const [creatorName, setCreatorName] = useState<string>(user?.name || "");
  const [orderNumber, setOrderNumber] = useState<string>("");
  
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
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [createdAt, setCreatedAt] = useState<string>(new Date().toISOString());
  
  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingQuotation, setLoadingQuotation] = useState<boolean>(true);
  const [clients, setClients] = useState<any[]>([]);
  
  useEffect(() => {
    // Calculate insurance value based on merchandise value and rate
    if (merchandiseValue > 0) {
      const calculatedInsurance = merchandiseValue * (insuranceRate / 100);
      setInsuranceValue(calculatedInsurance);
    }
  }, [merchandiseValue, insuranceRate]);
  
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
  
  useEffect(() => {
    if (id && user) {
      setLoadingQuotation(true);
      try {
        const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
        const quotationToEdit = storedQuotations.find((q: any) => q.id === id && q.userId === user.id);
        
        if (quotationToEdit) {
          // Preencher o formulário com os dados da cotação
          setCompanyLogo(quotationToEdit.creatorLogo || "");
          setCreatorId(quotationToEdit.creatorId || user?.id || "");
          setCreatorName(quotationToEdit.creatorName || "");
          setOrderNumber(quotationToEdit.orderNumber || "");
          setOriginCity(quotationToEdit.originCity || "");
          setOriginState(quotationToEdit.originState || "");
          setDestinationCity(quotationToEdit.destinationCity || "");
          setDestinationState(quotationToEdit.destinationState || "");
          setVolumes(quotationToEdit.volumes || 0);
          setWeight(quotationToEdit.weight || 0);
          setMeasurements(quotationToEdit.measurements || [
            { id: uuidv4(), length: 0, width: 0, height: 0, quantity: 1 }
          ]);
          setCargoType(quotationToEdit.cargoType || "general");
          setMerchandiseValue(quotationToEdit.merchandiseValue || 0);
          setVehicleType(quotationToEdit.vehicleType || "");
          setFreightValue(quotationToEdit.freightValue || 0);
          setTollValue(quotationToEdit.tollValue || 0);
          setInsuranceValue(quotationToEdit.insuranceValue || 0);
          setInsuranceRate(quotationToEdit.insuranceRate || 0.15);
          setOtherCosts(quotationToEdit.otherCosts || 0);
          setTotalValue(quotationToEdit.totalValue || 0);
          setNotes(quotationToEdit.notes || "");
          setStatus(quotationToEdit.status || "open");
          setCreatedAt(quotationToEdit.createdAt || new Date().toISOString());
        } else {
          toast({
            title: "Erro",
            description: "Cotação não encontrada",
            variant: "destructive"
          });
          navigate("/quotations");
        }
      } catch (error) {
        console.error("Error loading quotation:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a cotação",
          variant: "destructive"
        });
      } finally {
        setLoadingQuotation(false);
      }
    }
  }, [id, user, navigate, toast]);
  
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
    if (!user || !id) return;
    
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
      // Get existing quotations
      const existingQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
      
      // Create updated quotation object
      const updatedQuotation: QuotationData = {
        id,
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
        createdAt,
        userId: user.id,
        status
      };
      
      // Find and update the quotation
      const updatedQuotations = existingQuotations.map((q: any) => 
        q.id === id ? updatedQuotation : q
      );
      
      // Save to localStorage
      localStorage.setItem('quotations', JSON.stringify(updatedQuotations));
      
      toast({
        title: "Sucesso",
        description: "Cotação atualizada com sucesso"
      });
      
      // Navigate to quotation view
      navigate(`/quotation/view/${id}`);
    } catch (error) {
      console.error("Error updating quotation:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a cotação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loadingQuotation) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Carregando cotação...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <Card className="bg-gradient-to-br from-card to-card/90 backdrop-blur-sm shadow-lg dark:from-gray-800 dark:to-gray-900/90">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-freight-700 dark:text-freight-300">
                    Editar Cotação de Frete
                  </CardTitle>
                  <CardDescription className="text-left">
                    Cotação #{orderNumber}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate("/quotations")}
                  className="hidden md:flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </div>
            </CardHeader>
          </Card>
          
          {/* Company Details Section */}
          <CompanyDetailsSection
            companyLogo={companyLogo}
            handleLogoUpload={handleLogoUpload}
            creatorId={creatorId}
            onCreatorChange={handleCreatorChange}
            clients={clients}
          />
          
          {/* Location Section */}
          <LocationSection 
            originCity={originCity}
            originState={originState}
            destinationCity={destinationCity}
            destinationState={destinationState}
            onOriginCityChange={setOriginCity}
            onOriginStateChange={setOriginState}
            onDestinationCityChange={setDestinationCity}
            onDestinationStateChange={setDestinationState}
          />
          
          {/* Cargo Section */}
          <CargoSection 
            volumes={volumes}
            setVolumes={setVolumes}
            weight={weight}
            setWeight={setWeight}
            merchandiseValue={merchandiseValue}
            setMerchandiseValue={setMerchandiseValue}
            cargoType={cargoType}
            setCargoType={setCargoType}
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            measurements={measurements}
            handleAddMeasurement={handleAddMeasurement}
            handleRemoveMeasurement={handleRemoveMeasurement}
            handleMeasurementChange={handleMeasurementChange}
          />
          
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
          />
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-end pt-4 pb-20 md:pb-4">
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => navigate(`/quotation/view/${id}`)}
            >
              Cancelar
            </Button>
            
            <Button
              className="w-full md:w-auto bg-gradient-to-r from-freight-600 to-freight-800 hover:from-freight-700 hover:to-freight-900 hover:shadow-lg transition-all"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuotationEdit;
