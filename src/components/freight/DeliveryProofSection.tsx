
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprovante de Entrega</CardTitle>
        <CardDescription>Envie o comprovante de entrega da carga</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label htmlFor="proofImage">Comprovante de Entrega</Label>
          <Input
            id="proofImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="cursor-pointer"
          />
          
          {proofImage && (
            <div className="mt-2">
              <p className="text-sm mb-2">Comprovante carregado:</p>
              <div className="border rounded-md overflow-hidden">
                <img 
                  src={proofImage} 
                  alt="Comprovante de entrega" 
                  className="max-h-64 mx-auto"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
