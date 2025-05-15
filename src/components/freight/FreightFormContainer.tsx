
import React from "react";
import { Freight } from "@/types";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFreightForm } from "./hooks/useFreightForm";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

// Import form sections
import { ClientSelectionSection } from "./ClientSelectionSection";
import { DriverSelectionSection } from "./DriverSelectionSection";
import { RouteSection } from "./RouteSection";
import { CargoDetailsSection } from "./CargoDetailsSection";
import { PaymentInfoSection } from "./PaymentInfoSection";
import { PricingSection } from "./PricingSection";
import { ExpensesSection } from "./ExpensesSection";

interface FreightFormContainerProps {
  onSave: (freight: Freight) => void;
  onCancel: () => void;
  freightToEdit?: Freight;
}

const FreightFormContainer: React.FC<FreightFormContainerProps> = ({
  onSave,
  onCancel,
  freightToEdit
}) => {
  const navigate = useNavigate();
  const {
    formState,
    setters,
    handleImageUpload,
    handleSubmit
  } = useFreightForm({ 
    onSave: (freight) => {
      // Chamar o callback onSave e redirecionar para a lista
      onSave(freight);
      // Redirecionar para a lista de fretes após salvar
      navigate('/freights');
    }, 
    freightToEdit 
  });

  const handleGenerateReceipt = () => {
    if (!formState.clientId || !formState.originCity || !formState.originState || !formState.destinationCity || !formState.destinationState) {
      toast({
        title: "Erro",
        description: "Preencha os dados básicos antes de gerar o recibo",
        variant: "destructive",
      });
      return;
    }

    // We can't use formState.id directly because it might not exist yet
    // Instead, use the ID from freightToEdit if available
    const freightId = freightToEdit ? freightToEdit.id : '';
    const receiptWindow = window.open(`/freight/${freightId}/receipt`, '_blank');
    if (receiptWindow) receiptWindow.focus();
  };
  
  const handleGenerateFreightForm = () => {
    if (!formState.clientId || !formState.originCity || !formState.originState || !formState.destinationCity || !formState.destinationState) {
      toast({
        title: "Erro",
        description: "Preencha os dados básicos antes de gerar o formulário",
        variant: "destructive",
      });
      return;
    }

    // We can't use formState.id directly because it might not exist yet
    // Instead, use the ID from freightToEdit if available
    const freightId = freightToEdit ? freightToEdit.id : '';
    const formWindow = window.open(`/freight-form/pdf?id=${freightId}`, '_blank');
    if (formWindow) formWindow.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 p-1 sm:p-2">
      <ClientSelectionSection 
        clientId={formState.clientId} 
        clients={formState.clients} 
        setClientId={setters.setClientId} 
      />

      <DriverSelectionSection 
        driverId={formState.driverId}
        drivers={formState.drivers}
        setDriverId={setters.setDriverId}
      />

      <RouteSection 
        originCity={formState.originCity}
        setOriginCity={setters.setOriginCity}
        originState={formState.originState}
        setOriginState={setters.setOriginState}
        departureDate={formState.departureDate}
        setDepartureDate={setters.setDepartureDate}
        destinationCity={formState.destinationCity}
        setDestinationCity={setters.setDestinationCity}
        destinationState={formState.destinationState}
        setDestinationState={setters.setDestinationState}
        arrivalDate={formState.arrivalDate}
        setArrivalDate={setters.setArrivalDate}
      />

      <CargoDetailsSection 
        volumes={formState.volumes}
        setVolumes={setters.setVolumes}
        weight={formState.weight}
        setWeight={setters.setWeight}
        dimensions={formState.dimensions}
        setDimensions={setters.setDimensions}
        cubicMeasurement={formState.cubicMeasurement}
        setCubicMeasurement={setters.setCubicMeasurement}
        cargoType={formState.cargoType}
        setCargoType={setters.setCargoType}
        vehicleType={formState.vehicleType}
        setVehicleType={setters.setVehicleType}
      />

      <PaymentInfoSection 
        pixKey={formState.pixKey}
        setPixKey={setters.setPixKey}
        paymentTerm={formState.paymentTerm}
        setPaymentTerm={setters.setPaymentTerm}
        requesterName={formState.requesterName}
        setRequesterName={setters.setRequesterName}
      />

      <PricingSection 
        freightValue={formState.freightValue}
        setFreightValue={setters.setFreightValue}
        dailyRate={formState.dailyRate}
        setDailyRate={setters.setDailyRate}
        otherCosts={formState.otherCosts}
        setOtherCosts={setters.setOtherCosts}
        tollCosts={formState.tollCosts}
        setTollCosts={setters.setTollCosts}
        totalValue={formState.totalValue}
      />

      <ExpensesSection 
        thirdPartyDriverCost={formState.thirdPartyDriverCost}
        setThirdPartyDriverCost={setters.setThirdPartyDriverCost}
        tollExpenses={formState.tollExpenses}
        setTollExpenses={setters.setTollExpenses}
        fuelExpenses={formState.fuelExpenses}
        setFuelExpenses={setters.setFuelExpenses}
        mealExpenses={formState.mealExpenses}
        setMealExpenses={setters.setMealExpenses}
        helperExpenses={formState.helperExpenses}
        setHelperExpenses={setters.setHelperExpenses}
        accommodationExpenses={formState.accommodationExpenses}
        setAccommodationExpenses={setters.setAccommodationExpenses}
        totalExpenses={formState.totalExpenses}
        netProfit={formState.netProfit}
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateReceipt}
            className="w-full sm:w-auto text-xs sm:text-sm gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            Gerar Recibo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateFreightForm}
            className="w-full sm:w-auto text-xs sm:text-sm gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            Formulário PDF
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-3 sm:mt-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto text-xs sm:text-sm py-1.5 sm:py-2"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="w-full sm:w-auto text-xs sm:text-sm py-1.5 sm:py-2"
          >
            {freightToEdit ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FreightFormContainer;
