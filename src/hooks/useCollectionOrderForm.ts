
import { useState, useEffect } from "react";
import { CollectionOrder, Driver, Measurement, Client } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getDriversByUserId, getClientsByUserId, getClientById } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";

interface UseCollectionOrderFormProps {
  orderToEdit?: CollectionOrder;
}

export const useCollectionOrderForm = ({ orderToEdit }: UseCollectionOrderFormProps) => {
  const { user } = useAuth();
  
  const [sender, setSender] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [originState, setOriginState] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [destinationState, setDestinationState] = useState("");
  const [receiver, setReceiver] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [volumes, setVolumes] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [measurements, setMeasurements] = useState<Measurement[]>([
    { id: uuidv4(), length: 0, width: 0, height: 0, quantity: 1 }
  ]);
  const [cubicMeasurement, setCubicMeasurement] = useState<number>(0);
  const [merchandiseValue, setMerchandiseValue] = useState<number>(0);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [observations, setObservations] = useState("");
  const [driverId, setDriverId] = useState<string>("none");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [selectedIssuerId, setSelectedIssuerId] = useState<string>(
    orderToEdit?.issuerId || (user ? user.id : '')
  );
  const [clients, setClients] = useState<Client[]>([]);

  // Load drivers and clients on mount
  useEffect(() => {
    if (user) {
      setDrivers(getDriversByUserId(user.id));
      setClients(getClientsByUserId(user.id));
    }
  }, [user]);

  // Load order data when editing
  useEffect(() => {
    if (orderToEdit) {
      setSender(orderToEdit.sender);
      setSenderAddress(orderToEdit.senderAddress || "");
      setRecipient(orderToEdit.recipient);
      setRecipientAddress(orderToEdit.recipientAddress || "");
      setOriginCity(orderToEdit.originCity);
      setOriginState(orderToEdit.originState);
      setDestinationCity(orderToEdit.destinationCity);
      setDestinationState(orderToEdit.destinationState);
      setReceiver(orderToEdit.receiver);
      setReceiverAddress(orderToEdit.receiverAddress);
      setVolumes(orderToEdit.volumes);
      setWeight(orderToEdit.weight);
      setMeasurements(orderToEdit.measurements);
      setCubicMeasurement(orderToEdit.cubicMeasurement);
      setMerchandiseValue(orderToEdit.merchandiseValue);
      setInvoiceNumber(orderToEdit.invoiceNumber || "");
      setObservations(orderToEdit.observations || "");
      setDriverId(orderToEdit.driverId || "none");
      setCompanyLogo(orderToEdit.companyLogo || "");
      setSelectedIssuerId(orderToEdit.issuerId || (user ? user.id : ''));
    }
  }, [orderToEdit, user]);

  // Update cubic measurement when measurements change
  useEffect(() => {
    const totalCubic = measurements.reduce((sum, item) => {
      const itemCubic = (item.length * item.width * item.height * item.quantity) / 1000000;
      return sum + itemCubic;
    }, 0);
    
    setCubicMeasurement(totalCubic);
  }, [measurements]);

  const handleMeasurementChange = (id: string, field: keyof Measurement, value: number) => {
    setMeasurementsVou verificar e resolver os problemas relacionados às informações de empresa e perfil pessoal, além de implementar a seleção de clientes nas ordens de coleta. Vamos analisar e corrigir essas questões:

<lov-code>
Vamos fazer as correções necessárias para que as informações pessoais e de empresa funcionem corretamente e adicionar a funcionalidade de selecionar clientes previamente cadastrados nas ordens de coleta.

Primeiro, vamos modificar o componente ClientFormFields.tsx para corrigir a captura e o salvamento dos dados:

<lov-write file_path="src/components/client/ClientFormFields.tsx">
import React, { useState } from "react";
import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClientFormData } from "@/types/client";
import { formatCPF, formatCNPJ, formatBrazilianPhone } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ClientFormFieldsProps {
  register: UseFormRegister<ClientFormData>;
  errors: FieldErrors<ClientFormData>;
  control: Control<ClientFormData>;
  personType: 'physical' | 'legal';
  onPersonTypeChange: (value: 'physical' | 'legal') => void;
  setValue?: (name: string, value: string) => void;
}

export const ClientFormFields: React.FC<ClientFormFieldsProps> = ({
  register,
  errors,
  control,
  personType,
  onPersonTypeChange,
  setValue,
}) => {
  const { toast } = useToast();
  const [isFetching, setIsFetching] = useState(false);

  const handleBuscarCNPJ = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!setValue) return;
    
    const cnpjInput = document.getElementById("cnpj") as HTMLInputElement;
    if (!cnpjInput) return;
    
    const cnpjValue = cnpjInput.value.replace(/\D/g, "");
    if (!cnpjValue || cnpjValue.length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "Digite um CNPJ válido para buscar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsFetching(true);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjValue}`);
      if (!res.ok) throw new Error("CNPJ não encontrado");
      
      const data = await res.json();
      setValue("name", data.razao_social || "");
      setValue("address", [data.logradouro, data.numero, data.bairro, data.municipio].filter(Boolean).join(", "));
      setValue("city", data.municipio || "");
      setValue("state", data.uf || "");
      setValue("phone", data.ddd_telefone_1 || data.ddd_telefone_2 || "");
      
      toast({
        title: "Dados encontrados!",
        description: "Os campos foram preenchidos automaticamente.",
      });
    } catch (error) {
      toast({
        title: "CNPJ não encontrado",
        description: "Não foi possível buscar dados para este CNPJ.",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <div className="space-y-4 mb-6">
        <Label>Tipo de Pessoa</Label>
        <RadioGroup
          defaultValue={personType}
          onValueChange={(value: 'physical' | 'legal') => onPersonTypeChange(value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="physical" id="physical" />
            <Label htmlFor="physical">Pessoa Física</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="legal" id="legal" />
            <Label htmlFor="legal">Pessoa Jurídica</Label>
          </div>
        </RadioGroup>
      </div>
      
      {personType === 'legal' && (
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="cnpj" 
              {...register("cnpj")}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                e.target.value = formatCNPJ(value);
              }}
              placeholder="00.000.000/0000-00"
              className="flex-grow"
              maxLength={18}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleBuscarCNPJ}
              disabled={isFetching}
              className="whitespace-nowrap"
            >
              {isFetching ? "Buscando..." : "Buscar"}
            </Button>
          </div>
          {errors.cnpj && (
            <p className="text-sm text-red-500">{errors.cnpj.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="name">Nome {personType === 'physical' ? 'Completo' : 'da Empresa'}</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2 flex flex-col">
        {personType === 'physical' ? (
          <>
            <Label htmlFor="cpf">CPF</Label>
            <Input 
              id="cpf" 
              {...register("cpf")}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                e.target.value = formatCPF(value);
              }}
              maxLength={14}
            />
            {errors.cpf && (
              <p className="text-sm text-red-500">{errors.cpf.message}</p>
            )}
          </>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input 
          id="phone" 
          {...register("phone")}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            e.target.value = formatBrazilianPhone(value);
          }}
          maxLength={15}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address">Endereço</Label>
        <Input id="address" {...register("address")} />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>
    </>
  );
};
