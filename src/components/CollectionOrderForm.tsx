
import React from "react";
import { CollectionOrder } from "@/types";
import CollectionOrderFormContainer from "./collectionOrder/CollectionOrderFormContainer";

interface CollectionOrderFormProps {
  onSave: (order: CollectionOrder) => void;
  onCancel: () => void;
  orderToEdit?: CollectionOrder;
  initialData?: Partial<CollectionOrder>;
}

const CollectionOrderForm: React.FC<CollectionOrderFormProps> = ({ 
  onSave, 
  onCancel, 
  orderToEdit,
  initialData 
}) => {
  // Pré-configurar os dados iniciais para separar corretamente transportadora e remetente
  // Se já existirem dados, preservar; caso contrário, usar defaults
  const preparedInitialData = {
    ...initialData,
    // Garantir que o remetente seja diferente da transportadora se não foi definido
    shipper: initialData?.shipper || '',
    shipperAddress: initialData?.shipperAddress || ''
  };

  return (
    <CollectionOrderFormContainer
      onSave={onSave}
      onCancel={onCancel}
      orderToEdit={orderToEdit}
      initialData={preparedInitialData}
    />
  );
};

export default CollectionOrderForm;
