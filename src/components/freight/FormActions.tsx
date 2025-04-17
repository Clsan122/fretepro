
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  submitLabel?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isEditing,
  submitLabel
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
        Cancelar
      </Button>
      <Button type="submit" className="bg-freight-600 hover:bg-freight-700 w-full sm:w-auto">
        {submitLabel || (isEditing ? "Atualizar Frete" : "Cadastrar Frete")}
      </Button>
    </div>
  );
};
