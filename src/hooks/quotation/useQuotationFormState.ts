
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { QuotationFormData } from "../useQuotationForm";

export const useQuotationFormState = (initialData?: Partial<QuotationFormData>) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<QuotationFormData>({
    clientId: initialData?.clientId || "",
    
    originCity: initialData?.originCity || "",
    originState: initialData?.originState || "",
    destinationCity: initialData?.destinationCity || "",
    destinationState: initialData?.destinationState || "",
    
    sender: initialData?.sender || "",
    senderAddress: initialData?.senderAddress || "",
    senderCity: initialData?.senderCity || "",
    senderState: initialData?.senderState || "",
    senderCnpj: initialData?.senderCnpj || "",
    
    recipient: initialData?.recipient || "",
    recipientAddress: initialData?.recipientAddress || "",
    
    shipper: initialData?.shipper || "",
    shipperAddress: initialData?.shipperAddress || "",
    
    volumes: initialData?.volumes || 0,
    weight: initialData?.weight || 0,
    length: initialData?.length || 0,
    width: initialData?.width || 0,
    height: initialData?.height || 0,
    merchandiseValue: initialData?.merchandiseValue || 0,
    
    observations: initialData?.observations || "",
    vehicleType: initialData?.vehicleType || "",
    
    quotedValue: initialData?.quotedValue || 0,
    
    driverId: initialData?.driverId || undefined
  });

  // Set default sender info if creating new quotation and user has company data
  useEffect(() => {
    if (!initialData?.sender && user?.companyName) {
      setFormData(prev => ({
        ...prev,
        sender: user.companyName || '',
        senderAddress: user.address || '',
        senderCity: user.city || '',
        senderState: user.state || '',
        senderCnpj: user.cnpj || ''
      }));
    }
  }, [user, initialData]);

  // Function to update any field in the form
  const updateField = (field: keyof QuotationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    formData,
    updateField
  };
};
