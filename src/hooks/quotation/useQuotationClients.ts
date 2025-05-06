
import { useState, useEffect } from "react";
import { Client } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getClientsByUserId } from "@/utils/storage";

export const useQuotationClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  
  useEffect(() => {
    if (user) {
      const userClients = getClientsByUserId(user.id);
      setClients(userClients);
    }
  }, [user]);

  // Handle client selection
  const handleClientChange = (
    clientId: string,
    updateField: (field: string, value: any) => void
  ) => {
    updateField("clientId", clientId);
    
    // Find client data
    const selectedClient = clients.find(client => client.id === clientId);
    if (selectedClient) {
      updateField("recipient", selectedClient.name);
      updateField("recipientAddress", selectedClient.address || '');
    }
  };

  return {
    clients,
    handleClientChange
  };
};
