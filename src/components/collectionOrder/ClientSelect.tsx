
import React from "react";
import { Client } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ClientSelectProps {
  label: string;
  selectedValue: string;
  onClientChange: (value: string) => void;
}

export const ClientSelect: React.FC<ClientSelectProps> = ({
  label,
  selectedValue,
  onClientChange
}) => {
  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <Input
        value={selectedValue}
        onChange={(e) => onClientChange(e.target.value)}
        placeholder={`Digite o nome do ${label.toLowerCase()}`}
      />
    </div>
  );
};
