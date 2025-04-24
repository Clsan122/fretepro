
import { useState } from "react";

export const useAdditionalInfoForm = (initialData?: {
  invoiceNumber?: string;
  observations?: string;
  driverId?: string;
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState(initialData?.invoiceNumber || "");
  const [observations, setObservations] = useState(initialData?.observations || "");
  const [driverId, setDriverId] = useState<string>(initialData?.driverId || "none");

  return {
    invoiceNumber,
    setInvoiceNumber,
    observations,
    setObservations,
    driverId,
    setDriverId
  };
};
