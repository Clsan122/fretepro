
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CitySelectAutocomplete } from "@/components/common/CitySelectAutocomplete";
import { UseFormReturn } from "react-hook-form";
import { CollectionOrderFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface LocationDetailsSectionProps {
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  onOriginCityChange: (value: string) => void;
  onOriginStateChange: (value: string) => void;
  onDestinationCityChange: (value: string) => void;
  onDestinationStateChange: (value: string) => void;
  form: UseFormReturn<CollectionOrderFormValues>;
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
  form
}) => {
  const handleOriginCityChange = (city: string) => {
    onOriginCityChange(city);
    form.setValue("originCity", city, { shouldValidate: true });
  };

  const handleOriginStateChange = (state: string) => {
    onOriginStateChange(state);
    form.setValue("originState", state, { shouldValidate: true });
  };

  const handleDestinationCityChange = (city: string) => {
    onDestinationCityChange(city);
    form.setValue("destinationCity", city, { shouldValidate: true });
  };

  const handleDestinationStateChange = (state: string) => {
    onDestinationStateChange(state);
    form.setValue("destinationState", state, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle>Locais de Origem e Destino</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Origem</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="originCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade de Origem</FormLabel>
                  <FormControl>
                    <CitySelectAutocomplete 
                      value={originCity}
                      onCityChange={handleOriginCityChange}
                      onStateChange={handleOriginStateChange}
                      placeholder="Digite a cidade de origem"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="originState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado de Origem</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      value={originState}
                      onChange={(e) => handleOriginStateChange(e.target.value)}
                      placeholder="UF" 
                      maxLength={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Destino</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="destinationCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade de Destino</FormLabel>
                  <FormControl>
                    <CitySelectAutocomplete 
                      value={destinationCity}
                      onCityChange={handleDestinationCityChange}
                      onStateChange={handleDestinationStateChange}
                      placeholder="Digite a cidade de destino"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destinationState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado de Destino</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      value={destinationState}
                      onChange={(e) => handleDestinationStateChange(e.target.value)}
                      placeholder="UF" 
                      maxLength={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
