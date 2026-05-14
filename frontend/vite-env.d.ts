/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  // si tu gardes tes autres variables
  readonly VITE_API_URL?: string;
  readonly VITE_USE_MOCKS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Déclaration pour les imports CSS dans TypeScript
declare module "*.css" {
  const content: string;
  export default content;
}

// Déclaration pour les modules sans types
declare module "leaflet.heat" {
  const heatLayer: any;
  export default heatLayer;
}