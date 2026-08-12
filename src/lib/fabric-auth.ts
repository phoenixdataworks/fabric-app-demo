import type { FabricAuthOptions } from '@microsoft/rayfin-auth-provider-fabric';

export function getFabricAuthOptions(): FabricAuthOptions {
  const workspaceId = import.meta.env.VITE_FABRIC_WORKSPACE_ID;
  const projectId = import.meta.env.VITE_FABRIC_ITEM_ID;
  const fabricPortalUrl = import.meta.env.VITE_FABRIC_PORTAL_URL;

  if (!workspaceId || !projectId || !fabricPortalUrl) {
    throw new Error(
      'Fabric auth requires VITE_FABRIC_WORKSPACE_ID, VITE_FABRIC_ITEM_ID, and VITE_FABRIC_PORTAL_URL.',
    );
  }

  return {
    workspaceId,
    projectId,
    fabricPortalUrl,
    returnOrigin: window.location.origin,
  };
}
