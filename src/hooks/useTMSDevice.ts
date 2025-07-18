import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';

interface DeviceInfo {
  fingerprint: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop';
  browserInfo: {
    userAgent: string;
    language: string;
    platform: string;
    screenResolution: string;
    timezone: string;
  };
}

export const useTMSDevice = () => {
  const { user } = useAuth();
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isTrusted, setIsTrusted] = useState(false);

  // Gerar fingerprint único do dispositivo
  const generateDeviceFingerprint = (): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      screen.width + 'x' + screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas.toDataURL()
    ].join('|');

    return btoa(fingerprint).slice(0, 32);
  };

  // Detectar tipo de dispositivo
  const detectDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  // Gerar nome amigável do dispositivo
  const generateDeviceName = (type: string): string => {
    const browser = navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                   navigator.userAgent.includes('Firefox') ? 'Firefox' :
                   navigator.userAgent.includes('Safari') ? 'Safari' : 'Browser';
    
    const platform = navigator.platform.includes('Win') ? 'Windows' :
                    navigator.platform.includes('Mac') ? 'Mac' :
                    navigator.platform.includes('Linux') ? 'Linux' : 'Unknown';

    return `${browser} em ${platform} (${type})`;
  };

  // Registrar dispositivo
  const registerDevice = async (trusted: boolean = false) => {
    if (!user || !deviceInfo) return;

    const { error } = await supabase
      .from('user_devices')
      .upsert({
        user_id: user.id,
        device_fingerprint: deviceInfo.fingerprint,
        device_name: deviceInfo.name,
        device_type: deviceInfo.type,
        browser_info: deviceInfo.browserInfo,
        is_trusted: trusted,
        last_accessed_at: new Date().toISOString()
      });

    if (!error) {
      setIsRegistered(true);
      setIsTrusted(trusted);
    }

    return !error;
  };

  // Verificar se dispositivo está registrado
  const checkDeviceRegistration = async () => {
    if (!user || !deviceInfo) return;

    const { data, error } = await supabase
      .from('user_devices')
      .select('is_trusted')
      .eq('user_id', user.id)
      .eq('device_fingerprint', deviceInfo.fingerprint)
      .single();

    if (data && !error) {
      setIsRegistered(true);
      setIsTrusted(data.is_trusted);
      
      // Atualizar último acesso
      await supabase
        .from('user_devices')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('device_fingerprint', deviceInfo.fingerprint);
    }
  };

  // Log de acesso (simplificado por enquanto)
  const logAccess = async (action: string, metadata: any = {}) => {
    if (!user || !deviceInfo) return;
    
    // Log no console por enquanto até implementarmos a tabela de logs
    console.log('TMS Access Log:', {
      user_id: user.id,
      device_fingerprint: deviceInfo.fingerprint,
      action,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...metadata
    });
  };

  useEffect(() => {
    const fingerprint = generateDeviceFingerprint();
    const type = detectDeviceType();
    const name = generateDeviceName(type);

    const info: DeviceInfo = {
      fingerprint,
      name,
      type,
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    setDeviceInfo(info);
  }, []);

  useEffect(() => {
    if (user && deviceInfo) {
      checkDeviceRegistration();
      logAccess('page_access');
    }
  }, [user, deviceInfo]);

  return {
    deviceInfo,
    isRegistered,
    isTrusted,
    registerDevice,
    logAccess
  };
};