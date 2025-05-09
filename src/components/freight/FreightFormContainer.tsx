
import React from "react";
import { Freight } from "@/types";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFreightForm } from "./hooks/useFreightForm";
import { toast } from "@/hooks/use-toast";

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
  const {
    formState,
    setters,
    handleImageUpload,
    handleSubmit
  } = useFreightForm({ onSave, freightToEdit });

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
    <form onSubmit={handleSubmit} className="space-y-4 p-1 sm:p-2">
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
            className="w-full sm:w-auto gap-2"
          >
            <FileText className="h-4 w-4" />
            Gerar Recibo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateFreightForm}
            className="w-full sm:w-auto gap-2"
          >
            <Download className="h-4 w-4" />
            Formulário PDF
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            {freightToEdit ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FreightFormContainer;
