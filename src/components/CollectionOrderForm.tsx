
import React, { useState, useEffect } from "react";
import { CollectionOrder, Driver, Measurement } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getDriversByUserId } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

// Import the section components
import { SenderRecipientSection } from "./collectionOrder/SenderRecipientSection";
import { LocationsSection } from "./collectionOrder/LocationsSection";
import { CargoSection } from "./collectionOrder/CargoSection";
import { MeasurementsSection } from "./collectionOrder/MeasurementsSection";
import { DriverSection } from "./collectionOrder/DriverSection";
import { CompanyLogoSection } from "./collectionOrder/CompanyLogoSection";
import { FormActions } from "./freight/FormActions";

interface CollectionOrderFormProps {
  onSave: (order: CollectionOrder) => void;
  onCancel: () => void;
  orderToEdit?: CollectionOrder;
}

const CollectionOrderForm: React.FC<CollectionOrderFormProps> = ({ 
  onSave, 
  onCancel, 
  orderToEdit 
}) => {
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [originState, setOriginState] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [destinationState, setDestinationState] = useState("");
  const [receiver, setReceiver] = useState("");
  const [volumes, setVolumes] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [measurements, setMeasurements] = useState<Measurement[]>([
    { id: uuidv4(), length: 0, width: 0, height: 0, quantity: 1 }
  ]);
  const [cubicMeasurement, setCubicMeasurement] = useState<number>(0);
  const [merchandiseValue, setMerchandiseValue] = useState<number>(0);
  const [driverId, setDriverId] = useState<string>("none");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [companyLogo, setCompanyLogo] = useState<string>("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      setDrivers(getDriversByUserId(user.id));
    }
  }, [user]);

  useEffect(() => {
    if (orderToEdit) {
      setSender(orderToEdit.sender);
      setRecipient(orderToEdit.recipient);
      setOriginCity(orderToEdit.originCity);
      setOriginState(orderToEdit.originState);
      setDestinationCity(orderToEdit.destinationCity);
      setDestinationState(orderToEdit.destinationState);
      setReceiver(orderToEdit.receiver);
      setVolumes(orderToEdit.volumes);
      setWeight(orderToEdit.weight);
      setMeasurements(orderToEdit.measurements);
      setCubicMeasurement(orderToEdit.cubicMeasurement);
      setMerchandiseValue(orderToEdit.merchandiseValue);
      setDriverId(orderToEdit.driverId || "none");
      setCompanyLogo(orderToEdit.companyLogo || "");
    }
  }, [orderToEdit]);

  // Calculate cubic measurement when measurements change
  useEffect(() => {
    const totalCubic = measurements.reduce((sum, item) => {
      const itemCubic = (item.length * item.width * item.height * item.quantity) / 1000000; // convert cm³ to m³
      return sum + itemCubic;
    }, 0);
    
    setCubicMeasurement(totalCubic);
  }, [measurements]);

  const handleAddMeasurement = () => {
    setMeasurements([
      ...measurements,
      { id: uuidv4(), length: 0, width: 0, height: 0, quantity: 1 }
    ]);
  };

  const handleRemoveMeasurement = (id: string) => {
    if (measurements.length > 1) {
      setMeasurements(measurements.filter(m => m.id !== id));
    }
  };

  const handleMeasurementChange = (id: string, field: keyof Measurement, value: number) => {
    setMeasurements(measurements.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sender || !recipient || !originCity || !originState || !destinationCity || !destinationState) {
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
        description: "Você precisa estar logado para cadastrar uma ordem de coleta!",
        variant: "destructive",
      });
      return;
    }

    const selectedDriver = drivers.find(d => d.id === driverId);

    const newOrder: CollectionOrder = {
      id: orderToEdit ? orderToEdit.id : uuidv4(),
      sender,
      recipient,
      originCity,
      originState,
      destinationCity,
      destinationState,
      receiver,
      volumes,
      weight,
      measurements,
      cubicMeasurement,
      merchandiseValue,
      driverId: driverId !== "none" ? driverId : undefined,
      driverName: selectedDriver?.name,
      licensePlate: selectedDriver?.licensePlate,
      companyLogo,
      createdAt: orderToEdit ? orderToEdit.createdAt : new Date().toISOString(),
      userId: user.id
    };

    onSave(newOrder);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CompanyLogoSection 
        companyLogo={companyLogo} 
        handleLogoUpload={handleLogoUpload} 
      />
      
      <SenderRecipientSection 
        sender={sender}
        setSender={setSender}
        recipient={recipient}
        setRecipient={setRecipient}
      />
      
      <LocationsSection 
        originCity={originCity}
        setOriginCity={setOriginCity}
        originState={originState}
        setOriginState={setOriginState}
        destinationCity={destinationCity}
        setDestinationCity={setDestinationCity}
        destinationState={destinationState}
        setDestinationState={setDestinationState}
        receiver={receiver}
        setReceiver={setReceiver}
      />
      
      <CargoSection 
        volumes={volumes}
        setVolumes={setVolumes}
        weight={weight}
        setWeight={setWeight}
        merchandiseValue={merchandiseValue}
        setMerchandiseValue={setMerchandiseValue}
        cubicMeasurement={cubicMeasurement}
      />
      
      <MeasurementsSection 
        measurements={measurements}
        handleAddMeasurement={handleAddMeasurement}
        handleRemoveMeasurement={handleRemoveMeasurement}
        handleMeasurementChange={handleMeasurementChange}
      />
      
      <DriverSection 
        driverId={driverId}
        drivers={drivers}
        setDriverId={setDriverId}
      />
      
      <FormActions 
        onCancel={onCancel}
        isEditing={Boolean(orderToEdit)}
        submitLabel={orderToEdit ? "Atualizar Ordem" : "Cadastrar Ordem"}
      />
    </form>
  );
};

export default CollectionOrderForm;
