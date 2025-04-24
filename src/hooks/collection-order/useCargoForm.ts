
import { useState, useEffect } from "react";
import { Measurement } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const useCargoForm = (initialData?: {
  volumes?: number;
  weight?: number;
  measurements?: Measurement[];
  merchandiseValue?: number;
  cubicMeasurement?: number;
}) => {
  const [volumes, setVolumes] = useState<number>(initialData?.volumes || 0);
  const [weight, setWeight] = useState<number>(initialData?.weight || 0);
  const [measurements, setMeasurements] = useState<Measurement[]>(
    initialData?.measurements || [
      { id: uuidv4(), length: 0, width: 0, height: 0, quantity: 1 }
    ]
  );
  const [cubicMeasurement, setCubicMeasurement] = useState<number>(
    initialData?.cubicMeasurement || 0
  );
  const [merchandiseValue, setMerchandiseValue] = useState<number>(
    initialData?.merchandiseValue || 0
  );

  // Update cubic measurement when measurements change
  useEffect(() => {
    const totalCubic = measurements.reduce((sum, item) => {
      const itemCubic = (item.length * item.width * item.height * item.quantity) / 1000000;
      return sum + itemCubic;
    }, 0);
    
    setCubicMeasurement(totalCubic);
  }, [measurements]);

  const handleMeasurementChange = (id: string, field: keyof Measurement, value: number) => {
    setMeasurements(
      measurements.map(measurement =>
        measurement.id === id ? { ...measurement, [field]: value } : measurement
      )
    );
  };

  const handleAddMeasurement = () => {
    const newMeasurement: Measurement = {
      id: uuidv4(),
      length: 0,
      width: 0,
      height: 0,
      quantity: 1
    };
    setMeasurements([...measurements, newMeasurement]);
  };

  const handleRemoveMeasurement = (id: string) => {
    if (measurements.length > 1) {
      setMeasurements(measurements.filter(measurement => measurement.id !== id));
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
      handleRemoveMeasurement
    }
  };
};
