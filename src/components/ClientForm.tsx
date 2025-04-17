
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { Client } from "@/types";
import { ClientFormData } from "@/types/client";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoUpload } from "./client/LogoUpload";
import { ClientFormFields } from "./client/ClientFormFields";
import { LocationFields } from "./client/LocationFields";

const clientSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  personType: z.enum(["physical", "legal"])
});

type FormData = ClientFormData;

interface ClientFormProps {
  onSave: (client: Client) => void;
  onCancel: () => void;
  initialData?: Client;
}

const ClientForm: React.FC<ClientFormProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const { user } = useAuth();
  const [logo, setLogo] = useState<string>("");
  const [personType, setPersonType] = useState<'physical' | 'legal'>('legal');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initialData?.name || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      cnpj: initialData?.cnpj || "",
      cpf: "",
      address: initialData?.address || "",
      phone: initialData?.phone || "",
      personType: "legal"
    },
  });

  const watchedState = watch("state");

  useEffect(() => {
    if (initialData?.logo) {
      setLogo(initialData.logo);
    }
    
    // Set person type based on whether CNPJ is present
    if (initialData?.cnpj) {
      setPersonType('legal');
      setValue("personType", "legal");
    } else if (initialData?.cpf) {
      setPersonType('physical');
      setValue("personType", "physical");
    }
  }, [initialData, setValue]);

  const onSubmit = (data: FormData) => {
    if (!user) return;

    const client: Client = {
      id: initialData?.id || uuidv4(),
      name: data.name,
      city: data.city,
      state: data.state,
      cnpj: personType === 'legal' ? data.cnpj : undefined,
      cpf: personType === 'physical' ? data.cpf : undefined,
      address: data.address || undefined,
      phone: data.phone || undefined,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      userId: user.id,
      logo: logo || undefined,
    };

    onSave(client);
  };

  const handleSetState = (value: string) => {
    setValue("state", value);
  };
  
  const handlePersonTypeChange = (value: 'physical' | 'legal') => {
    setPersonType(value);
    setValue("personType", value);
  };

  if (!user) {
    return <p>Você precisa estar logado para acessar este recurso.</p>;
  }

  return (
    <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pb-16 md:pb-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {initialData ? "Editar Cliente" : "Novo Cliente"}
          </CardTitle>
          <CardDescription>
            {initialData
              ? "Atualize as informações do cliente"
              : "Cadastre um novo cliente"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <LogoUpload logo={logo} setLogo={setLogo} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ClientFormFields 
                register={register} 
                errors={errors}
                control={control}
                personType={personType}
                onPersonTypeChange={handlePersonTypeChange}
              />
              <div className="md:col-span-2">
                <LocationFields 
                  register={register}
                  errors={errors}
                  watchedState={watchedState}
                  handleSetState={handleSetState}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button 
              variant="outline" 
              onClick={onCancel} 
              type="button"
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {initialData ? "Atualizar" : "Cadastrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ClientForm;
