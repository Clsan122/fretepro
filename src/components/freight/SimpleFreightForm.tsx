import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { Freight } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PricingSection } from "@/components/freight/PricingSection";
const schema = z.object({
  originCity: z.string().optional(),
  destinationCity: z.string().optional(),
  driverName: z.string().optional(),
  requesterName: z.string().optional(),
  departureDate: z.string().nonempty("Informe a data do serviço"),
});

type FormValues = z.infer<typeof schema>;

interface SimpleFreightFormProps {
  onSave: (freight: Freight) => void;
  onCancel: () => void;
}

const SimpleFreightForm: React.FC<SimpleFreightFormProps> = ({ onSave, onCancel }) => {
  const { user } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      originCity: "",
      destinationCity: "",
      driverName: "",
      requesterName: "",
      departureDate: new Date().toISOString().slice(0, 10),
    },
  });

  const [freightValue, setFreightValue] = React.useState<number>(0);
  const [dailyRate, setDailyRate] = React.useState<number>(0);
  const [otherCosts, setOtherCosts] = React.useState<number>(0);
  const [tollCosts, setTollCosts] = React.useState<number>(0);
  const totalValue = freightValue + dailyRate + otherCosts + tollCosts;

  const handleSubmit = (values: FormValues) => {
    if (!user) return;
    const nowIso = new Date().toISOString();

    const newFreight: Freight = {
      id: uuidv4(),
      userId: user.id,
      clientId: "unknown-client",
      driverId: undefined,
      driverName: values.driverName || undefined,
      originCity: values.originCity || "",
      originState: "",
      destinationCity: values.destinationCity || "",
      destinationState: "",
      departureDate: new Date(values.departureDate).toISOString(),
      arrivalDate: new Date(values.departureDate).toISOString(),
      distance: 0,
      price: 0,
      volumes: 0,
      weight: 0,
      dimensions: "",
      cubicMeasurement: 0,
      cargoType: "",
      vehicleType: "",
      freightValue,
      dailyRate,
      otherCosts,
      tollCosts,
      totalValue,
      status: "pending",
      paymentStatus: "pending",
      createdAt: nowIso,
      expenses: [],
      requesterName: values.requesterName || undefined,
    };

    onSave(newFreight);
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
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Frete</Button>
        </div>
      </form>
    </Form>
  );
};

export default SimpleFreightForm;
