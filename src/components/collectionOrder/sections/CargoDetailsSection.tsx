
import React from "react";
import { CargoSection } from "../CargoSection";
import { Measurement } from "@/types";

interface CargoDetailsSectionProps {
  volumes: number;
  weight: number;
  merchandiseValue: number;
  cubicMeasurement: number;
  measurements: Measurement[];
  onVolumesChange: (value: number) => void;
  onWeightChange: (value: number) => void;
  onMerchandiseValueChange: (value: number) => void;
  onMeasurementChange: (id: string, field: keyof Measurement, value: number) => void;
  onAddMeasurement: () => void;
  onRemoveMeasurement: (id: string) => void;
}

export const CargoDetailsSection: React.FC<CargoDetailsSectionProps> = ({
  volumes,
  weight,
  merchandiseValue,
  cubicMeasurement,
  measurements,
  onVolumesChange,
  onWeightChange,
  onMerchandiseValueChange,
  onMeasurementChange,
  onAddMeasurement,
  onRemoveMeasurement,
}) => {
  return (
    <CargoSection
      volumes={volumes}
      setVolumes={onVolumesChange}
      weight={weight}
      setWeight={onWeightChange}
      merchandiseValue={merchandiseValue}
      setMerchandiseValue={onMerchandiseValueChange}
      cubicMeasurement={cubicMeasurement}
      measurements={measurements}
      handleAddMeasurement={onAddMeasurement}
      handleRemoveMeasurement={onRemoveMeasurement}
      handleMeasurementChange={onMeasurementChange}
    />
  );
};
