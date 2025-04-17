
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

// This schema defines validation rules for our form
const clientSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

// Use the shared type for the form data
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
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initialData?.name || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      cnpj: initialData?.cnpj || "",
      address: initialData?.address || "",
      phone: initialData?.phone || "",
    },
  });

  const watchedState = watch("state");
  
  useEffect(() => {
    if (initialData?.logo) {
      setLogo(initialData.logo);
    }
  }, [initialData]);

  const onSubmit = (data: FormData) => {
    if (!user) return;

    const client: Client = {
      id: initialData?.id || uuidv4(),
      name: data.name,
      city: data.city,
      state: data.state,
      cnpj: data.cnpj || undefined,
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

  if (!user) {
    return <p>Você precisa estar logado para acessar este recurso.</p>;
  }

  return (
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
          <ClientFormFields 
            register={register} 
            errors={errors} 
          />
          <LocationFields 
            register={register}
            errors={errors}
            watchedState={watchedState}
            handleSetState={handleSetState}
          />
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Atualizar" : "Cadastrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ClientForm;
