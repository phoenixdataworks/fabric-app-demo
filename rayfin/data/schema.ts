import { AnalyticsAsset } from './AnalyticsAsset.js';
import { AnalyticsAssetAllowedGroup } from './AnalyticsAssetAllowedGroup.js';
import { UserAssetEvent } from './UserAssetEvent.js';

export type DemoSchema = {
  AnalyticsAsset: AnalyticsAsset;
  AnalyticsAssetAllowedGroup: AnalyticsAssetAllowedGroup;
  UserAssetEvent: UserAssetEvent;
};

export const schema = [
  AnalyticsAsset,
  AnalyticsAssetAllowedGroup,
  UserAssetEvent,
];
