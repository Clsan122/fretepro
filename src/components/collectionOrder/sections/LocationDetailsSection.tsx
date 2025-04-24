
import React from "react";
import { LocationsSection } from "../LocationsSection";

interface LocationDetailsSectionProps {
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  onOriginCityChange: (value: string) => void;
  onOriginStateChange: (value: string) => void;
  onDestinationCityChange: (value: string) => void;
  onDestinationStateChange: (value: string) => void;
}

export const LocationDetailsSection: React.FC<LocationDetailsSectionProps> = ({
  originCity,
  originState,
  destinationCity,
  destinationState,
  onOriginCityChange,
  onOriginStateChange,
  onDestinationCityChange,
  onDestinationStateChange,
}) => {
  return (
    <LocationsSection
      originCity={originCity}
      setOriginCity={onOriginCityChange}
      originState={originState}
      setOriginState={onOriginStateChange}
      destinationCity={destinationCity}
      setDestinationCity={onDestinationCityChange}
      destinationState={destinationState}
      setDestinationState={onDestinationStateChange}
    />
  );
};
