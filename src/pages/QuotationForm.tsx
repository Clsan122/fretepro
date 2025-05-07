
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CargoSection } from "@/components/quotation/CargoSection";
import { LocationSection } from "@/components/quotation/LocationSection";
import { FreightCompositionSection } from "@/components/quotation/FreightCompositionSection";
import { CompanyDetailsSection } from "@/components/quotation/CompanyDetailsSection";
import { Loader2, Save, FileDown, Send } from "lucide-react";
import { getClientsByUserId } from "@/utils/storage";

interface QuotationMeasurement {
  id: string;
  length: number;
  width: number;
  height: number;
  quantity: number;
}

export interface QuotationData {
  id: string;
  orderNumber?: string;
  creatorId: string;
  creatorName: string;
  creatorLogo?: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  volumes: number;
  weight: number;
  measurements: QuotationMeasurement[];
  cargoType: string;
  merchandiseValue: number;
  vehicleType: string;
  freightValue: number;
  tollValue: number;
  insuranceValue: number;
  otherCosts: number;
  totalValue: number;
  notes?: string;
  createdAt: string;
  userId: string;
}

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
  const [otherCosts, setOtherCosts] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  
  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<any[]>([]);
  
  useEffect(() => {
    // Calculate insurance value based on merchandise value (0.5%)
    if (merchandiseValue > 0) {
      const calculatedInsurance = merchandiseValue * 0.005;
      setInsuranceValue(calculatedInsurance);
    }
  }, [merchandiseValue]);
  
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
      // Create quotation object
      const quotation: QuotationData = {
        id: uuidv4(),
        orderNumber: `QT${Math.floor(Math.random() * 10000)}`,
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
        otherCosts,
        totalValue,
        notes,
        createdAt: new Date().toISOString(),
        userId: user.id
      };
      
      // Save to localStorage (in a real app, this would be saved to a database)
      const existingQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
      localStorage.setItem('quotations', JSON.stringify([...existingQuotations, quotation]));
      
      toast({
        title: "Sucesso",
        description: "Cotação salva com sucesso"
      });
      
      // Navigate to quotations list
      navigate("/quotations");
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
    toast({
      title: "Gerando PDF",
      description: "Esta funcionalidade será implementada em breve."
    });
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
                Preencha os campos abaixo para gerar uma nova cotação
              </CardDescription>
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
              onClick={() => navigate("/quotations")}
            >
              Cancelar
            </Button>
            
            <Button
              variant="secondary"
              className="w-full md:w-auto hover:shadow-md transition-all"
              onClick={handleGeneratePdf}
            >
              <FileDown className="mr-2 h-5 w-5" />
              Gerar PDF
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
              Salvar Cotação
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuotationForm;
