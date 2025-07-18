-- Expandir tabela profiles com campos específicos do TMS
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS 
  default_company_settings JSONB DEFAULT '{}',
  ui_preferences JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{"email_notifications": true, "push_notifications": true}',
  last_device_info JSONB DEFAULT '{}',
  created_devices_count INTEGER DEFAULT 0;

-- Criar tabela para dispositivos conhecidos do usuário
CREATE TABLE IF NOT EXISTS public.user_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT, -- mobile, tablet, desktop
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

-- Criar tabela para logs de acesso/segurança
CREATE TABLE IF NOT EXISTS public.user_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_fingerprint TEXT,
  action TEXT NOT NULL, -- login, logout, data_access, sync
  ip_address TEXT,
  user_agent TEXT,
  location_info JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para backup de dados do usuário
CREATE TABLE IF NOT EXISTS public.user_data_backups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  backup_type TEXT NOT NULL, -- full, incremental, settings_only
  backup_data JSONB NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days')
);

-- Enable RLS em todas as novas tabelas
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_data_backups ENABLE ROW LEVEL SECURITY;

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

-- Políticas RLS para user_access_logs
CREATE POLICY "Users can view their own access logs"
ON public.user_access_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert access logs"
ON public.user_access_logs
FOR INSERT
WITH CHECK (true);

-- Políticas RLS para user_data_backups
CREATE POLICY "Users can manage their own backups"
ON public.user_data_backups
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para user_settings
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_settings_updated_at();

-- Função para limpeza automática de backups expirados
CREATE OR REPLACE FUNCTION public.cleanup_expired_backups()
RETURNS void AS $$
BEGIN
    DELETE FROM public.user_data_backups 
    WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Ativar realtime para sincronização
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_devices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_access_logs;