
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DeliveryProofProps {
  proofImage: string;
  setProofImage: (value: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DeliveryProofSection: React.FC<DeliveryProofProps> = ({
  proofImage,
  setProofImage,
  handleImageUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprovante de Entrega</CardTitle>
        <CardDescription>Envie o comprovante de entrega da carga</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="proofImage">Comprovante de Entrega</Label>
            
            <Button 
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center w-full md:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              Selecionar Imagem
            </Button>
            
            <Input
              ref={fileInputRef}
              id="proofImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          
          {proofImage && (
            <div className="mt-4">
              <p className="text-sm mb-2">Comprovante carregado:</p>
              <div className="relative border rounded-md overflow-hidden">
                <img 
                  src={proofImage} 
                  alt="Comprovante de entrega" 
                  className="max-h-64 w-full object-contain"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setProofImage("")}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background/90"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remover</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
