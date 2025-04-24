
import { useState } from "react";

export const useLocationForm = (initialData?: {
  originCity?: string;
  originState?: string;
  destinationCity?: string;
  destinationState?: string;
}) => {
  const [originCity, setOriginCity] = useState<string>(initialData?.originCity || "");
  const [originState, setOriginState] = useState<string>(initialData?.originState || "");
  const [destinationCity, setDestinationCity] = useState<string>(initialData?.destinationCity || "");
  const [destinationState, setDestinationState] = useState<string>(initialData?.destinationState || "");

  return {
    originCity,
    setOriginCity,
    originState,
    setOriginState,
    destinationCity,
    setDestinationCity,
    destinationState,
    setDestinationState
  };
};
