import { authenticated, entity, one, text, uuid } from '@microsoft/rayfin-core';

import { AnalyticsAsset } from './AnalyticsAsset.js';

@entity()
@authenticated('read')
@authenticated('create', 'update', 'delete')
export class AnalyticsAssetAllowedGroup {
  @uuid() id!: string;
  @uuid() analytics_asset_id!: string;
  @text({ min: 1, max: 64 }) groupObjectId!: string;
  @one(() => AnalyticsAsset) asset!: AnalyticsAsset;
}
