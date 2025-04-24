
import { useState } from "react";
import { CollectionOrder } from "@/types";

export const useLocationState = (orderToEdit?: CollectionOrder) => {
  const [originCity, setOriginCity] = useState(orderToEdit?.originCity || "");
  const [originState, setOriginState] = useState(orderToEdit?.originState || "");
  const [destinationCity, setDestinationCity] = useState(orderToEdit?.destinationCity || "");
  const [destinationState, setDestinationState] = useState(orderToEdit?.destinationState || "");

  return {
    locationState: {
      originCity,
      originState,
      destinationCity,
      destinationState
    },
    locationSetters: {
      setOriginCity,
      setOriginState,
      setDestinationCity,
      setDestinationState
    }
  };
};
