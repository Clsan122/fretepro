
import React, { useState, useEffect } from "react";
import { Freight, Client, Driver } from "@/types";
import { useAuth } from "@/context/AuthContext";
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

interface FreightFormProps {
  onSave: (freight: Freight) => void;
  onCancel: () => void;
  freightToEdit?: Freight;
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
  const [cubicMeasurement, setCubicMeasurement] = useState<number>(0);
  const [cargoType, setCargoType] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [freightValue, setFreightValue] = useState<number>(0);
  const [dailyRate, setDailyRate] = useState<number>(0);
  const [otherCosts, setOtherCosts] = useState<number>(0);
  const [tollCosts, setTollCosts] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [proofImage, setProofImage] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [driverId, setDriverId] = useState<string>("");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  const [pixKey, setPixKey] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  
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
      setCubicMeasurement(freightToEdit.cubicMeasurement);
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
      setDriverId(freightToEdit.driverId || "");
    }
  }, [freightToEdit]);

  useEffect(() => {
    const total = freightValue + dailyRate + otherCosts + tollCosts;
    setTotalValue(total);
  }, [freightValue, dailyRate, otherCosts, tollCosts]);

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
      cubicMeasurement,
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
      driverId: driverId || undefined,
    };

    onSave(newFreight);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <CargoDetailsSection 
        volumes={volumes}
        setVolumes={setVolumes}
        weight={weight}
        setWeight={setWeight}
        dimensions={dimensions}
        setDimensions={setDimensions}
        cubicMeasurement={cubicMeasurement}
        setCubicMeasurement={setCubicMeasurement}
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
