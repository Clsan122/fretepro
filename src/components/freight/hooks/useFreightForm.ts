
import { useState, useEffect } from "react";
import { Freight, Client, Driver } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getClientsByUserId, getDriversByUserId } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface UseFreightFormProps {
  onSave: (freight: Freight) => void;
  freightToEdit?: Freight;
}

export const useFreightForm = ({ onSave, freightToEdit }: UseFreightFormProps) => {
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
  const [driverId, setDriverId] = useState<string>("none");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [pixKey, setPixKey] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  const [requesterName, setRequesterName] = useState(freightToEdit?.requesterName || "");
  
  const [thirdPartyDriverCost, setThirdPartyDriverCost] = useState<number>(0);
  const [tollExpenses, setTollExpenses] = useState<number>(0);
  const [fuelExpenses, setFuelExpenses] = useState<number>(0);
  const [mealExpenses, setMealExpenses] = useState<number>(0);
  const [helperExpenses, setHelperExpenses] = useState<number>(0);
  const [accommodationExpenses, setAccommodationExpenses] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [netProfit, setNetProfit] = useState<number>(0);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setClients(getClientsByUserId(user.id));
      setDrivers(getDriversByUserId(user.id));
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
      setVolumes(freightToEdit.volumes || 0);
      setWeight(freightToEdit.weight || 0);
      setDimensions(freightToEdit.dimensions || "");
      setCubicMeasurement(freightToEdit.cubicMeasurement || 0);
      setCargoType(freightToEdit.cargoType);
      setVehicleType(freightToEdit.vehicleType || "");
      setFreightValue(freightToEdit.freightValue);
      setDailyRate(freightToEdit.dailyRate);
      setOtherCosts(freightToEdit.otherCosts);
      setTollCosts(freightToEdit.tollCosts);
      setTotalValue(freightToEdit.totalValue);
      setProofImage(freightToEdit.proofOfDeliveryImage || "");
      setPixKey(freightToEdit.pixKey || "");
      setPaymentTerm(freightToEdit.paymentTerm || "");
      setDriverId(freightToEdit.driverId || "none");
      setThirdPartyDriverCost(freightToEdit.thirdPartyDriverCost || 0);
      setTollExpenses(freightToEdit.tollExpenses || 0);
      setFuelExpenses(freightToEdit.fuelExpenses || 0);
      setMealExpenses(freightToEdit.mealExpenses || 0);
      setHelperExpenses(freightToEdit.helperExpenses || 0);
      setAccommodationExpenses(freightToEdit.accommodationExpenses || 0);
      setTotalExpenses(freightToEdit.totalExpenses || 0);
      setNetProfit(freightToEdit.netProfit || 0);
    }
  }, [freightToEdit]);

  useEffect(() => {
    const total = freightValue + dailyRate + otherCosts + tollCosts;
    setTotalValue(total);
  }, [freightValue, dailyRate, otherCosts, tollCosts]);

  useEffect(() => {
    const expenses = thirdPartyDriverCost + tollExpenses + fuelExpenses + 
                     mealExpenses + helperExpenses + accommodationExpenses;
    setTotalExpenses(expenses);
    setNetProfit(totalValue - expenses);
  }, [
    thirdPartyDriverCost, 
    tollExpenses, 
    fuelExpenses, 
    mealExpenses, 
    helperExpenses, 
    accommodationExpenses,
    totalValue
  ]);

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

  const validateForm = () => {
    if (!clientId || !originCity || !originState || !destinationCity || !destinationState || !cargoType || !vehicleType) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios!",
        variant: "destructive",
      });
      return false;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cadastrar um frete!",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

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
      cargoType,
      vehicleType,
      freightValue,
      dailyRate,
      otherCosts,
      tollCosts,
      totalValue,
      proofOfDeliveryImage: proofImage,
      createdAt: freightToEdit ? freightToEdit.createdAt : new Date().toISOString(),
      userId: user!.id,
      pixKey,
      paymentTerm,
      driverId: driverId !== "none" ? driverId : undefined,
      thirdPartyDriverCost,
      tollExpenses,
      fuelExpenses,
      mealExpenses,
      helperExpenses,
      accommodationExpenses,
      totalExpenses,
      netProfit,
      requesterName,
      distance: 0,
      price: freightValue,
      status: 'pending',
      paymentStatus: 'pending',
      expenses: []
    };

    onSave(newFreight);
  };

  return {
    formState: {
      clientId,
      originCity,
      originState,
      departureDate,
      destinationCity,
      destinationState,
      arrivalDate,
      volumes,
      weight,
      dimensions,
      cubicMeasurement,
      cargoType,
      vehicleType,
      freightValue,
      dailyRate,
      otherCosts,
      tollCosts,
      totalValue,
      proofImage,
      clients,
      driverId,
      drivers,
      pixKey,
      paymentTerm,
      requesterName,
      thirdPartyDriverCost,
      tollExpenses,
      fuelExpenses,
      mealExpenses,
      helperExpenses,
      accommodationExpenses,
      totalExpenses,
      netProfit
    },
    setters: {
      setClientId,
      setOriginCity,
      setOriginState,
      setDepartureDate,
      setDestinationCity,
      setDestinationState,
      setArrivalDate,
      setVolumes,
      setWeight,
      setDimensions,
      setCubicMeasurement,
      setCargoType,
      setVehicleType,
      setFreightValue,
      setDailyRate,
      setOtherCosts,
      setTollCosts,
      setDriverId,
      setPixKey,
      setPaymentTerm,
      setRequesterName,
      setThirdPartyDriverCost,
      setTollExpenses,
      setFuelExpenses,
      setMealExpenses,
      setHelperExpenses,
      setAccommodationExpenses
    },
    handleImageUpload,
    handleSubmit
  };
};
