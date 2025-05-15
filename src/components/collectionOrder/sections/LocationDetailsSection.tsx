
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CitySelectAutocomplete } from "@/components/common/CitySelectAutocomplete";
import { UseFormReturn } from "react-hook-form";
import { CollectionOrderFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { MapPin } from "lucide-react";

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
    <Card className="border border-freight-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-freight-50 to-white p-4">
        <CardTitle className="flex items-center gap-2">
          <MapPin size={20} className="text-freight-600" />
          Locais de Origem e Destino
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-freight-700 border-b pb-2 border-freight-100">Origem</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="originCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel variant="required">Cidade de Origem</FormLabel>
                  <FormControl>
                    <CitySelectAutocomplete 
                      uf={originState}
                      value={originCity}
                      onChange={handleOriginCityChange}
                      placeholder="Digite a cidade de origem"
                      className="bg-white"
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
                  <FormLabel variant="required">Estado de Origem</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      value={originState}
                      onChange={(e) => handleOriginStateChange(e.target.value)}
                      placeholder="UF" 
                      maxLength={2}
                      className="uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-freight-700 border-b pb-2 border-freight-100">Destino</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="destinationCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel variant="required">Cidade de Destino</FormLabel>
                  <FormControl>
                    <CitySelectAutocomplete 
                      uf={destinationState}
                      value={destinationCity}
                      onChange={handleDestinationCityChange}
                      placeholder="Digite a cidade de destino"
                      className="bg-white"
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
                  <FormLabel variant="required">Estado de Destino</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      value={destinationState}
                      onChange={(e) => handleDestinationStateChange(e.target.value)}
                      placeholder="UF" 
                      maxLength={2}
                      className="uppercase"
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
