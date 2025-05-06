
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel?: () => void;
  onConvertToOrder: () => void;
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onConvertToOrder,
  isSubmitting,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 mb-10 sm:mb-0">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto order-3 sm:order-1">
          Cancelar
        </Button>
      )}
      
      <Button 
        type="button" 
        variant="secondary"
        onClick={onConvertToOrder}
        className="w-full sm:w-auto order-2"
      >
        Converter em Ordem
      </Button>
      
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full sm:w-auto order-1 sm:order-3 bg-purple-600 hover:bg-purple-700"
      >
        {isSubmitting ? "Salvando..." : "Salvar Cotação"}
      </Button>
    </div>
  );
};

export default FormActions;
