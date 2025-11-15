import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import Layout from "@/components/Layout";
import ClientForm from "@/components/ClientForm";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Clients = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchClients = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from('clients').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (!error && data) setClients(data);
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, [user]);

  if (loading) return <Layout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clientes</h1>
          <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" />Novo Cliente</Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="p-6">
              <h3 className="text-xl font-bold">{client.name}</h3>
              <p className="text-muted-foreground">{client.city}, {client.state}</p>
            </Card>
          ))}
        </div>
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>Novo Cliente</DialogTitle></DialogHeader>
          <ClientForm onSave={() => { fetchClients(); setShowForm(false); }} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Clients;
