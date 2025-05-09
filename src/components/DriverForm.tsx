import React from "react";
import { Driver } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PersonalInfoSection } from "./driver/PersonalInfoSection";
import { VehicleInfoSection } from "./driver/VehicleInfoSection";
import { useDriverForm } from "./driver/hooks/useDriverForm";
interface DriverFormProps {
  onSave: (driver: Driver) => void;
  onCancel: () => void;
  driverToEdit?: Driver;
  isStandalone?: boolean;
}
const DriverForm: React.FC<DriverFormProps> = ({
  onSave,
  onCancel,
  driverToEdit,
  isStandalone = false
}) => {
  const {
    formData,
    handlers
  } = useDriverForm(driverToEdit);
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cadastrar um motorista!",
        variant: "destructive"
      });
      return;
    }
    const {
      name,
      cpf,
      phone,
      address,
      licensePlate,
      trailerPlate,
      vehicleType,
      bodyType,
      anttCode,
      vehicleYear,
      vehicleModel
    } = formData;
    if (!name || !cpf || !licensePlate || !vehicleType || !bodyType || !phone || !anttCode || !vehicleYear || !vehicleModel) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios!",
        variant: "destructive"
      });
      return;
    }
    const newDriver: Driver = {
      id: driverToEdit ? driverToEdit.id : uuidv4(),
      name,
      cpf,
      licensePlate,
      trailerPlate: trailerPlate || undefined,
      vehicleType: vehicleType as any,
      bodyType: bodyType as any,
      address: address || undefined,
      phone,
      anttCode,
      vehicleYear,
      vehicleModel,
      createdAt: driverToEdit ? driverToEdit.createdAt : new Date().toISOString(),
      userId: user.id
    };
    onSave(newDriver);
  };
  return <div className="w-full max-w-4xl mx-auto">
      {isStandalone && <div className="flex items-center mb-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">
            {driverToEdit ? "Editar Motorista" : "Cadastrar Motorista"}
          </h1>
        </div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <PersonalInfoSection name={formData.name} cpf={formData.cpf} phone={formData.phone} address={formData.address} onNameChange={handlers.setName} onCPFChange={handlers.handleCPFChange} onPhoneChange={handlers.handlePhoneChange} onAddressChange={handlers.setAddress} />

        <VehicleInfoSection licensePlate={formData.licensePlate} trailerPlate={formData.trailerPlate} vehicleType={formData.vehicleType} bodyType={formData.bodyType} anttCode={formData.anttCode} vehicleYear={formData.vehicleYear} vehicleModel={formData.vehicleModel} onLicensePlateChange={handlers.handleLicensePlateChange} onTrailerPlateChange={handlers.handleTrailerPlateChange} onVehicleTypeChange={handlers.setVehicleType} onBodyTypeChange={handlers.setBodyType} onAnttCodeChange={handlers.setAnttCode} onVehicleYearChange={handlers.setVehicleYear} onVehicleModelChange={handlers.setVehicleModel} />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="font-normal px-[6px]">
            Cancelar
          </Button>
          <Button type="submit" className="bg-freight-600 hover:bg-freight-700">
            {driverToEdit ? "Atualizar Motorista" : "Cadastrar Motorista"}
          </Button>
        </div>
      </form>
    </div>;
};
export default DriverForm;