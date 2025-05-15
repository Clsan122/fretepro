
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
  // Garantir que os dados de edição tenham prioridade sobre os dados iniciais
  const preparedInitialData = orderToEdit || {
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
      initialData={initialData}
    />
  );
};

export default CollectionOrderForm;
