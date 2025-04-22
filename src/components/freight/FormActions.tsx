
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
    <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="w-full sm:w-auto"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        className="bg-gradient-to-br from-freight-500 via-freight-700 to-freight-800 text-white shadow-lg hover:from-freight-600 hover:to-freight-900 w-full sm:w-auto transition-all duration-200"
      >
        {submitLabel || (isEditing ? "Atualizar Frete" : "Cadastrar Frete")}
      </Button>
    </div>
  );
};
