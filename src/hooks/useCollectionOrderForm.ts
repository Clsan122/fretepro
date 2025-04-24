
import { useState, useEffect } from "react";
import { CollectionOrder, Driver, Client } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getDriversByUserId, getClientsByUserId } from "@/utils/storage";
import { useCargoForm } from "./collection-order/useCargoForm";
import { usePartiesForm } from "./collection-order/usePartiesForm";
import { useAdditionalInfoForm } from "./collection-order/useAdditionalInfoForm";

interface UseCollectionOrderFormProps {
  orderToEdit?: CollectionOrder;
}

export const useCollectionOrderForm = ({ orderToEdit }: UseCollectionOrderFormProps) => {
  const { user } = useAuth();
  
  // Load external data
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  // Initialize sub-forms
  const cargoForm = useCargoForm(orderToEdit);
  const partiesForm = usePartiesForm(orderToEdit);
  const additionalInfoForm = useAdditionalInfoForm(orderToEdit);

  // Load drivers and clients on mount
  useEffect(() => {
    if (user) {
      const userDrivers = getDriversByUserId(user.id);
      setDrivers(userDrivers);
      
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);

      // Set default sender as user's company if creating new order
      if (!orderToEdit && partiesForm.selectedSenderType === 'my-company') {
        partiesForm.setSender(user.companyName || '');
        partiesForm.setSenderAddress(user.address || '');
      }
    }
  }, [user, partiesForm.selectedSenderType]);

  return {
    formData: {
      ...cargoForm,
      ...partiesForm,
      ...additionalInfoForm,
      drivers,
      clients
    },
    setters: {
      ...cargoForm.handlers,
      ...partiesForm.handlers,
      setDriverId: additionalInfoForm.setDriverId
    }
  };
};
