import type { VisualizationSpec } from '@microsoft/fabric-visuals';

import adoptionTrendSpec from './adoption-trend.json';
import reportMixSpec from './report-mix.json';
import teamReadinessSpec from './team-readiness.json';

export const adoptionTrendVegaSpec = adoptionTrendSpec as VisualizationSpec;
export const reportMixVegaSpec = reportMixSpec as VisualizationSpec;
export const teamReadinessVegaSpec = teamReadinessSpec as VisualizationSpec;

export {
  adoptionTrendColumnMetadata,
  adoptionTrendQuery,
  backlogColumnMetadata,
  backlogQuery,
  channelMixColumnMetadata,
  channelMixQuery,
  kpiColumnMetadata,
  kpiQuery,
  SEMANTIC_MODEL_CONNECTION,
  teamReadinessColumnMetadata,
  teamReadinessQuery,
} from './queries';
