import RayfinClient from '@microsoft/rayfin-client';

let _client: RayfinClient<Record<string, unknown>> | undefined;

/** Minimal Rayfin client for Fabric portal auth handshake only (not entity APIs). */
export function getRayfinClient(): RayfinClient<Record<string, unknown>> {
  if (_client) {
    return _client;
  }

  const baseUrl = import.meta.env.VITE_RAYFIN_BASE_URL;
  const publishableKey = import.meta.env.VITE_RAYFIN_PUBLISHABLE_KEY;

  if (!baseUrl || !publishableKey) {
    throw new Error(
      'RayfinClient requires VITE_RAYFIN_BASE_URL and VITE_RAYFIN_PUBLISHABLE_KEY from your Fabric App item.',
    );
  }

  _client = new RayfinClient<Record<string, unknown>>({
    baseUrl,
    publishableKey,
  });

  return _client;
}
