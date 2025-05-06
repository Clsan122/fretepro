
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { User, Briefcase } from "lucide-react";
import { useProfileData } from "@/hooks/useProfileData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClientSectionProps {
  clientId: string;
  clients: Client[];
  onClientChange: (clientId: string) => void;
  onLoadProfileData: (data: any) => void;
  onLoadCompanyData: (data: any) => void;
}

const ClientSection: React.FC<ClientSectionProps> = ({ 
  clientId, 
  clients, 
  onClientChange,
  onLoadProfileData,
  onLoadCompanyData
}) => {
  const { profileData, companyData, isLoading } = useProfileData();

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3 px-3 md:px-4">
        <CardTitle className="text-lg md:text-xl text-purple-700">Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3 md:px-4">
        <Tabs defaultValue="client">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="client">Clientes</TabsTrigger>
            <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
            <TabsTrigger value="company">Minha Empresa</TabsTrigger>
          </TabsList>

          <TabsContent value="client">
            <div className="space-y-3">
              <div>
                <Label>Cliente</Label>
                <Select 
                  value={clientId} 
                  onValueChange={(value) => onClientChange(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold">Usar dados do meu perfil</h3>
                  {profileData && <p className="text-sm text-muted-foreground">{profileData.name}</p>}
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => profileData && onLoadProfileData(profileData)}
                  disabled={isLoading || !profileData}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Carregar Dados
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="company">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold">Usar dados da minha empresa</h3>
                  {companyData && <p className="text-sm text-muted-foreground">{companyData.name}</p>}
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => companyData && onLoadCompanyData(companyData)}
                  disabled={isLoading || !companyData}
                  className="flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Carregar Dados
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientSection;
