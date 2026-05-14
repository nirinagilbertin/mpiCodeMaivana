/// <reference types="vite/client" />

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