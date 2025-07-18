-- Expandir tabela profiles com campos específicos do TMS
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS default_company_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ui_preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{"email_notifications": true, "push_notifications": true}',
ADD COLUMN IF NOT EXISTS last_device_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS created_devices_count INTEGER DEFAULT 0;

-- Criar tabela para dispositivos conhecidos do usuário
CREATE TABLE IF NOT EXISTS public.user_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT,
  browser_info JSONB DEFAULT '{}',
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_trusted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, device_fingerprint)
);

-- Criar tabela para configurações centralizadas do usuário
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  device_specific BOOLEAN DEFAULT false,
  device_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, setting_key, device_fingerprint)
);

-- Enable RLS em todas as novas tabelas
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_devices
CREATE POLICY "Users can manage their own devices"
ON public.user_devices
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para user_settings
CREATE POLICY "Users can manage their own settings"
ON public.user_settings
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);