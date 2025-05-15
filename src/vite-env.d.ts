
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_ENV: 'development' | 'preview' | 'production'
  readonly VITE_LOVABLE_PREVIEW: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
}
