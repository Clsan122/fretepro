
import React, { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { Client } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { BRAZILIAN_STATES } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Image } from "lucide-react";

const clientSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

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
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof clientSchema>>({
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: z.infer<typeof clientSchema>) => {
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
          <div className="flex flex-col space-y-2">
            <Label>Logotipo do Cliente</Label>
            <div className="flex items-center gap-2">
              {logo ? (
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Logotipo" 
                    className="h-16 w-auto object-contain border rounded p-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-6 w-6 bg-white rounded-full"
                    onClick={() => setLogo("")}
                  >
                    <span className="sr-only">Remover</span>
                    ×
                  </Button>
                </div>
              ) : (
                <div className="h-16 w-32 border-2 border-dashed rounded flex items-center justify-center">
                  <Image className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <Button 
                type="button"
                variant="outline"
                size="sm"
                onClick={() => logoInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Enviar Logotipo
              </Button>
              <input
                type="file"
                ref={logoInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cliente</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" {...register("cnpj")} />
            {errors.cnpj && (
              <p className="text-sm text-red-500">{errors.cnpj.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" {...register("address")} />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Select
                value={watchedState}
                onValueChange={handleSetState}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state.abbreviation} value={state.abbreviation}>
                      {state.abbreviation} - {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>
          </div>
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
