
import { useState, useEffect } from "react";
import { CollectionOrder, Driver, Client } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getDriversByUserId, getClientsByUserId } from "@/utils/storage";

export const useAdditionalInfoState = (orderToEdit?: CollectionOrder) => {
  const { user } = useAuth();
  const [invoiceNumber, setInvoiceNumber] = useState(orderToEdit?.invoiceNumber || "");
  const [observations, setObservations] = useState(orderToEdit?.observations || "");
  const [driverId, setDriverId] = useState<string>(orderToEdit?.driverId || "none");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [companyLogo, setCompanyLogo] = useState<string>(orderToEdit?.companyLogo || "");
  const [selectedIssuerId, setSelectedIssuerId] = useState<string>(
    orderToEdit?.issuerId || (user ? user.id : '')
  );
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedSenderId, setSelectedSenderId] = useState<string>(
    orderToEdit?.issuerId || (user ? user.id : 'none')
  );

  useEffect(() => {
    if (user) {
      const userDrivers = getDriversByUserId(user.id);
      setDrivers(userDrivers);
      
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);
    }
  }, [user]);

  const handleSenderClientChange = (clientId: string) => {
    setSelectedSenderId(clientId);
  };

  return {
    additionalState: {
      invoiceNumber,
      observations,
      driverId,
      drivers,
      companyLogo,
      selectedIssuerId,
      clients,
      selectedSenderId
    },
    additionalSetters: {
      setInvoiceNumber,
      setObservations,
      setDriverId,
      setCompanyLogo,
      setSelectedIssuerId,
      handleSenderClientChange
    }
  };
};
