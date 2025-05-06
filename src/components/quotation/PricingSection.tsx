
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CurrencyInput from "@/components/common/CurrencyInput";
import PercentageInput from "@/components/common/PercentageInput";

interface PricingSectionProps {
  quotedValue: number;
  toll: number;
  insurance: number;
  insurancePercentage: number;
  others: number;
  totalValue: number;
  observations: string;
  updateField: (field: string, value: any) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  quotedValue,
  toll,
  insurance,
  insurancePercentage,
  others,
  totalValue,
  observations,
  updateField,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3 px-3 md:px-4">
        <CardTitle className="text-lg md:text-xl text-purple-700">Valor da Cotação</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3 md:px-4">
        <div className="space-y-3">
          <div>
            <Label>Valor Frete (R$)</Label>
            <CurrencyInput 
              value={quotedValue} 
              onChange={(value) => updateField("quotedValue", value)}
              placeholder="Valor do frete" 
              className="text-lg font-bold text-green-700"
            />
          </div>
          
          <div>
            <Label>Pedágio (R$)</Label>
            <CurrencyInput 
              value={toll} 
              onChange={(value) => updateField("toll", value)}
              placeholder="Valor de pedágio" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Seguro - Porcentagem (%)</Label>
              <PercentageInput 
                value={insurancePercentage} 
                onChange={(value) => updateField("insurancePercentage", value)}
                placeholder="Percentual do seguro" 
              />
            </div>
            <div>
              <Label>Valor do Seguro (R$)</Label>
              <CurrencyInput 
                value={insurance} 
                onChange={(value) => updateField("insurance", value)}
                placeholder="Valor do seguro" 
                disabled={true}
              />
              <p className="text-xs text-gray-500 mt-1">Calculado com base no percentual e valor da mercadoria</p>
            </div>
          </div>
          
          <div>
            <Label>Outros Custos (R$)</Label>
            <CurrencyInput 
              value={others} 
              onChange={(value) => updateField("others", value)}
              placeholder="Outros custos" 
            />
          </div>
          
          <div className="mt-4 pt-2 border-t border-gray-200">
            <Label className="text-lg font-bold">Total (R$)</Label>
            <CurrencyInput
              value={totalValue} 
              onChange={(value) => updateField("totalValue", value)}
              placeholder="Total da cotação" 
              className="text-xl font-bold text-green-800"
              disabled={true}
            />
            <p className="text-xs text-gray-500 mt-1">Soma de frete + pedágio + seguro + outros</p>
          </div>
          
          <div className="mt-4">
            <Label>Observações</Label>
            <Textarea 
              value={observations} 
              onChange={(e) => updateField("observations", e.target.value)}
              placeholder="Observações sobre a cotação" 
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingSection;
