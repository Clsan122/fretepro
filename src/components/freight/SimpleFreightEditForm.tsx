import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Freight } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PricingSection } from "@/components/freight/PricingSection";

const schema = z.object({
  originCity: z.string().optional(),
  destinationCity: z.string().optional(),
  driverName: z.string().optional(),
  requesterName: z.string().optional(),
  departureDate: z.string().nonempty("Informe a data do serviço"),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface SimpleFreightEditFormProps {
  onSave: (freight: Freight) => void;
  onCancel: () => void;
  freightToEdit: Freight;
}

const SimpleFreightEditForm: React.FC<SimpleFreightEditFormProps> = ({ 
  onSave, 
  onCancel, 
  freightToEdit 
}) => {
  const { user } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      originCity: freightToEdit.originCity || "",
      destinationCity: freightToEdit.destinationCity || "",
      driverName: freightToEdit.driverName || "",
      requesterName: freightToEdit.requesterName || "",
      departureDate: freightToEdit.departureDate ? new Date(freightToEdit.departureDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      observations: freightToEdit.observations || "",
    },
  });

  const [freightValue, setFreightValue] = React.useState<number>(freightToEdit.freightValue || 0);
  const [dailyRate, setDailyRate] = React.useState<number>(freightToEdit.dailyRate || 0);
  const [otherCosts, setOtherCosts] = React.useState<number>(freightToEdit.otherCosts || 0);
  const [tollCosts, setTollCosts] = React.useState<number>(freightToEdit.tollCosts || 0);
  const [driverExpenses, setDriverExpenses] = React.useState<number>(freightToEdit.driverExpenses || 0);
  const totalValue = freightValue + dailyRate + otherCosts + tollCosts;
  const netProfit = totalValue - driverExpenses;

  const handleSubmit = (values: FormValues) => {
    if (!user) return;

    const updatedFreight: Freight = {
      ...freightToEdit,
      originCity: values.originCity || "",
      destinationCity: values.destinationCity || "",
      driverName: values.driverName || undefined,
      requesterName: values.requesterName || undefined,
      departureDate: new Date(values.departureDate).toISOString(),
      observations: values.observations || undefined,
      freightValue,
      dailyRate,
      otherCosts,
      tollCosts,
      totalValue,
      driverExpenses,
      netProfit,
    };

    onSave(updatedFreight);
    onCancel();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data do Serviço</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div />
          <FormField
            control={form.control}
            name="originCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origem (Cidade)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: São Paulo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destinationCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destino (Cidade)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Rio de Janeiro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="driverName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motorista (digitável)</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do motorista" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requesterName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solicitante (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Quem solicitou o frete" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <PricingSection
          freightValue={freightValue}
          setFreightValue={setFreightValue}
          dailyRate={dailyRate}
          setDailyRate={setDailyRate}
          otherCosts={otherCosts}
          setOtherCosts={setOtherCosts}
          tollCosts={tollCosts}
          setTollCosts={setTollCosts}
          totalValue={totalValue}
          driverExpenses={driverExpenses}
          setDriverExpenses={setDriverExpenses}
          netProfit={netProfit}
        />

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações sobre o frete" 
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Alterações</Button>
        </div>
      </form>
    </Form>
  );
};

export default SimpleFreightEditForm;