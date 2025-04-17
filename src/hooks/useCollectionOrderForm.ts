
import { useState, useEffect } from "react";
import { CollectionOrder, Driver, Measurement } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getDriversByUserId } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";

interface UseCollectionOrderFormProps {
  orderToEdit?: CollectionOrder;
}

export const useCollectionOrderForm = ({ orderToEdit }: UseCollectionOrderFormProps) => {
  const { user } = useAuth();
  
  const [sender, setSender] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [originState, setOriginState] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [destinationState, setDestinationState] = useState("");
  const [receiver, setReceiver] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [volumes, setVolumes] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [measurements, setMeasurements] = useState<Measurement[]>([
    { id: uuidv4(), length: 0, width: 0, height: 0, quantity: 1 }
  ]);
  const [cubicMeasurement, setCubicMeasurement] = useState<number>(0);
  const [merchandiseValue, setMerchandiseValue] = useState<number>(0);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [observations, setObservations] = useState("");
  const [driverId, setDriverId] = useState<string>("none");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [selectedIssuerId, setSelectedIssuerId] = useState<string>(
    orderToEdit?.issuerId || (user ? user.id : '')
  );

  // Load drivers on mount
  useEffect(() => {
    if (user) {
      setDrivers(getDriversByUserId(user.id));
    }
  }, [user]);

  // Load order data when editing
  useEffect(() => {
    if (orderToEdit) {
      setSender(orderToEdit.sender);
      setSenderAddress(orderToEdit.senderAddress || "");
      setRecipient(orderToEdit.recipient);
      setRecipientAddress(orderToEdit.recipientAddress || "");
      setOriginCity(orderToEdit.originCity);
      setOriginState(orderToEdit.originState);
      setDestinationCity(orderToEdit.destinationCity);
      setDestinationState(orderToEdit.destinationState);
      setReceiver(orderToEdit.receiver);
      setReceiverAddress(orderToEdit.receiverAddress);
      setVolumes(orderToEdit.volumes);
      setWeight(orderToEdit.weight);
      setMeasurements(orderToEdit.measurements);
      setCubicMeasurement(orderToEdit.cubicMeasurement);
      setMerchandiseValue(orderToEdit.merchandiseValue);
      setInvoiceNumber(orderToEdit.invoiceNumber || "");
      setObservations(orderToEdit.observations || "");
      setDriverId(orderToEdit.driverId || "none");
      setCompanyLogo(orderToEdit.companyLogo || "");
      setSelectedIssuerId(orderToEdit.issuerId || (user ? user.id : ''));
    }
  }, [orderToEdit, user]);

  // Update cubic measurement when measurements change
  useEffect(() => {
    const totalCubic = measurements.reduce((sum, item) => {
      const itemCubic = (item.length * item.width * item.height * item.quantity) / 1000000;
      return sum + itemCubic;
    }, 0);
    
    setCubicMeasurement(totalCubic);
  }, [measurements]);

  const handleMeasurementChange = (id: string, field: keyof Measurement, value: number) => {
    setMeasurements(measurements.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

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
      setMerchandiseValue,
      setInvoiceNumber,
      setObservations,
      setDriverId,
      setCompanyLogo,
      setSelectedIssuerId,
    },
    measurementHandlers: {
      handleMeasurementChange,
      handleAddMeasurement,
      handleRemoveMeasurement,
    }
  };
};
