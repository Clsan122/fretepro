import React, { useState, useEffect } from "react";
import { Driver } from "@/types";
import { VEHICLE_TYPES, BODY_TYPES } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatBrazilianPhone, formatCPF } from "@/utils/formatters";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [trailerPlate, setTrailerPlate] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [anttCode, setAnttCode] = useState(driverToEdit?.anttCode || "");
  const [vehicleYear, setVehicleYear] = useState(driverToEdit?.vehicleYear || "");
  const [vehicleModel, setVehicleModel] = useState(driverToEdit?.vehicleModel || "");

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (driverToEdit) {
      setName(driverToEdit.name);
      setCpf(driverToEdit.cpf);
      setLicensePlate(driverToEdit.licensePlate);
      setTrailerPlate(driverToEdit.trailerPlate || "");
      setVehicleType(driverToEdit.vehicleType);
      setBodyType(driverToEdit.bodyType);
      setAddress(driverToEdit.address || "");
      setPhone(driverToEdit.phone || "");
      setAnttCode(driverToEdit.anttCode || "");
      setVehicleYear(driverToEdit.vehicleYear || "");
      setVehicleModel(driverToEdit.vehicleModel || "");
    }
  }, [driverToEdit]);

  const formatLicensePlate = (value: string) => {
    const plateText = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (plateText.length <= 3) return plateText;
    
    if (plateText.length > 3) return `${plateText.slice(0, 3)}-${plateText.slice(3, 7)}`;
    
    return plateText;
  };

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPlate = formatLicensePlate(e.target.value);
    setLicensePlate(formattedPlate);
  };

  const handleTrailerPlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPlate = formatLicensePlate(e.target.value);
    setTrailerPlate(formattedPlate);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cpfValue = e.target.value.replace(/\D/g, '');
    setCpf(cpfValue);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value.replace(/\D/g, '');
    const formattedPhone = formatBrazilianPhone(phoneValue);
    setPhone(formattedPhone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !cpf || !licensePlate || !vehicleType || !bodyType || !phone || !anttCode || !vehicleYear || !vehicleModel) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios!",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cadastrar um motorista!",
        variant: "destructive",
      });
      return;
    }

    const newDriver: Driver = {
      id: driverToEdit ? driverToEdit.id : uuidv4(),
      name,
      cpf: formatCPF(cpf),
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {isStandalone && (
        <div className="flex items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">
            {driverToEdit ? "Editar Motorista" : "Cadastrar Motorista"}
          </h1>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Motorista</CardTitle>
            <CardDescription>Informe os dados do motorista</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo do motorista"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={handleCPFChange}
                  placeholder="Apenas números"
                  inputMode="numeric"
                  maxLength={11}
                />
                {cpf && (
                  <p className="text-xs text-muted-foreground">
                    Formato: {formatCPF(cpf)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(XX) XXXXX-XXXX"
                  required
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço (Opcional)</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Endereço completo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Veículo</CardTitle>
            <CardDescription>Informe os dados do veículo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">Placa do Veículo</Label>
                <Input
                  id="licensePlate"
                  value={licensePlate}
                  onChange={handleLicensePlateChange}
                  placeholder="Placa do veículo"
                  maxLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trailerPlate">Placa da Carreta (Opcional)</Label>
                <Input
                  id="trailerPlate"
                  value={trailerPlate}
                  onChange={handleTrailerPlateChange}
                  placeholder="Placa da carreta (se aplicável)"
                  maxLength={8}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Tipo de Veículo</Label>
                  <Select
                    value={vehicleType}
                    onValueChange={(value) => setVehicleType(value)}
                  >
                    <SelectTrigger id="vehicleType">
                      <SelectValue placeholder="Selecione o tipo de veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyType">Tipo de Carroceria</Label>
                  <Select
                    value={bodyType}
                    onValueChange={(value) => setBodyType(value)}
                  >
                    <SelectTrigger id="bodyType">
                      <SelectValue placeholder="Selecione o tipo de carroceria" />
                    </SelectTrigger>
                    <SelectContent>
                      {BODY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="anttCode">Código ANTT</Label>
                <Input
                  id="anttCode"
                  value={anttCode}
                  onChange={(e) => setAnttCode(e.target.value)}
                  placeholder="Digite o código ANTT"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear">Ano do Veículo</Label>
                  <Input
                    id="vehicleYear"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    placeholder="Ano do veículo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Modelo do Veículo</Label>
                  <Input
                    id="vehicleModel"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="Modelo do veículo"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-freight-600 hover:bg-freight-700">
            {driverToEdit ? "Atualizar Motorista" : "Cadastrar Motorista"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DriverForm;
