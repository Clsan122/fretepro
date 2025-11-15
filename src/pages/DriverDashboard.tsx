import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import Layout from "@/components/Layout";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!roleLoading && role !== "driver") {
      navigate("/");
    }
  }, [role, roleLoading, navigate]);

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard do Motorista</h1>
        <Card className="p-6">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-center">Encontre fretes disponíveis</p>
          <Button onClick={() => navigate("/marketplace")} className="mt-4 w-full">
            Ver Marketplace
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default DriverDashboard;
