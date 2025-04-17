
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Image } from "lucide-react";

interface LogoUploadProps {
  logo: string;
  setLogo: (logo: string) => void;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({ logo, setLogo }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Label>Logotipo do Cliente</Label>
      <div className="flex items-center gap-2">
        {logo ? (
          <div className="relative">
            <img 
              src={logo} 
              alt="Logotipo" 
              className="h-16 w-auto object-contain border rounded p-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-6 w-6 bg-white rounded-full"
              onClick={() => setLogo("")}
            >
              <span className="sr-only">Remover</span>
              ×
            </Button>
          </div>
        ) : (
          <div className="h-16 w-32 border-2 border-dashed rounded flex items-center justify-center">
            <Image className="h-6 w-6 text-gray-400" />
          </div>
        )}
        <Button 
          type="button"
          variant="outline"
          size="sm"
          onClick={() => logoInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Enviar Logotipo
        </Button>
        <input
          type="file"
          ref={logoInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleLogoUpload}
        />
      </div>
    </div>
  );
};
