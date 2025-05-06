
import React from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = "R$ 0,00",
  ...props
}) => {
  // Format the number to Brazilian currency format for display
  const formatToBRL = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Parse the formatted string back to a number
  const parseFromBRL = (value: string): number => {
    // Remove all non-digit characters except for comma and dot
    const cleaned = value.replace(/[^\d,.]/g, "")
      .replace(".", "")    // Remove dots (thousand separators in BR)
      .replace(",", ".");  // Replace comma with dot for decimal point
    
    return parseFloat(cleaned) || 0;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFromBRL(e.target.value);
    onChange(newValue);
  };

  // Format value for display in the input field
  const displayValue = value ? formatToBRL(value) : "";

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default CurrencyInput;
