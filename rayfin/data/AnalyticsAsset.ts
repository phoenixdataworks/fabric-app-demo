import {
  authenticated,
  boolean,
  date,
  entity,
  int,
  many,
  set,
  text,
  uuid,
} from '@microsoft/rayfin-core';

import { AnalyticsAssetAllowedGroup } from './AnalyticsAssetAllowedGroup.js';

@entity()
@authenticated('read')
@authenticated('create', 'update', 'delete')
export class AnalyticsAsset {
  @uuid() id!: string;
  @text({ min: 1, max: 200 }) title!: string;
  @text({ max: 2000, optional: true }) description?: string;
  @set('PowerBIReport', 'CustomPage', 'LegacyLink') type!:
    | 'PowerBIReport'
    | 'CustomPage'
    | 'LegacyLink';
  @set('draft', 'published', 'deprecated') status!:
    | 'draft'
    | 'published'
    | 'deprecated';
  @text({ min: 1, max: 100 }) domain!: string;
  @text({ max: 320 }) ownerUpn!: string;
  @text({ max: 500, optional: true }) thumbnailUrl?: string;
  @text({ max: 1000, optional: true }) externalUrl?: string;
  @text({ max: 64, optional: true }) workspaceId?: string;
  @text({ max: 64, optional: true }) reportId?: string;
  @text({ max: 64, optional: true }) datasetId?: string;
  @set('view', 'preview') embedMode!: 'view' | 'preview';
  @set('authenticated', 'restricted') visibilityMode!:
    | 'authenticated'
    | 'restricted';
  @boolean() isEndorsed!: boolean;
  @date({ optional: true }) lastRefreshed?: Date;
  @text({ max: 2000, optional: true }) tagsCsv?: string;
  @int({ optional: true }) sortOrder?: number;
  @date() createdAt!: Date;
  @date() updatedAt!: Date;
  @many(() => AnalyticsAssetAllowedGroup)
  allowedGroups?: AnalyticsAssetAllowedGroup[];
}
