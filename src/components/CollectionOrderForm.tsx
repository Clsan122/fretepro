
import React from "react";
import { CollectionOrder } from "@/types";
import CollectionOrderFormContainer from "./collectionOrder/CollectionOrderFormContainer";

interface CollectionOrderFormProps {
  onSave: (order: CollectionOrder) => void;
  onCancel: () => void;
  orderToEdit?: CollectionOrder;
  initialData?: Partial<CollectionOrder>;
  isSaving?: boolean;
}

const CollectionOrderForm: React.FC<CollectionOrderFormProps> = ({ 
  onSave, 
  onCancel, 
  orderToEdit,
  initialData,
  isSaving = false
}) => {
  // Garantir que initialData seja sempre um objeto
  const safeInitialData = initialData || {};
  
  // Garantir que measurements seja sempre um array
  if (safeInitialData && !safeInitialData.measurements) {
    safeInitialData.measurements = [];
  }

  return (
    <CollectionOrderFormContainer
      onSave={onSave}
      onCancel={onCancel}
      orderToEdit={orderToEdit}
      initialData={safeInitialData}
      isSaving={isSaving}
    />
  );
};

export default CollectionOrderForm;
