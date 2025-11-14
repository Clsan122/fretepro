import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface DocumentUploadProps {
  label: string;
  description?: string;
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  required?: boolean;
  value?: File | null;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  description,
  onFileSelect,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5,
  required = false,
  value = null
}) => {
  const [file, setFile] = useState<File | null>(value);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File): boolean => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      toast.error(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      return false;
    }

    const allowedTypes = accept.split(',').map(t => t.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast.error(`Tipo de arquivo não permitido. Permitidos: ${accept}`);
      return false;
    }

    return true;
  };

  const handleFileChange = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
      toast.success('Arquivo selecionado com sucesso');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = () => {
    setFile(null);
    onFileSelect(null as any);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {!file ? (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
            <Upload className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-center mb-1">
              Arraste e solte ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground text-center">
              {accept} • Máximo {maxSize}MB
            </p>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) handleFileChange(selectedFile);
              }}
            />
          </label>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
