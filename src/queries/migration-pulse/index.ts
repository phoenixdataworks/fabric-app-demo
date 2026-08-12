import type { VisualizationSpec } from '@microsoft/fabric-visuals';

import adoptionTrendSpec from './adoption-trend.json';
import backlogByRiskSpec from './backlog-by-risk.json';
import reportMixSpec from './report-mix.json';
import teamReadinessSpec from './team-readiness.json';

export const adoptionTrendVegaSpec = adoptionTrendSpec as VisualizationSpec;
export const backlogByRiskVegaSpec = backlogByRiskSpec as VisualizationSpec;
export const reportMixVegaSpec = reportMixSpec as VisualizationSpec;
export const teamReadinessVegaSpec = teamReadinessSpec as VisualizationSpec;
