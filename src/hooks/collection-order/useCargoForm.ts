
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Measurement {
  id: string;
  length: number;
  width: number;
  height: number;
  quantity: number;
}

export const useCargoForm = (initialData?: {
  volumes?: number;
  weight?: number;
  measurements?: Measurement[];
  cubicMeasurement?: number;
  merchandiseValue?: number;
}) => {
  const [volumes, setVolumes] = useState<number>(initialData?.volumes || 0);
  const [weight, setWeight] = useState<number>(initialData?.weight || 0);
  const [merchandiseValue, setMerchandiseValue] = useState<number>(initialData?.merchandiseValue || 0);
  
  // Inicializar com pelo menos uma medida
  const defaultMeasurement: Measurement = { id: uuidv4(), length: 0, width: 0, height: 0, quantity: 1 };
  const [measurements, setMeasurements] = useState<Measurement[]>(
    initialData?.measurements && initialData.measurements.length > 0
      ? initialData.measurements
      : [defaultMeasurement]
  );
  
  const [cubicMeasurement, setCubicMeasurement] = useState<number>(initialData?.cubicMeasurement || 0);

  const calculateCubicMeasurement = (measurements: Measurement[]): number => {
    return measurements.reduce((total, m) => {
      return total + (m.length * m.width * m.height * m.quantity) / 1000000;
    }, 0);
  };

  // Calcular cubagem ao inicializar
  useState(() => {
    if (initialData?.measurements) {
      const calculated = calculateCubicMeasurement(initialData.measurements);
      setCubicMeasurement(calculated);
    }
  });

  const handleMeasurementChange = (id: string, field: keyof Measurement, value: number) => {
    const updatedMeasurements = measurements.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    
    setMeasurements(updatedMeasurements);
    setCubicMeasurement(calculateCubicMeasurement(updatedMeasurements));
  };

  const handleAddMeasurement = () => {
    setMeasurements([...measurements, { id: uuidv4(), length: 0, width: 0, height: 0, quantity: 1 }]);
  };

  const handleRemoveMeasurement = (id: string) => {
    if (measurements.length > 1) {
      const updatedMeasurements = measurements.filter(m => m.id !== id);
      setMeasurements(updatedMeasurements);
      setCubicMeasurement(calculateCubicMeasurement(updatedMeasurements));
    }
  };

  return {
    volumes,
    setVolumes,
    weight,
    setWeight,
    measurements,
    cubicMeasurement,
    merchandiseValue,
    setMerchandiseValue,
    handlers: {
      handleMeasurementChange,
      handleAddMeasurement,
      handleRemoveMeasurement,
    }
  };
};
