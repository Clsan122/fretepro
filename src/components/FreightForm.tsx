import React, { useState, useEffect } from "react";
import { Freight, Client } from "@/types";
import { BRAZILIAN_STATES, CARGO_TYPES, VEHICLE_TYPES } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
import { getClientsByUserId } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

interface FreightFormProps {
  onSave: (freight: Freight) => void;
  onCancel: () => void;
  freightToEdit?: Freight;
}

const PAYMENT_TERMS = [
  { value: "upfront", label: "À vista" },
  { value: "tenDays", label: "10 dias" },
  { value: "fifteenDays", label: "15 dias" },
  { value: "twentyDays", label: "20 dias" },
  { value: "thirtyDays", label: "30 dias" },
  { value: "custom", label: "A combinar" },
];

const FreightForm: React.FC<FreightFormProps> = ({ onSave, onCancel, freightToEdit }) => {
  const [clientId, setClientId] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [originState, setOriginState] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [destinationCity, setDestinationCity] = useState("");
  const [destinationState, setDestinationState] = useState("");
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [volumes, setVolumes] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [dimensions, setDimensions] = useState("");
  const [cubicMeasurement, setCubicMeasurement] = useState<number>(0);
  const [cargoType, setCargoType] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [freightValue, setFreightValue] = useState<number>(0);
  const [dailyRate, setDailyRate] = useState<number>(0);
  const [otherCosts, setOtherCosts] = useState<number>(0);
  const [tollCosts, setTollCosts] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [proofImage, setProofImage] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  
  const [pixKey, setPixKey] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      setClients(getClientsByUserId(user.id));
    }
  }, [user]);

  useEffect(() => {
    if (freightToEdit) {
      setClientId(freightToEdit.clientId);
      setOriginCity(freightToEdit.originCity);
      setOriginState(freightToEdit.originState);
      setDepartureDate(freightToEdit.departureDate ? new Date(freightToEdit.departureDate) : undefined);
      setDestinationCity(freightToEdit.destinationCity);
      setDestinationState(freightToEdit.destinationState);
      setArrivalDate(freightToEdit.arrivalDate ? new Date(freightToEdit.arrivalDate) : undefined);
      setVolumes(freightToEdit.volumes);
      setWeight(freightToEdit.weight);
      setDimensions(freightToEdit.dimensions);
      setCubicMeasurement(freightToEdit.cubicMeasurement);
      setCargoType(freightToEdit.cargoType);
      setVehicleType(freightToEdit.vehicleType);
      setFreightValue(freightToEdit.freightValue);
      setDailyRate(freightToEdit.dailyRate);
      setOtherCosts(freightToEdit.otherCosts);
      setTollCosts(freightToEdit.tollCosts);
      setTotalValue(freightToEdit.totalValue);
      setProofImage(freightToEdit.proofOfDeliveryImage || "");
      setPixKey(freightToEdit.pixKey || "");
      setPaymentTerm(freightToEdit.paymentTerm || "");
    }
  }, [freightToEdit]);

  useEffect(() => {
    const total = freightValue + dailyRate + otherCosts + tollCosts;
    setTotalValue(total);
  }, [freightValue, dailyRate, otherCosts, tollCosts]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || !originCity || !originState || !destinationCity || !destinationState || !cargoType || !vehicleType) {
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
        description: "Você precisa estar logado para cadastrar um frete!",
        variant: "destructive",
      });
      return;
    }

    const newFreight: Freight = {
      id: freightToEdit ? freightToEdit.id : uuidv4(),
      clientId,
      originCity,
      originState,
      departureDate: departureDate ? departureDate.toISOString() : "",
      destinationCity,
      destinationState,
      arrivalDate: arrivalDate ? arrivalDate.toISOString() : "",
      volumes,
      weight,
      dimensions,
      cubicMeasurement,
      cargoType: cargoType as any,
      vehicleType: vehicleType as any,
      freightValue,
      dailyRate,
      otherCosts,
      tollCosts,
      totalValue,
      proofOfDeliveryImage: proofImage,
      createdAt: freightToEdit ? freightToEdit.createdAt : new Date().toISOString(),
      userId: user.id,
      pixKey: pixKey || undefined,
      paymentTerm: paymentTerm ? (paymentTerm as any) : undefined,
    };

    onSave(newFreight);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
          <CardDescription>Selecione o cliente para este frete</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="clientId">Cliente</Label>
            <Select
              value={clientId}
              onValueChange={(value) => setClientId(value)}
            >
              <SelectTrigger id="clientId">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} - {client.city}/{client.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Origem e Destino</CardTitle>
          <CardDescription>Informe os dados da rota</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originCity">Cidade de Origem</Label>
                <Input
                  id="originCity"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  placeholder="Cidade de origem"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originState">Estado de Origem</Label>
                <Select
                  value={originState}
                  onValueChange={(value) => setOriginState(value)}
                >
                  <SelectTrigger id="originState">
                    <SelectValue placeholder="Selecione um estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAZILIAN_STATES.map((state) => (
                      <SelectItem key={`origin-${state.abbreviation}`} value={state.abbreviation}>
                        {state.name} ({state.abbreviation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departureDate">Data de Saída</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !departureDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destinationCity">Cidade de Destino</Label>
                <Input
                  id="destinationCity"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  placeholder="Cidade de destino"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinationState">Estado de Destino</Label>
                <Select
                  value={destinationState}
                  onValueChange={(value) => setDestinationState(value)}
                >
                  <SelectTrigger id="destinationState">
                    <SelectValue placeholder="Selecione um estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAZILIAN_STATES.map((state) => (
                      <SelectItem key={`dest-${state.abbreviation}`} value={state.abbreviation}>
                        {state.name} ({state.abbreviation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrivalDate">Data de Chegada</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !arrivalDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {arrivalDate ? format(arrivalDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={arrivalDate}
                    onSelect={setArrivalDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Carga</CardTitle>
          <CardDescription>Informe as características da carga transportada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="volumes">Volume</Label>
              <Input
                id="volumes"
                type="number"
                value={volumes.toString()}
                onChange={(e) => setVolumes(Number(e.target.value))}
                placeholder="Quantidade de volumes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight.toString()}
                onChange={(e) => setWeight(Number(e.target.value))}
                placeholder="Peso total em kg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensões</Label>
              <Input
                id="dimensions"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="Ex: 100x80x120 cm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cubicMeasurement">Cubagem (m³)</Label>
              <Input
                id="cubicMeasurement"
                type="number"
                step="0.01"
                value={cubicMeasurement.toString()}
                onChange={(e) => setCubicMeasurement(Number(e.target.value))}
                placeholder="Cubagem em metros cúbicos"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="cargoType">Tipo de Carga</Label>
              <Select
                value={cargoType}
                onValueChange={(value) => setCargoType(value)}
              >
                <SelectTrigger id="cargoType">
                  <SelectValue placeholder="Selecione o tipo de carga" />
                </SelectTrigger>
                <SelectContent>
                  {CARGO_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados de Pagamento</CardTitle>
          <CardDescription>Informe os dados para pagamento do frete</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input
                id="pixKey"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Informe sua chave PIX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentTerm">Prazo de Pagamento</Label>
              <Select
                value={paymentTerm}
                onValueChange={(value) => setPaymentTerm(value)}
              >
                <SelectTrigger id="paymentTerm">
                  <SelectValue placeholder="Selecione o prazo" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TERMS.map((term) => (
                    <SelectItem key={term.value} value={term.value}>
                      {term.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Composição do Frete</CardTitle>
          <CardDescription>Informe os valores que compõem o frete</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="freightValue">Valor do Frete (R$)</Label>
              <Input
                id="freightValue"
                type="number"
                step="0.01"
                value={freightValue.toString()}
                onChange={(e) => setFreightValue(Number(e.target.value))}
                placeholder="Valor do frete"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyRate">Diária (R$)</Label>
              <Input
                id="dailyRate"
                type="number"
                step="0.01"
                value={dailyRate.toString()}
                onChange={(e) => setDailyRate(Number(e.target.value))}
                placeholder="Valor de diárias"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherCosts">Outros Custos (R$)</Label>
              <Input
                id="otherCosts"
                type="number"
                step="0.01"
                value={otherCosts.toString()}
                onChange={(e) => setOtherCosts(Number(e.target.value))}
                placeholder="Outros custos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tollCosts">Pedágio (R$)</Label>
              <Input
                id="tollCosts"
                type="number"
                step="0.01"
                value={tollCosts.toString()}
                onChange={(e) => setTollCosts(Number(e.target.value))}
                placeholder="Valor de pedágios"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">R$ {totalValue.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comprovante de Entrega</CardTitle>
          <CardDescription>Envie o comprovante de entrega da carga</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label htmlFor="proofImage">Comprovante de Entrega</Label>
            <Input
              id="proofImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            
            {proofImage && (
              <div className="mt-2">
                <p className="text-sm mb-2">Comprovante carregado:</p>
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={proofImage} 
                    alt="Comprovante de entrega" 
                    className="max-h-64 mx-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-freight-600 hover:bg-freight-700">
          {freightToEdit ? "Atualizar Frete" : "Cadastrar Frete"}
        </Button>
      </div>
    </form>
  );
};

export default FreightForm;
