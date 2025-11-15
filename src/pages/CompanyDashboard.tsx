import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useCompany } from "@/hooks/useCompany";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import Layout from "@/components/Layout";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useUserRole();
  const { company, loading: companyLoading } = useCompany();

  useEffect(() => {
    if (!roleLoading && role !== "company_admin" && role !== "company_user") {
      navigate("/");
    }
  }, [role, roleLoading, navigate]);

  if (roleLoading || companyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard da Empresa</h1>
        <Card className="p-6">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-center">Empresa: {company?.name}</p>
          <Button onClick={() => navigate("/company/post-freight")} className="mt-4 w-full">
            Postar Frete
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default CompanyDashboard;
