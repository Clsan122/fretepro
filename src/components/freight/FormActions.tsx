
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isEditing
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" className="bg-freight-600 hover:bg-freight-700">
        {isEditing ? "Atualizar Frete" : "Cadastrar Frete"}
      </Button>
    </div>
  );
};
