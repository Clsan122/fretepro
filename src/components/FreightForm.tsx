
import React, { useState, useEffect } from "react";
import { Freight, Client, Driver } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { getClientsByUserId, getDriversByUserId } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

// Import the section components
import { ClientSelectionSection } from "./freight/ClientSelectionSection";
import { DriverSelectionSection } from "./freight/DriverSelectionSection";
import { RouteSection } from "./freight/RouteSection";
import { CargoDetailsSection } from "./freight/CargoDetailsSection";
import { PaymentInfoSection } from "./freight/PaymentInfoSection";
import { PricingSection } from "./freight/PricingSection";
import { DeliveryProofSection } from "./freight/DeliveryProofSection";
import { FormActions } from "./freight/FormActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FreightFormProps {
  onSave: (freight: Freight) => void;
  onCancel: () => void;
  freightToEdit?: Freight;
}

interface CubageMeasurements {
  length: number;
  width: number;
  height: number;
}

const FreightForm: React.FC<FreightFormProps> = ({ onSave, onCancel, freightToEdit }) => {
  const [clientId, setClientId] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [originState, setOriginState] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [destinationCity, setDestinationCity] = useState("");
  const [destinationState, setDestinationState] = useState("");
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [volumes, setVolumes] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [dimensions, setDimensions] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [freightValue, setFreightValue] = useState<number>(0);
  const [dailyRate, setDailyRate] = useState<number>(0);
  const [otherCosts, setOtherCosts] = useState<number>(0);
  const [tollCosts, setTollCosts] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [proofImage, setProofImage] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [driverId, setDriverId] = useState<string>("none");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  const [pixKey, setPixKey] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  
  // Add state for cubage calculator
  const [cubageMeasurements, setCubageMeasurements] = useState<CubageMeasurements>({
    length: 0,
    width: 0,
    height: 0
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setClients(getClientsByUserId(user.id));
      setDrivers(getDriversByUserId(user.id));
    }
  }, [user]);

  useEffect(() => {
    if (freightToEdit) {
      setClientId(freightToEdit.clientId);
      setOriginCity(freightToEdit.originCity);
      setOriginState(freightToEdit.originState);
      setDepartureDate(freightToEdit.departureDate ? new Date(freightToEdit.departureDate) : undefined);
      setDestinationCity(freightToEdit.destinationCity);
      setDestinationState(freightToEdit.destinationState);
      setArrivalDate(freightToEdit.arrivalDate ? new Date(freightToEdit.arrivalDate) : undefined);
      setVolumes(freightToEdit.volumes);
      setWeight(freightToEdit.weight);
      setDimensions(freightToEdit.dimensions);
      setCargoType(freightToEdit.cargoType);
      setVehicleType(freightToEdit.vehicleType);
      setFreightValue(freightToEdit.freightValue);
      setDailyRate(freightToEdit.dailyRate);
      setOtherCosts(freightToEdit.otherCosts);
      setTollCosts(freightToEdit.tollCosts);
      setTotalValue(freightToEdit.totalValue);
      setProofImage(freightToEdit.proofOfDeliveryImage || "");
      setPixKey(freightToEdit.pixKey || "");
      setPaymentTerm(freightToEdit.paymentTerm || "");
      setDriverId(freightToEdit.driverId || "none");
    }
  }, [freightToEdit]);

  useEffect(() => {
    const total = freightValue + dailyRate + otherCosts + tollCosts;
    setTotalValue(total);
  }, [freightValue, dailyRate, otherCosts, tollCosts]);

  // Add calculation for cubage
  useEffect(() => {
    if (cubageMeasurements.length > 0 && cubageMeasurements.width > 0 && cubageMeasurements.height > 0) {
      const cubage = (cubageMeasurements.length * cubageMeasurements.width * cubageMeasurements.height) / 1000000; // convert cm³ to m³
      setDimensions(`${cubageMeasurements.length}x${cubageMeasurements.width}x${cubageMeasurements.height} cm`);
    }
  }, [cubageMeasurements]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCubageMeasurementChange = (field: keyof CubageMeasurements, value: number) => {
    setCubageMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || !originCity || !originState || !destinationCity || !destinationState || !cargoType || !vehicleType) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios!",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cadastrar um frete!",
        variant: "destructive",
      });
      return;
    }

    const newFreight: Freight = {
      id: freightToEdit ? freightToEdit.id : uuidv4(),
      clientId,
      originCity,
      originState,
      departureDate: departureDate ? departureDate.toISOString() : "",
      destinationCity,
      destinationState,
      arrivalDate: arrivalDate ? arrivalDate.toISOString() : "",
      volumes,
      weight,
      dimensions,
      cubicMeasurement: 0, // Set default value as it's required by type but removed from form
      cargoType: cargoType as any,
      vehicleType: vehicleType as any,
      freightValue,
      dailyRate,
      otherCosts,
      tollCosts,
      totalValue,
      proofOfDeliveryImage: proofImage,
      createdAt: freightToEdit ? freightToEdit.createdAt : new Date().toISOString(),
      userId: user.id,
      pixKey: pixKey || undefined,
      paymentTerm: paymentTerm ? (paymentTerm as any) : undefined,
      driverId: driverId !== "none" ? driverId : undefined,
    };

    onSave(newFreight);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1 sm:p-2">
      <ClientSelectionSection 
        clientId={clientId} 
        clients={clients} 
        setClientId={setClientId} 
      />

      <DriverSelectionSection 
        driverId={driverId}
        drivers={drivers}
        setDriverId={setDriverId}
      />

      <RouteSection 
        originCity={originCity}
        setOriginCity={setOriginCity}
        originState={originState}
        setOriginState={setOriginState}
        departureDate={departureDate}
        setDepartureDate={setDepartureDate}
        destinationCity={destinationCity}
        setDestinationCity={setDestinationCity}
        destinationState={destinationState}
        setDestinationState={setDestinationState}
        arrivalDate={arrivalDate}
        setArrivalDate={setArrivalDate}
      />

      {/* Cubage Calculator - kept but cubicMeasurement field removed */}
      <Card className="border rounded-lg shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Calculadora de Dimensões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="length">Comprimento (cm)</Label>
              <Input
                id="length"
                type="number"
                min="0"
                step="0.01"
                value={cubageMeasurements.length || ""}
                onChange={(e) => handleCubageMeasurementChange("length", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="width">Largura (cm)</Label>
              <Input
                id="width"
                type="number"
                min="0"
                step="0.01"
                value={cubageMeasurements.width || ""}
                onChange={(e) => handleCubageMeasurementChange("width", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                min="0"
                step="0.01"
                value={cubageMeasurements.height || ""}
                onChange={(e) => handleCubageMeasurementChange("height", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          {dimensions && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="font-medium">Resultado do cálculo:</p>
              <p>Dimensões: <span className="font-medium">{dimensions}</span></p>
            </div>
          )}
        </CardContent>
      </Card>

      <CargoDetailsSection 
        volumes={volumes}
        setVolumes={setVolumes}
        weight={weight}
        setWeight={setWeight}
        dimensions={dimensions}
        setDimensions={setDimensions}
        cubicMeasurement={0} // Passing default value since it's required by component
        setCubicMeasurement={() => {}} // Empty function as we no longer use this field
        cargoType={cargoType}
        setCargoType={setCargoType}
        vehicleType={vehicleType}
        setVehicleType={setVehicleType}
      />

      <PaymentInfoSection 
        pixKey={pixKey}
        setPixKey={setPixKey}
        paymentTerm={paymentTerm}
        setPaymentTerm={setPaymentTerm}
      />

      <PricingSection 
        freightValue={freightValue}
        setFreightValue={setFreightValue}
        dailyRate={dailyRate}
        setDailyRate={setDailyRate}
        otherCosts={otherCosts}
        setOtherCosts={setOtherCosts}
        tollCosts={tollCosts}
        setTollCosts={setTollCosts}
        totalValue={totalValue}
      />

      <DeliveryProofSection 
        proofImage={proofImage}
        setProofImage={setProofImage}
        handleImageUpload={handleImageUpload}
      />

      <FormActions 
        onCancel={onCancel}
        isEditing={Boolean(freightToEdit)}
      />
    </form>
  );
};

export default FreightForm;
