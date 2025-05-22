
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  submitLabel?: string;
  isSubmitting?: boolean; // Added isSubmitting prop
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isEditing,
  submitLabel,
  isSubmitting = false // Default to false if not provided
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="w-full sm:w-auto"
        disabled={isSubmitting} // Disable the cancel button when submitting
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        className="bg-gradient-to-br from-freight-500 via-freight-700 to-freight-800 text-white shadow-lg hover:from-freight-600 hover:to-freight-900 w-full sm:w-auto transition-all duration-200"
        disabled={isSubmitting} // Disable the submit button when submitting
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
            {submitLabel ? 'Enviando...' : (isEditing ? 'Atualizando...' : 'Cadastrando...')}
          </span>
        ) : (
          submitLabel || (isEditing ? "Atualizar Frete" : "Cadastrar Frete")
        )}
      </Button>
    </div>
  );
};
