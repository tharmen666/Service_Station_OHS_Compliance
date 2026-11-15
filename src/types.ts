export interface RemediationInfo {
  video_reference: string;
  video_path: string;
  timestamp_start: string;
  timestamp_end: string;
  remediation_guidance: string;
}

export interface Question {
  question_id: string;
  topic: 'Customer Service' | 'Emergency Spill Response' | 'Fire Safety' | 'Evacuation';
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  remediation: RemediationInfo;
}

export interface EvacuationStep {
  step_number: number;
  title: string;
  role: string;
  action: string;
  critical_warning: string;
  icon_name: string;
}

export interface SpillRole {
  role_id: string;
  title: string;
  primary_tool: string;
  step_action: string;
  safety_rule: string;
  badge_color: string;
}

