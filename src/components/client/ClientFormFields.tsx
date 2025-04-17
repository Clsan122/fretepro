
import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClientFormData } from "@/types/client";

interface ClientFormFieldsProps {
  register: UseFormRegister<ClientFormData>;
  errors: FieldErrors<ClientFormData>;
}

export const ClientFormFields: React.FC<ClientFormFieldsProps> = ({
  register,
  errors,
}) => {
  return (
    <>
      <div className="space-y-2 md:col-span-2">
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
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" {...register("phone")} />
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
