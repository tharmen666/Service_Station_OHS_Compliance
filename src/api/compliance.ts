export interface StatutoryComplianceRequest {
  taskType: 'HIRA' | 'SWP' | 'Incident Root Cause' | 'Toolbox Talk' | string;
  siteContext?: string;
  hazards: string;
}

export interface StatutoryComplianceResponse {
  success: boolean;
  document: string;
  timestamp: string;
  metadata: {
    statutoryFrameworks: string[];
    hierarchyOfControlsApplied: boolean;
    engineVersion: string;
  };
}
