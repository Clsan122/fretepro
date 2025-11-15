import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMarketplaceFreights } from "@/hooks/useMarketplaceFreights";
import { useCompany } from "@/hooks/useCompany";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  origin_city: z.string().min(1, "Cidade de origem é obrigatória"),
  origin_state: z.string().min(2, "Estado de origem é obrigatório"),
  destination_city: z.string().min(1, "Cidade de destino é obrigatória"),
  destination_state: z.string().min(2, "Estado de destino é obrigatório"),
  cargo_type: z.string().min(1, "Tipo de carga é obrigatório"),
  cargo_description: z.string().optional(),
  weight: z.coerce.number().optional(),
  volumes: z.coerce.number().optional(),
  vehicle_type: z.string().optional(),
  suggested_price: z.coerce.number().optional(),
  price_negotiable: z.boolean().default(true),
  pickup_date: z.string().optional(),
  delivery_deadline: z.string().optional(),
  contact_name: z.string().min(1, "Nome do contato é obrigatório"),
  contact_phone: z.string().min(1, "Telefone do contato é obrigatório"),
  contact_email: z.string().email("Email inválido").optional(),
  special_requirements: z.string().optional(),
  visibility: z.enum(["public", "private"]).default("public"),
});

type FormValues = z.infer<typeof formSchema>;

export const PostFreightForm = () => {
  const navigate = useNavigate();
  const { company } = useCompany();
  const { createFreight } = useMarketplaceFreights();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price_negotiable: true,
      visibility: "public",
      contact_name: company?.name || "",
      contact_phone: company?.phone || "",
      contact_email: company?.email || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!company) {
      toast.error("Empresa não encontrada");
      return;
    }

    setLoading(true);
    try {
      const freightData = {
        origin_city: values.origin_city,
        origin_state: values.origin_state,
        destination_city: values.destination_city,
        destination_state: values.destination_state,
        cargo_type: values.cargo_type,
        cargo_description: values.cargo_description || null,
        weight: values.weight || null,
        volumes: values.volumes || null,
        vehicle_type: values.vehicle_type || null,
        suggested_price: values.suggested_price || null,
        price_negotiable: values.price_negotiable,
        pickup_date: values.pickup_date || null,
        delivery_deadline: values.delivery_deadline || null,
        contact_name: values.contact_name,
        contact_phone: values.contact_phone,
        contact_email: values.contact_email || null,
        special_requirements: values.special_requirements || null,
        visibility: values.visibility,
        company_id: company.id,
        posted_by: company.id,
        status: "open" as const,
      };
      await createFreight(freightData);
      toast.success("Frete postado com sucesso!");
      navigate("/company");
    } catch (error) {
      console.error("Erro ao postar frete:", error);
      toast.error("Erro ao postar frete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Postar Novo Frete</CardTitle>
          <CardDescription>
            Preencha os dados do frete para publicar no marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Rota */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="origin_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade de Origem</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: São Paulo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="origin_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado de Origem</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="SP" maxLength={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destination_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade de Destino</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Rio de Janeiro" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destination_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado de Destino</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="RJ" maxLength={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Carga */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="cargo_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Carga</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Carga Seca">Carga Seca</SelectItem>
                          <SelectItem value="Refrigerada">Refrigerada</SelectItem>
                          <SelectItem value="Granel">Granel</SelectItem>
                          <SelectItem value="Perecível">Perecível</SelectItem>
                          <SelectItem value="Perigosa">Perigosa</SelectItem>
                          <SelectItem value="Frágil">Frágil</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cargo_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição da Carga</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Descreva a carga..." rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} placeholder="1000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="volumes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Volumes</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} placeholder="10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicle_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Veículo</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: Carreta" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Datas */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="pickup_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Coleta</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo de Entrega</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Preço */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="suggested_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Sugerido (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} placeholder="5000.00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price_negotiable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Preço Negociável</FormLabel>
                        <FormDescription>
                          Permitir que motoristas façam contrapropostas
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Contato */}
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Contato</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Visibilidade */}
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibilidade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">Público (visível no marketplace)</SelectItem>
                        <SelectItem value="private">Privado (apenas sua empresa)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botões */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/company")}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Publicar Frete
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
