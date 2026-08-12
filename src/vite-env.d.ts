/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FABRIC_WORKSPACE_ID?: string;
  readonly VITE_FABRIC_ITEM_ID?: string;
  readonly VITE_FABRIC_PORTAL_URL?: string;
  readonly VITE_RAYFIN_BASE_URL?: string;
  readonly VITE_RAYFIN_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
