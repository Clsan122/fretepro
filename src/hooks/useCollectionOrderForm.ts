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
  
  // Sender information
  const [sender, setSender] = useState(orderToEdit?.sender || "");
  const [senderAddress, setSenderAddress] = useState(orderToEdit?.senderAddress || "");
  const [senderCity, setSenderCity] = useState(orderToEdit?.senderCity || orderToEdit?.originCity || "");
  const [senderState, setSenderState] = useState(orderToEdit?.senderState || orderToEdit?.originState || "");
  
  // Recipient information
  const [recipient, setRecipient] = useState(orderToEdit?.recipient || "");
  const [recipientAddress, setRecipientAddress] = useState(orderToEdit?.recipientAddress || "");
  const [recipientCity, setRecipientCity] = useState(orderToEdit?.recipientCity || orderToEdit?.destinationCity || "");
  const [recipientState, setRecipientState] = useState(orderToEdit?.recipientState || orderToEdit?.destinationState || "");
  
  // Shipper information
  const [shipper, setShipper] = useState(orderToEdit?.shipper || "");
  const [shipperAddress, setShipperAddress] = useState(orderToEdit?.shipperAddress || "");
  const [shipperCity, setShipperCity] = useState(orderToEdit?.shipperCity || "");
  const [shipperState, setShipperState] = useState(orderToEdit?.shipperState || "");
  
  // Receiver information
  const [receiver, setReceiver] = useState(orderToEdit?.receiver || "");
  const [receiverAddress, setReceiverAddress] = useState(orderToEdit?.receiverAddress || "");
  const [receiverCity, setReceiverCity] = useState(orderToEdit?.receiverCity || "");
  const [receiverState, setReceiverState] = useState(orderToEdit?.receiverState || "");
  
  // Cargo information
  const [volumes, setVolumes] = useState<number>(orderToEdit?.volumes || 0);
  const [weight, setWeight] = useState<number>(orderToEdit?.weight || 0);
  const [measurements, setMeasurements] = useState<Measurement[]>(
    orderToEdit?.measurements || [
      { id: uuidv4(), length: 0, width: 0, height: 0, quantity: 1 }
    ]
  );
  const [cubicMeasurement, setCubicMeasurement] = useState<number>(orderToEdit?.cubicMeasurement || 0);
  const [merchandiseValue, setMerchandiseValue] = useState<number>(orderToEdit?.merchandiseValue || 0);
  
  // Additional information
  const [invoiceNumber, setInvoiceNumber] = useState(orderToEdit?.invoiceNumber || "");
  const [observations, setObservations] = useState(orderToEdit?.observations || "");
  const [driverId, setDriverId] = useState<string>(orderToEdit?.driverId || "none");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  // Issuer information
  const [selectedIssuerId, setSelectedIssuerId] = useState<string>(
    orderToEdit?.issuerId || (user ? user.id : '')
  );
  const [issuerType, setIssuerType] = useState<'my-company' | 'client'>(
    orderToEdit?.issuerId === user?.id ? 'my-company' : 'client'
  );
  
  // Client selection
  const [selectedSenderId, setSelectedSenderId] = useState<string>('none');

  // Load drivers and clients on mount
  useEffect(() => {
    if (user) {
      const userDrivers = getDriversByUserId(user.id);
      setDrivers(userDrivers);
      
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);

      // Set default sender as user's company if creating new order
      if (!orderToEdit && issuerType === 'my-company') {
        setSender(user.companyName || '');
        setSenderAddress(user.address || '');
        setSenderCity(user.city || '');
        setSenderState(user.state || '');
      }
    }
  }, [user, issuerType]);

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

  const handleSenderTypeChange = (type: 'my-company' | 'client') => {
    setIssuerType(type);
    if (type === 'my-company' && user) {
      setSelectedIssuerId(user.id);
    } else {
      setSelectedIssuerId('none');
    }
  };

  const handleSenderClientChange = (clientId: string) => {
    if (clientId === 'none') {
      setSender('');
      setSenderAddress('');
      setSenderCity('');
      setSenderState('');
      return;
    }

    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setSender(selectedClient.name);
      setSenderAddress(selectedClient.address || '');
      setSenderCity(selectedClient.city || '');
      setSenderState(selectedClient.state || '');
      setSelectedSenderId(clientId);
    }
  };

  return {
    formData: {
      sender,
      senderAddress,
      senderCity,
      senderState,
      
      recipient,
      recipientAddress,
      recipientCity,
      recipientState,
      
      shipper,
      shipperAddress,
      shipperCity,
      shipperState,
      
      receiver,
      receiverAddress,
      receiverCity,
      receiverState,
      
      volumes,
      weight,
      measurements,
      cubicMeasurement,
      merchandiseValue,
      
      invoiceNumber,
      observations,
      driverId,
      drivers,
      
      selectedIssuerId,
      issuerType,
      selectedSenderId,
      clients,
    },
    setters: {
      setSender,
      setSenderAddress,
      setSenderCity,
      setSenderState,
      
      setRecipient,
      setRecipientAddress,
      setRecipientCity,
      setRecipientState,
      
      setShipper,
      setShipperAddress,
      setShipperCity,
      setShipperState,
      
      setReceiver,
      setReceiverAddress,
      setReceiverCity,
      setReceiverState,
      
      setVolumes,
      setWeight,
      setMeasurements,
      setCubicMeasurement,
      setMerchandiseValue,
      
      setInvoiceNumber,
      setObservations,
      setDriverId,
      
      setSelectedIssuerId,
      setIssuerType,
      handleSenderTypeChange,
      handleSenderClientChange,
    },
    measurementHandlers: {
      handleMeasurementChange,
      handleAddMeasurement,
      handleRemoveMeasurement
    }
  };
};
