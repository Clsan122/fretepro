
import { useState, useEffect } from "react";
import { CollectionOrder, Measurement } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const useCargoState = (orderToEdit?: CollectionOrder) => {
  const [volumes, setVolumes] = useState<number>(orderToEdit?.volumes || 0);
  const [weight, setWeight] = useState<number>(orderToEdit?.weight || 0);
  const [measurements, setMeasurements] = useState<Measurement[]>(
    orderToEdit?.measurements || [
      { id: uuidv4(), length: 0, width: 0, height: 0, quantity: 1 }
    ]
  );
  const [cubicMeasurement, setCubicMeasurement] = useState<number>(orderToEdit?.cubicMeasurement || 0);
  const [merchandiseValue, setMerchandiseValue] = useState<number>(orderToEdit?.merchandiseValue || 0);

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
    cargoState: {
      volumes,
      weight,
      measurements,
      cubicMeasurement,
      merchandiseValue
    },
    cargoSetters: {
      setVolumes,
      setWeight,
      setMeasurements,
      setMerchandiseValue
    },
    measurementHandlers: {
      handleMeasurementChange,
      handleAddMeasurement,
      handleRemoveMeasurement
    }
  };
};
