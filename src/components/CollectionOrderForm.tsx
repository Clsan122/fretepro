
import React from "react";
import { CollectionOrder } from "@/types";
import CollectionOrderFormContainer from "./collectionOrder/CollectionOrderFormContainer";

interface CollectionOrderFormProps {
  onSave: (order: CollectionOrder) => void;
  onCancel: () => void;
  orderToEdit?: CollectionOrder;
}

const CollectionOrderForm: React.FC<CollectionOrderFormProps> = ({ 
  onSave, 
  onCancel, 
  orderToEdit
}) => {
  console.log("CollectionOrderForm - orderToEdit:", orderToEdit);
  
  return (
    <CollectionOrderFormContainer
      onSave={onSave}
      onCancel={onCancel}
      orderToEdit={orderToEdit}
    />
  );
};

export default CollectionOrderForm;
