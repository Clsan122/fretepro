import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { useTMSDevice } from './useTMSDevice';

export interface TMSSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    defaultView: 'cards' | 'table' | 'list';
    itemsPerPage: number;
    autoRefresh: boolean;
    refreshInterval: number;
  };
  freight: {
    defaultCurrency: 'BRL' | 'USD';
    defaultPaymentTerm: string;
    autoCalculateExpenses: boolean;
  };
  company: {
    defaultLogo: string;
    fiscalInfo: {
      cnpj: string;
      ie: string;
      address: string;
    };
  };
}

const defaultSettings: TMSSettings = {
  theme: 'system',
  language: 'pt-BR',
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  dashboard: {
    defaultView: 'cards',
    itemsPerPage: 10,
    autoRefresh: true,
    refreshInterval: 30000
  },
  freight: {
    defaultCurrency: 'BRL',
    defaultPaymentTerm: '30 dias',
    autoCalculateExpenses: true
  },
  company: {
    defaultLogo: '',
    fiscalInfo: {
      cnpj: '',
      ie: '',
      address: ''
    }
  }
};

export const useTMSSettings = () => {
  const { user } = useAuth();
  const { deviceInfo } = useTMSDevice();
  const [settings, setSettings] = useState<TMSSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Carregar configurações do usuário
  const loadSettings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Buscar configurações globais do usuário
      const { data: globalSettings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('device_specific', false);

      // Buscar configurações específicas do dispositivo
      const { data: deviceSettings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('device_specific', true)
        .eq('device_fingerprint', deviceInfo?.fingerprint || '');

      // Buscar dados do perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('ui_preferences, default_company_settings, notification_settings')
        .eq('id', user.id)
        .single();

      // Combinar todas as configurações
      let combinedSettings = { ...defaultSettings };

      // Aplicar configurações do perfil
      if (profile) {
        if (profile.ui_preferences && typeof profile.ui_preferences === 'object') {
          combinedSettings = { ...combinedSettings, ...(profile.ui_preferences as any) };
        }
        if (profile.default_company_settings && typeof profile.default_company_settings === 'object') {
          combinedSettings.company = { 
            ...combinedSettings.company, 
            ...(profile.default_company_settings as any)
          };
        }
        if (profile.notification_settings && typeof profile.notification_settings === 'object') {
          combinedSettings.notifications = { 
            ...combinedSettings.notifications, 
            ...(profile.notification_settings as any)
          };
        }
      }

      // Aplicar configurações globais
      globalSettings?.forEach(setting => {
        const keys = setting.setting_key.split('.');
        let current: any = combinedSettings;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = setting.setting_value;
      });

      // Aplicar configurações específicas do dispositivo (sobrescreve globais)
      deviceSettings?.forEach(setting => {
        const keys = setting.setting_key.split('.');
        let current: any = combinedSettings;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = setting.setting_value;
      });

      setSettings(combinedSettings);
      setLastSync(new Date());
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar configuração específica
  const saveSetting = async (
    key: string, 
    value: any, 
    deviceSpecific = false,
    updateProfile = false
  ) => {
    if (!user) return;

    try {
      if (updateProfile) {
        // Atualizar perfil diretamente
        const updateData: any = {};
        if (key.startsWith('ui_preferences.')) {
          updateData.ui_preferences = { 
            ...settings, 
            [key.replace('ui_preferences.', '')]: value 
          };
        } else if (key.startsWith('company.')) {
          updateData.default_company_settings = { 
            ...settings.company, 
            [key.replace('company.', '')]: value 
          };
        } else if (key.startsWith('notifications.')) {
          updateData.notification_settings = { 
            ...settings.notifications, 
            [key.replace('notifications.', '')]: value 
          };
        }

        await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);
      } else {
        // Salvar na tabela de configurações
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            setting_key: key,
            setting_value: value,
            device_specific: deviceSpecific,
            device_fingerprint: deviceSpecific ? deviceInfo?.fingerprint : null
          });
      }

      // Atualizar estado local
      const keys = key.split('.');
      const newSettings = { ...settings };
      let current: any = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      setSettings(newSettings);
      setLastSync(new Date());
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  // Sincronizar configurações com outros dispositivos
  const syncSettings = async () => {
    await loadSettings();
  };

  // Resetar configurações para padrão
  const resetSettings = async () => {
    if (!user) return;

    try {
      // Remover todas as configurações personalizadas
      await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', user.id);

      // Resetar campos do perfil
      await supabase
        .from('profiles')
        .update({
          ui_preferences: {},
          default_company_settings: {},
          notification_settings: defaultSettings.notifications
        })
        .eq('id', user.id);

      setSettings(defaultSettings);
      setLastSync(new Date());
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
    }
  };

  // Exportar configurações
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tms-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Importar configurações
  const importSettings = async (file: File) => {
    try {
      const text = await file.text();
      const importedSettings = JSON.parse(text);
      
      // Validar estrutura básica
      if (typeof importedSettings === 'object' && importedSettings.theme) {
        // Salvar todas as configurações importadas
        for (const [key, value] of Object.entries(importedSettings)) {
          await saveSetting(key, value);
        }
        
        await loadSettings();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao importar configurações:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user && deviceInfo) {
      loadSettings();
    }
  }, [user, deviceInfo]);

  // Sincronização em tempo real
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('settings-sync')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_settings',
        filter: `user_id=eq.${user.id}`
      }, () => {
        // Recarregar configurações quando houver mudanças
        loadSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    settings,
    isLoading,
    lastSync,
    saveSetting,
    syncSettings,
    resetSettings,
    exportSettings,
    importSettings,
    loadSettings
  };
};