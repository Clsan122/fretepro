
import React from "react";
import { Freight } from "@/types";
import FreightFormContainer from "./freight/FreightFormContainer";
import { useNavigate } from 'react-router-dom';

interface FreightFormProps {
  onSave: (freight: Freight) => void;
  onCancel: () => void;
  freightToEdit?: Freight;
}

const FreightForm: React.FC<FreightFormProps> = ({
  onSave,
  onCancel,
  freightToEdit
}) => {
  return (
    <FreightFormContainer
      onSave={onSave}
      onCancel={onCancel}
      freightToEdit={freightToEdit}
    />
  );
};

export default FreightForm;
