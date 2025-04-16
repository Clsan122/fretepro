
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Measurement } from "@/types";

interface MeasurementsProps {
  measurements: Measurement[];
  handleAddMeasurement: () => void;
  handleRemoveMeasurement: (id: string) => void;
  handleMeasurementChange: (id: string, field: keyof Measurement, value: number) => void;
}

export const MeasurementsSection: React.FC<MeasurementsProps> = ({
  measurements,
  handleAddMeasurement,
  handleRemoveMeasurement,
  handleMeasurementChange
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Medidas</CardTitle>
          <CardDescription>Informe as dimensões dos volumes</CardDescription>
        </div>
        <Button 
          type="button" 
          onClick={handleAddMeasurement}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {measurements.map((measurement, index) => (
            <div 
              key={measurement.id} 
              className="grid grid-cols-12 gap-2 items-center"
            >
              <div className="space-y-1 col-span-3">
                <Label htmlFor={`length-${measurement.id}`} className="text-xs flex items-center gap-1">
                  C <span className="text-muted-foreground">(cm)</span>
                </Label>
                <Input
                  id={`length-${measurement.id}`}
                  type="number"
                  step="0.1"
                  value={measurement.length.toString()}
                  onChange={(e) => handleMeasurementChange(
                    measurement.id, 
                    'length', 
                    Number(e.target.value)
                  )}
                  min="0"
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-1 col-span-3">
                <Label htmlFor={`width-${measurement.id}`} className="text-xs flex items-center gap-1">
                  L <span className="text-muted-foreground">(cm)</span>
                </Label>
                <Input
                  id={`width-${measurement.id}`}
                  type="number"
                  step="0.1"
                  value={measurement.width.toString()}
                  onChange={(e) => handleMeasurementChange(
                    measurement.id, 
                    'width', 
                    Number(e.target.value)
                  )}
                  min="0"
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-1 col-span-3">
                <Label htmlFor={`height-${measurement.id}`} className="text-xs flex items-center gap-1">
                  A <span className="text-muted-foreground">(cm)</span>
                </Label>
                <Input
                  id={`height-${measurement.id}`}
                  type="number"
                  step="0.1"
                  value={measurement.height.toString()}
                  onChange={(e) => handleMeasurementChange(
                    measurement.id, 
                    'height', 
                    Number(e.target.value)
                  )}
                  min="0"
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-1 col-span-2">
                <Label htmlFor={`quantity-${measurement.id}`} className="text-xs">
                  Qtd
                </Label>
                <Input
                  id={`quantity-${measurement.id}`}
                  type="number"
                  value={measurement.quantity.toString()}
                  onChange={(e) => handleMeasurementChange(
                    measurement.id, 
                    'quantity', 
                    Number(e.target.value)
                  )}
                  min="1"
                  className="text-sm"
                />
              </div>
              
              <div className="col-span-1 flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveMeasurement(measurement.id)}
                  disabled={measurements.length <= 1}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
