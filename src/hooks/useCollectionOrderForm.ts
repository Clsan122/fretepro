
import { useBasicFormState } from "./collection-order/useBasicFormState";
import { useLocationState } from "./collection-order/useLocationState";
import { useCargoState } from "./collection-order/useCargoState";
import { useAdditionalInfoState } from "./collection-order/useAdditionalInfoState";
import { CollectionOrder } from "@/types";

interface UseCollectionOrderFormProps {
  orderToEdit?: CollectionOrder;
}

export const useCollectionOrderForm = ({ orderToEdit }: UseCollectionOrderFormProps) => {
  const { basicFormState, basicSetters } = useBasicFormState(orderToEdit);
  const { locationState, locationSetters } = useLocationState(orderToEdit);
  const { cargoState, cargoSetters, measurementHandlers } = useCargoState(orderToEdit);
  const { additionalState, additionalSetters } = useAdditionalInfoState(orderToEdit);

  return {
    formData: {
      ...basicFormState,
      ...locationState,
      ...cargoState,
      ...additionalState
    },
    setters: {
      ...basicSetters,
      ...locationSetters,
      ...cargoSetters,
      ...additionalSetters
    },
    measurementHandlers
  };
};
