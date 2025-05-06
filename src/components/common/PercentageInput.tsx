
import React from "react";
import { Input, InputProps } from "@/components/ui/input";

interface PercentageInputProps extends Omit<InputProps, "onChange" | "value"> {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

const PercentageInput: React.FC<PercentageInputProps> = ({
  value,
  onChange,
  placeholder = "0%",
  ...props
}) => {
  // Format number to percentage
  const formatToPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  // Parse percentage string to number
  const parseFromPercentage = (value: string): number => {
    const cleaned = value.replace(/[^\d,.]/g, "")
      .replace(".", "")    // Remove dots
      .replace(",", ".");  // Replace comma with dot
    
    return parseFloat(cleaned) || 0;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFromPercentage(e.target.value);
    onChange(newValue);
  };

  // Format value for display in the input field
  const displayValue = value ? formatToPercentage(value) : "";

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

export default PercentageInput;
