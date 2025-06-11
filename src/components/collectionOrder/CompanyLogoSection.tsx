import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth/useAuth";
import { getClientsByUserId } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface CompanyLogoSectionProps {
  companyLogo: string;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedIssuerId?: string;
  onIssuerChange?: (id: string) => void;
  handleRemoveLogo?: () => void;
  isUploading?: boolean;
}
export const CompanyLogoSection: React.FC<CompanyLogoSectionProps> = ({
  companyLogo,
  handleLogoUpload,
  selectedIssuerId,
  onIssuerChange,
  handleRemoveLogo,
  isUploading = false
}) => {
  const {
    user
  } = useAuth();
  const clients = user ? getClientsByUserId(user.id) : [];
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();

  // Usar preferencialmente os dados da empresa se disponíveis
  const issuerName = user?.companyName || user?.name || "";
  const handleIssuerChange = (value: string) => {
    if (onIssuerChange) {
      onIssuerChange(value);
      // Mostrar toast de confirmação
      toast({
        title: "Emissor selecionado",
        description: "As informações do emissor foram atualizadas."
      });
    }
  };
  return <Card>
      
    </Card>;
};