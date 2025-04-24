
import { useState, useEffect } from "react";
import { CollectionOrder, Driver, Measurement, Client } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getDriversByUserId, getClientsByUserId } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";

interface UseCollectionOrderFormProps {
  orderToEdit?: CollectionOrder;
}

export const useCollectionOrderForm = ({ orderToEdit }: UseCollectionOrderFormProps) => {
  const { user } = useAuth();
  
  // Informações básicas
  const [sender, setSender] = useState(orderToEdit?.sender || "");
  const [senderAddress, setSenderAddress] = useState(orderToEdit?.senderAddress || "");
  const [recipient, setRecipient] = useState(orderToEdit?.recipient || "");
  const [recipientAddress, setRecipientAddress] = useState(orderToEdit?.recipientAddress || "");
  const [originCity, setOriginCity] = useState(orderToEdit?.originCity || "");
  const [originState, setOriginState] = useState(orderToEdit?.originState || "");
  const [destinationCity, setDestinationCity] = useState(orderToEdit?.destinationCity || "");
  const [destinationState, setDestinationState] = useState(orderToEdit?.destinationState || "");
  const [receiver, setReceiver] = useState(orderToEdit?.receiver || "");
  const [receiverAddress, setReceiverAddress] = useState(orderToEdit?.receiverAddress || "");
  
  // Informações da carga
  const [volumes, setVolumes] = useState<number>(orderToEdit?.volumes || 0);
  const [weight, setWeight] = useState<number>(orderToEdit?.weight || 0);
  const [measurements, setMeasurements] = useState<Measurement[]>(
    orderToEdit?.measurements || [
      { id: uuidv4(), length: 0, width: 0, height: 0, quantity: 1 }
    ]
  );
  const [cubicMeasurement, setCubicMeasurement] = useState<number>(orderToEdit?.cubicMeasurement || 0);
  const [merchandiseValue, setMerchandiseValue] = useState<number>(orderToEdit?.merchandiseValue || 0);
  
  // Informações adicionais
  const [invoiceNumber, setInvoiceNumber] = useState(orderToEdit?.invoiceNumber || "");
  const [observations, setObservations] = useState(orderToEdit?.observations || "");
  const [driverId, setDriverId] = useState<string>(orderToEdit?.driverId || "none");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [companyLogo, setCompanyLogo] = useState<string>(orderToEdit?.companyLogo || "");
  const [selectedIssuerId, setSelectedIssuerId] = useState<string>(
    orderToEdit?.issuerId || (user ? user.id : '')
  );
  const [clients, setClients] = useState<Client[]>([]);

  // Load drivers and clients on mount
  useEffect(() => {
    if (user) {
      const userDrivers = getDriversByUserId(user.id);
      setDrivers(userDrivers);
      
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);
    }
  }, [user]);

  // Update cubic measurement when measurements change
  useEffect(() => {
    const totalCubic = measurements.reduce((sum, item) => {
      const itemCubic = (item.length * item.width * item.height * item.quantity) / 1000000;
      return sum + itemCubic;
    }, 0);
    
    setCubicMeasurement(totalCubic);
  }, [measurements]);

  const handleMeasurementChange = (id: string, field: keyof Measurement, value: number) => {
    setMeasurements(
      measurements.map(measurement =>
        measurement.id === id ? { ...measurement, [field]: value } : measurement
      )
    );
  };

  const handleAddMeasurement = () => {
    const newMeasurement: Measurement = {
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

  return {
    formData: {
      sender,
      senderAddress,
      recipient,
      recipientAddress,
      originCity,
      originState,
      destinationCity,
      destinationState,
      receiver,
      receiverAddress,
      volumes,
      weight,
      measurements,
      cubicMeasurement,
      merchandiseValue,
      invoiceNumber,
      observations,
      driverId,
      drivers,
      companyLogo,
      selectedIssuerId,
      clients
    },
    setters: {
      setSender,
      setSenderAddress,
      setRecipient,
      setRecipientAddress,
      setOriginCity,
      setOriginState,
      setDestinationCity,
      setDestinationState,
      setReceiver,
      setReceiverAddress,
      setVolumes,
      setWeight,
      setMeasurements,
      setCubicMeasurement,
      setMerchandiseValue,
      setInvoiceNumber,
      setObservations,
      setDriverId,
      setCompanyLogo,
      setSelectedIssuerId
    },
    measurementHandlers: {
      handleMeasurementChange,
      handleAddMeasurement,
      handleRemoveMeasurement
    }
  };
};
