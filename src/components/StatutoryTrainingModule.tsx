import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download, 
  ExternalLink, 
  FileText, 
  FileCheck, 
  Search, 
  Users, 
  Flame, 
  HeartPulse, 
  Scale, 
  BookOpen, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  Calendar, 
  X, 
  Printer, 
  Building2,
  AlertOctagon,
  Shield,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Language, translations } from '../data/translations';
import { getActiveTenant } from '../multiTenantConfig';

export interface StatutoryCourse {
  id: string;
  code: string;
  title: string;
  category: 'First Aid' | 'Firefighting' | 'Risk Assessment' | 'SHE Rep' | 'Spill Response' | 'Evacuation';
  statutoryReference: string;
  accreditationBody: string;
  accreditationNumber: string;
  targetAudience: string;
  minimumStatutoryRatio: string;
  certifiedStaffCount: number;
  totalRequiredStaff: number;
  lastAuditDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'RENEWAL_DUE';
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  keyCompetencies: string[];
  trainingPack: {
    title: string;
    description: string;
    fileCount: number;
    totalSize: string;
    documents: { name: string; type: string; size: string; description: string }[];
    learningOutcomes: string[];
  };
  simulatorTabTarget?: string;
}

export interface StaffTrainingRecord {
  id: string;
  staffName: string;
  idNumberMasked: string;
  appointedRole: string;
  completedCourseTitle: string;
  certificateNumber: string;
  completionDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'RENEWAL_DUE';
}

interface StatutoryTrainingModuleProps {
  lang?: Language;
  onNavigateTab?: (tab: string) => void;
  onOpenCertModal?: () => void;
  onOpenStatutoryModal?: () => void;
}

export const StatutoryTrainingModule: React.FC<StatutoryTrainingModuleProps> = ({
  lang = 'EN',
  onNavigateTab,
  onOpenCertModal,
  onOpenStatutoryModal
}) => {
  const tenant = getActiveTenant();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VALID' | 'EXPIRING_SOON' | 'RENEWAL_DUE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPackCourse, setSelectedPackCourse] = useState<StatutoryCourse | null>(null);
  const [packDownloadSuccess, setPackDownloadSuccess] = useState<string | null>(null);

  // Statutory Courses Repository
  const statutoryCourses: StatutoryCourse[] = [
    {
      id: 'course-first-aid',
      code: 'OHS-FA-01',
      title: 'Basic First Aid Level 1 & Hydrocarbon Emergency Triage',
      category: 'First Aid',
      statutoryReference: 'General Safety Regulations 3(4) / OHS Act 85 of 1993 & SAQA US 119567',
      accreditationBody: 'SAQCC & Department of Employment and Labour (DEL)',
      accreditationNumber: 'SAQCC NO. 0011 | SDL Reg. NO. L860761032',
      targetAudience: 'Forecourt Attendants, Convenience Cashiers & First Aiders',
      minimumStatutoryRatio: 'Min 1 First Aider per 50 workers or 1 per operating forecourt shift',
      certifiedStaffCount: 8,
      totalRequiredStaff: 8,
      lastAuditDate: '2025-04-15',
      expiryDate: '2027-04-14',
      daysRemaining: 518,
      status: 'VALID',
      icon: HeartPulse,
      accentColor: 'text-rose-400',
      borderColor: 'border-rose-500/40 hover:border-rose-500',
      bgColor: 'bg-rose-500/10',
      keyCompetencies: [
        'CPR & automated external defibrillator (AED) protocol',
        'Hydrocarbon ingestion triage (Strict prohibition: NEVER induce vomiting)',
        'Chemical eye splashes & 15-minute eye irrigation flush',
        'Flash burn dressing & heat exhaustion triage',
        'Emergency services dispatch (10177 / 112) & patient handover'
      ],
      trainingPack: {
        title: 'Basic First Aid Level 1 & Hydrocarbon Triage Training Pack',
        description: 'Complete training manual, laminated forecourt first aid charts, chemical exposure SDS checklists, and certified first aider appointment letters.',
        fileCount: 4,
        totalSize: '4.8 MB',
        documents: [
          { name: 'Forecourt_Hydrocarbon_First_Aid_Manual_L1.pdf', type: 'PDF Guide', size: '2.4 MB', description: 'Comprehensive manual covering chemical burns, fuel aspiration, and CPR' },
          { name: 'Hydrocarbon_Ingestion_Emergency_Poster.pdf', type: 'Laminated Poster', size: '1.1 MB', description: 'Zero-vomiting alert and 15-minute water flush procedures' },
          { name: 'First_Aider_Statutory_Appointment_GSR3.docx', type: 'Legal Appointment', size: '280 KB', description: 'Formal Section 16.2 legal appointment letter for elected first aiders' },
          { name: 'Forecourt_First_Aid_Box_Monthly_Audit_Checklist.pdf', type: 'Inspection Form', size: '1.0 MB', description: 'Mandatory minimum stock checklist under GSR Regulation 3 annexure' }
        ],
        learningOutcomes: [
          'Recognize signs of chemical inhalation and benzene vapor intoxication.',
          'Execute immediate decontamination without introducing static sparks.',
          'Prevent chemical pneumonitis caused by fuel aspiration into lungs.',
          'Maintain forecourt first aid kits to Department of Labour compliance standards.'
        ]
      },
      simulatorTabTarget: 'firstResponder'
    },
    {
      id: 'course-firefighting',
      code: 'OHS-FF-02',
      title: 'Basic Firefighting & Equipment Handling (P.A.S.S. Method)',
      category: 'Firefighting',
      statutoryReference: 'Environmental Regulations for Workplaces 9 / SANS 10089-1 & SANS 10105',
      accreditationBody: 'SABS Fire Protection Authority & SAQCC Fire Registry',
      accreditationNumber: 'SAQCC NO. 0011 | SANS 10105 CERT-774',
      targetAudience: 'Forecourt Attendants, Supervisors & Tanker Offloading Marshals',
      minimumStatutoryRatio: 'Min 1 Fire Marshal per 25 employees / 2 marshals per shift',
      certifiedStaffCount: 12,
      totalRequiredStaff: 12,
      lastAuditDate: '2024-12-20',
      expiryDate: '2026-12-19',
      daysRemaining: 38,
      status: 'EXPIRING_SOON',
      icon: Flame,
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-500/40 hover:border-amber-500',
      bgColor: 'bg-amber-500/10',
      keyCompetencies: [
        '9kg DCP (Dry Chemical Powder) & CO2 extinguisher handling',
        'P.A.S.S. method: Pull pin, Aim low, Squeeze lever, Sweep across base',
        'Class B flammable liquid hydrocarbon fires & re-ignition control',
        'Emergency Stop Device (ESD) activation within 2 seconds',
        'Upwind fire attack posture & emergency egress path maintenance'
      ],
      trainingPack: {
        title: 'Forecourt PASS Firefighting & Extinguisher Pack',
        description: 'Standard operating procedure for 9kg DCP extinguishers, fire drill attendance rosters, monthly extinguisher pressure inspection logs, and fire marshal appointment forms.',
        fileCount: 4,
        totalSize: '6.2 MB',
        documents: [
          { name: 'SANS_10089_Forecourt_Firefighting_SOP.pdf', type: 'SOP Document', size: '3.1 MB', description: 'Official SABS 1910 standard operating procedure for retail forecourts' },
          { name: 'PASS_Firefighting_Technique_Visual_Guide.pdf', type: 'Visual Guide', size: '1.8 MB', description: 'Step-by-step diagram of 3-4.5m standoff distance and sweeping technique' },
          { name: 'Fire_Marshal_Legal_Appointment_Letter.docx', type: 'Appointment Letter', size: '310 KB', description: 'Statutory appointment under ERW Regulation 9 for forecourt fire marshals' },
          { name: 'Monthly_Extinguisher_Pressure_Gauge_Audit_Sheet.pdf', type: 'Audit Sheet', size: '990 KB', description: 'Checklist for tamper seals, pressure indicators, and hose integrity' }
        ],
        learningOutcomes: [
          'Master the P.A.S.S. technique under simulated forecourt flame conditions.',
          'Identify Class B hydrocarbon fires and avoid hazardous water-jet applications.',
          'Isolate dispenser electrical feeds via ESD before commencing firefighting.',
          'Conduct monthly visual inspections on all 9kg DCP units and hose reels.'
        ]
      },
      simulatorTabTarget: 'fire'
    },
    {
      id: 'course-risk-assessment',
      code: 'OHS-RA-03',
      title: 'Hazard Identification & Risk Assessment (HIRA Master)',
      category: 'Risk Assessment',
      statutoryReference: 'Section 8(2)(b) OHS Act 85 of 1993 & Major Hazard Installation Regulations',
      accreditationBody: 'Department of Employment and Labour (DEL) & HWSETA',
      accreditationNumber: 'DEL HIRA-REC-9042 / SABS SANS 10089-3',
      targetAudience: 'Section 16.2 Managers, Site Supervisors & Safety Officers',
      minimumStatutoryRatio: 'Mandatory for all Site Managers, Section 16.2 Assignees & Shift Leaders',
      certifiedStaffCount: 4,
      totalRequiredStaff: 4,
      lastAuditDate: '2025-08-10',
      expiryDate: '2027-08-09',
      daysRemaining: 636,
      status: 'VALID',
      icon: Shield,
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/40 hover:border-cyan-500',
      bgColor: 'bg-cyan-500/10',
      keyCompetencies: [
        'Baseline Risk Assessment (BRA) & Continuous Risk Assessment (CRA)',
        '5x5 Likelihood vs Severity risk rating matrix computation',
        'Tanker bulk offloading risks: static electricity, hose blowout & overfill',
        'Wetstock loss & underground pipe integrity monitoring',
        'Safe Work Procedures (SWP) formulation & Toolbox Talk delivery'
      ],
      trainingPack: {
        title: 'Forecourt HIRA & Baseline Risk Assessment Pack',
        description: 'Comprehensive baseline risk assessment register, generic forecourt hazard identification matrices, daily pre-shift inspection sheets, and Section 24 incident escalation templates.',
        fileCount: 4,
        totalSize: '5.4 MB',
        documents: [
          { name: 'Service_Station_Baseline_Risk_Assessment_Full.docx', type: 'Word Matrix', size: '2.5 MB', description: 'Complete 30-hazard forecourt baseline risk assessment matrix' },
          { name: 'Forecourt_Daily_Risk_Assessment_Checklist.docx', type: 'Daily Checklist', size: '640 KB', description: 'Shift-by-shift dynamic hazard identification checklist' },
          { name: 'Section_24_Incident_Reporting_Workflow_COIDA.pdf', type: 'Regulatory Guide', size: '1.3 MB', description: 'Mandatory Department of Labour incident escalation workflow' },
          { name: 'Toolbox_Talk_Weekly_Statutory_Briefing_Packs.pdf', type: 'Briefing Pack', size: '980 KB', description: '12 weekly micro-briefings for morning and night forecourt shifts' }
        ],
        learningOutcomes: [
          'Calculate residual risk scores using the statutory 5x5 matrix.',
          'Audit dispenser shear valves, breakaway couplings, and tank vent pipes.',
          'Execute statutory Section 24 reporting within mandatory legal timelines.',
          'Lead effective 60-second forecourt safety toolbox talks.'
        ]
      },
      simulatorTabTarget: 'rsdChecklists'
    },
    {
      id: 'course-she-rep',
      code: 'OHS-SHE-04',
      title: 'Health & Safety Representative (SHE Rep Statutory Duties)',
      category: 'SHE Rep',
      statutoryReference: 'Section 17 & 18 OHS Act 85 of 1993 / General Administrative Regs 6',
      accreditationBody: 'National OHS Institute & Registered Committee Custodian',
      accreditationNumber: 'SAQCC NO. 0011 | SDL Reg. NO. L860761032',
      targetAudience: 'Elected Health & Safety Representatives & Committee Members',
      minimumStatutoryRatio: 'Min 1 SHE Rep per 50 workers (Forecourt appointed: 3 elected reps)',
      certifiedStaffCount: 3,
      totalRequiredStaff: 3,
      lastAuditDate: '2024-02-01',
      expiryDate: '2027-01-31',
      daysRemaining: 446,
      status: 'VALID',
      icon: Scale,
      accentColor: 'text-purple-400',
      borderColor: 'border-purple-500/40 hover:border-purple-500',
      bgColor: 'bg-purple-500/10',
      keyCompetencies: [
        'Statutory workplace inspection rights & monthly reporting format',
        'Review effectiveness of health and safety measures (OHSA Sec 18)',
        'Investigation of employee complaints, incidents & near-misses',
        'Employee statutory right to refuse imminently dangerous work (BCEA/OHSA)',
        'Representation at statutory Health & Safety Committee meetings'
      ],
      trainingPack: {
        title: 'SHE Representative Statutory Governance & Manual Pack',
        description: '23-slide SHE Rep training presentation, Section 17 nomination and election ballots, quarterly committee meeting agenda templates, and workplace inspection audit registers.',
        fileCount: 4,
        totalSize: '7.8 MB',
        documents: [
          { name: 'SHE_REP_Training_Manual_Presentation.pptx', type: '23-Slide PPTX', size: '4.2 MB', description: 'Complete statutory training presentation covering Section 17 & 18 duties' },
          { name: 'SHE_Rep_Monthly_Workplace_Inspection_Register.docx', type: 'Inspection Register', size: '820 KB', description: 'Official monthly audit inspection register for forecourt and convenience store' },
          { name: 'Section_17_Elected_Representative_Appointment.docx', type: 'Appointment Letter', size: '340 KB', description: 'Statutory appointment signed by Section 16.1 CEO or 16.2 manager' },
          { name: 'Statutory_Employee_Rights_Wall_Poster_SANS.pdf', type: 'Printable Poster', size: '2.4 MB', description: 'BCEA work week, overtime rates, and right to refuse dangerous work summary' }
        ],
        learningOutcomes: [
          'Conduct comprehensive monthly physical inspections of forecourt and retail areas.',
          'Handle worker safety grievances and escalate imminent hazards to management.',
          'Review health and safety committee minutes and monitor corrective action closure.',
          'Verify contractor compliance and Permit-to-Work adherence on site.'
        ]
      },
      simulatorTabTarget: 'rights'
    },
    {
      id: 'course-spill-containment',
      code: 'OHS-SP-05',
      title: 'Forecourt Bulk Spill Containment & Hydrocarbon Waste Protocol',
      category: 'Spill Response',
      statutoryReference: 'National Environmental Management Act (NEMA 107 of 1998) & SANS 10263',
      accreditationBody: 'Environmental Management Inspectorate & SABS Standards',
      accreditationNumber: 'SANS 10263-ENV-310 | DEL COMP-09',
      targetAudience: 'Forecourt Attendants, Maintenance Crew & Tanker Custodians',
      minimumStatutoryRatio: 'All forecourt attendants and tanker offloading supervisors',
      certifiedStaffCount: 10,
      totalRequiredStaff: 10,
      lastAuditDate: '2025-05-16',
      expiryDate: '2027-05-15',
      daysRemaining: 549,
      status: 'VALID',
      icon: ShieldCheck,
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40 hover:border-emerald-500',
      bgColor: 'bg-emerald-500/10',
      keyCompetencies: [
        '4-Role spill containment team: Fetcher, Applicator, Sweeper, Disposer',
        'Hydrophobic peat absorbent application and storm drain boom placement',
        'Non-sparking polypropylene tools (Zero steel spark hazard)',
        'Cradle-to-grave hazardous waste manifest documentation',
        'Emergency separator pit inspection and municipal spill reporting'
      ],
      trainingPack: {
        title: 'Forecourt Hydrocarbon Spill Teamwork & Containment Pack',
        description: '8-step spill response procedure diagrams, 4-role teamwork action cards, hazardous waste manifest templates, and spill kit restocking audit forms.',
        fileCount: 4,
        totalSize: '4.5 MB',
        documents: [
          { name: 'SANS_10263_8_Step_Spill_Response_SOP.pdf', type: 'SOP Document', size: '2.2 MB', description: 'Official 8-step protocol for spills exceeding 5 liters' },
          { name: 'Spill_Teamwork_4_Role_Action_Cards.pdf', type: 'Pocket Cards', size: '1.1 MB', description: 'Field assignment cards for Fetcher, Applicator, Sweeper, and Disposer' },
          { name: 'Hazardous_Chemical_Waste_Manifest_Register.docx', type: 'Legal Register', size: '320 KB', description: 'Cradle-to-grave manifest tracking contaminated absorbent disposal' },
          { name: 'Spill_Kit_Contents_Monthly_Inventory_Checklist.pdf', type: 'Audit Sheet', size: '890 KB', description: 'Checklist for booms, peat moss bags, nitrile gloves, and yellow bags' }
        ],
        learningOutcomes: [
          'Mobilize the 4-role spill response team within 45 seconds of a spill event.',
          'Contain fuels before any hydrocarbon enters storm drains or municipal sewers.',
          'Safely handle and manifest hazardous waste in accordance with NEMA regulations.',
          'Restore forecourt lane operations safely following complete spill encapsulation.'
        ]
      },
      simulatorTabTarget: 'spill'
    },
    {
      id: 'course-evacuation-esd',
      code: 'OHS-EV-06',
      title: 'Emergency Evacuation & ESD Shutoff Master Protocol',
      category: 'Evacuation',
      statutoryReference: 'Major Hazard Installation Regulations & SANS 10089-1 Standard',
      accreditationBody: 'Department of Employment and Labour & Emergency Services',
      accreditationNumber: 'DEL MHI-EVAC-441 / SANS 10089-1',
      targetAudience: 'Entire Station Workforce, Shop Cashiers, Car Wash & Tenants',
      minimumStatutoryRatio: '100% of all site personnel (Annual statutory evacuation drill)',
      certifiedStaffCount: 24,
      totalRequiredStaff: 26,
      lastAuditDate: '2025-10-31',
      expiryDate: '2026-10-31',
      daysRemaining: -11,
      status: 'RENEWAL_DUE',
      icon: AlertOctagon,
      accentColor: 'text-red-400',
      borderColor: 'border-red-500/40 hover:border-red-500',
      bgColor: 'bg-red-500/10',
      keyCompetencies: [
        '9-step emergency evacuation sequence execution',
        '2-second Emergency Stop Device (ESD) mushroom button slam',
        'Forecourt traffic blockade & vehicle ignition shut-down instructions',
        'Shop, bakery and back-office sweep by designated floor wardens',
        'Head count roll call at upwind assembly point & emergency handover'
      ],
      trainingPack: {
        title: '9-Step Evacuation & ESD Isolation Master Pack',
        description: 'Site evacuation plan diagrams, assembly point roll call sheets, emergency grab-pack checklists, and evacuation drill observer audit forms.',
        fileCount: 4,
        totalSize: '5.9 MB',
        documents: [
          { name: '9_Step_Forecourt_Emergency_Evacuation_Plan.pdf', type: 'Site Protocol', size: '2.8 MB', description: 'Step-by-step master plan with color-coded assembly zone routes' },
          { name: 'Emergency_Grab_Pack_Inventory_Checklist.pdf', type: 'Audit Sheet', size: '750 KB', description: 'Mandatory items for supervisor grab-pack (roster, torch, SDS, megaphone)' },
          { name: 'Assembly_Point_Roll_Call_Register.docx', type: 'Roster Sheet', size: '310 KB', description: 'Head-count logbook for accounting for staff, motorists, and contractors' },
          { name: 'Annual_Evacuation_Drill_Observation_Report_DEL.pdf', type: 'Statutory Report', size: '2.0 MB', description: 'Official report submitted to Department of Labour following drill' }
        ],
        learningOutcomes: [
          'Execute site-wide electrical and pump isolation within 3 seconds of emergency.',
          'Direct panicked motorists and pedestrians calmly upwind to the assembly point.',
          'Account for 100% of shift personnel, visitors, and delivery drivers on site.',
          'Deliver clear scene handover briefings to arriving municipal emergency services.'
        ]
      },
      simulatorTabTarget: 'evacuation'
    }
  ];

  // Staff Training Register Roster (from certified audit records)
  const staffTrainingRegister: StaffTrainingRecord[] = [
    {
      id: 'REC-001',
      staffName: 'Brian Martyn',
      idNumberMasked: '920625****084',
      appointedRole: 'Senior Forecourt Attendant',
      completedCourseTitle: 'Basic First Aid Level 1 & Hydrocarbon Emergency Triage',
      certificateNumber: 'SAQCC-FA-0011-884',
      completionDate: '2025-04-15',
      expiryDate: '2027-04-14',
      daysRemaining: 518,
      status: 'VALID'
    },
    {
      id: 'REC-002',
      staffName: 'Brian Martyn',
      idNumberMasked: '920625****084',
      appointedRole: 'Senior Forecourt Attendant',
      completedCourseTitle: 'Basic Firefighting & Equipment Handling (P.A.S.S.)',
      certificateNumber: 'SAQCC-FF-0011-912',
      completionDate: '2024-12-20',
      expiryDate: '2026-12-19',
      daysRemaining: 38,
      status: 'EXPIRING_SOON'
    },
    {
      id: 'REC-003',
      staffName: 'Calvin Muthali',
      idNumberMasked: '881014****089',
      appointedRole: 'Forecourt Attendant & First Aider',
      completedCourseTitle: 'Basic First Aid Level 1 & Hydrocarbon Emergency Triage',
      certificateNumber: 'SAQCC-FA-0011-890',
      completionDate: '2025-04-15',
      expiryDate: '2027-04-14',
      daysRemaining: 518,
      status: 'VALID'
    },
    {
      id: 'REC-004',
      staffName: 'Innocent Shabalala',
      idNumberMasked: '940302****081',
      appointedRole: 'Cashier Supervisor & First Aider',
      completedCourseTitle: 'Basic First Aid Level 1 & Hydrocarbon Emergency Triage',
      certificateNumber: 'SDL-L860761032-FA03',
      completionDate: '2025-04-15',
      expiryDate: '2027-04-14',
      daysRemaining: 518,
      status: 'VALID'
    },
    {
      id: 'REC-005',
      staffName: 'Lebo Thabethe',
      idNumberMasked: '970317****089',
      appointedRole: 'Elected SHE Representative',
      completedCourseTitle: 'Health & Safety Representative (SHE Rep Statutory Duties)',
      certificateNumber: 'SAQCC-SHE-0011-551',
      completionDate: '2024-02-01',
      expiryDate: '2027-01-31',
      daysRemaining: 446,
      status: 'VALID'
    },
    {
      id: 'REC-006',
      staffName: 'Lebo Thabethe',
      idNumberMasked: '970317****089',
      appointedRole: 'Elected SHE Representative',
      completedCourseTitle: 'Hazard Identification & Risk Assessment (HIRA Master)',
      certificateNumber: 'DEL-HIRA-REC-9042',
      completionDate: '2025-08-10',
      expiryDate: '2027-08-09',
      daysRemaining: 636,
      status: 'VALID'
    },
    {
      id: 'REC-007',
      staffName: 'Siyabonga Dlamini',
      idNumberMasked: '950711****082',
      appointedRole: 'Forecourt Fire Marshal',
      completedCourseTitle: 'Basic Firefighting & Equipment Handling (P.A.S.S.)',
      certificateNumber: 'SAQCC-FF-0011-918',
      completionDate: '2024-12-20',
      expiryDate: '2026-12-19',
      daysRemaining: 38,
      status: 'EXPIRING_SOON'
    },
    {
      id: 'REC-008',
      staffName: 'Chen Shujiao',
      idNumberMasked: '770411****185',
      appointedRole: 'Section 16.2 Delegated Manager',
      completedCourseTitle: 'Hazard Identification & Risk Assessment (HIRA Master)',
      certificateNumber: 'DEL-HIRA-16.2-701',
      completionDate: '2025-08-10',
      expiryDate: '2027-08-09',
      daysRemaining: 636,
      status: 'VALID'
    }
  ];

  // Filtering Logic
  const filteredCourses = statutoryCourses.filter((course) => {
    const matchesStatus = 
      activeFilter === 'ALL' ||
      (activeFilter === 'VALID' && course.status === 'VALID') ||
      (activeFilter === 'EXPIRING_SOON' && course.status === 'EXPIRING_SOON') ||
      (activeFilter === 'RENEWAL_DUE' && course.status === 'RENEWAL_DUE');

    const matchesCategory = 
      categoryFilter === 'ALL' || course.category === categoryFilter;

    const matchesQuery = 
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.statutoryReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.keyCompetencies.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesCategory && matchesQuery;
  });

  const totalCourses = statutoryCourses.length;
  const validCoursesCount = statutoryCourses.filter(c => c.status === 'VALID').length;
  const expiringSoonCount = statutoryCourses.filter(c => c.status === 'EXPIRING_SOON').length;
  const renewalDueCount = statutoryCourses.filter(c => c.status === 'RENEWAL_DUE').length;

  const totalCertifiedSlots = statutoryCourses.reduce((acc, curr) => acc + curr.certifiedStaffCount, 0);
  const totalRequiredSlots = statutoryCourses.reduce((acc, curr) => acc + curr.totalRequiredStaff, 0);
  const overallComplianceRate = Math.round((totalCertifiedSlots / totalRequiredSlots) * 100);

  const handleDownloadPack = (course: StatutoryCourse) => {
    setPackDownloadSuccess(`Downloaded complete training pack for: ${course.title}`);
    setTimeout(() => setPackDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-12">
      
      {/* 1. Header & High-Level Telemetry Banner */}
      <div className="pos-card p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-[#0d1733] via-[#0b1329] to-[#070d1e] shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/40">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                Statutory OHS Competency Framework
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-black border border-cyan-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                OHS Act 85 of 1993 • SANS 10089-1
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black border border-emerald-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                SAQCC NO. 0011 Accredited
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              Statutory OHS Training & Competency Verification
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Mandatory compliance courses for petroleum forecourt retail: Basic First Aid, PASS Firefighting, Risk Assessment (HIRA), and SHE Representative statutory functions with live expiry tracking and downloadable training packs.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {onOpenCertModal && (
              <button
                onClick={onOpenCertModal}
                className="h-10 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-amber-950/50"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>Audit Certificate</span>
              </button>
            )}
            {onOpenStatutoryModal && (
              <button
                onClick={onOpenStatutoryModal}
                className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Generate Statutory Doc</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Summary Telemetry Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Compliance</div>
              <div className="text-xl md:text-2xl font-black text-emerald-400 mt-0.5">{overallComplianceRate}%</div>
              <div className="text-[10px] text-slate-400">{totalCertifiedSlots}/{totalRequiredSlots} Appointed Slots</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valid In-Standard</div>
              <div className="text-xl md:text-2xl font-black text-cyan-400 mt-0.5">{validCoursesCount}</div>
              <div className="text-[10px] text-slate-400">Courses Fully Current</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Expiring Soon</div>
              <div className="text-xl md:text-2xl font-black text-amber-400 mt-0.5">{expiringSoonCount}</div>
              <div className="text-[10px] text-amber-300/80">&lt; 60 Days Renewal Window</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Renewal Due</div>
              <div className="text-xl md:text-2xl font-black text-rose-400 mt-0.5">{renewalDueCount}</div>
              <div className="text-[10px] text-rose-300/80">Drill Refresher Needed</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification for Download */}
      {packDownloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{packDownloadSuccess}</span>
          </div>
          <button onClick={() => setPackDownloadSuccess(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Filter & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, statutes, or competencies (e.g., First Aid, P.A.S.S., HIRA, SHE Rep)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Courses ({totalCourses})
          </button>
          <button
            onClick={() => setActiveFilter('VALID')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeFilter === 'VALID'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-950 text-emerald-400 hover:text-white border border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Valid ({validCoursesCount})
          </button>
          <button
            onClick={() => setActiveFilter('EXPIRING_SOON')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeFilter === 'EXPIRING_SOON'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-950 text-amber-400 hover:text-white border border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Expiring Soon ({expiringSoonCount})
          </button>
          <button
            onClick={() => setActiveFilter('RENEWAL_DUE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeFilter === 'RENEWAL_DUE'
                ? 'bg-rose-500 text-white shadow-md font-black'
                : 'bg-slate-950 text-rose-400 hover:text-white border border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Renewal Due ({renewalDueCount})
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 text-xs font-bold whitespace-nowrap flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {['ALL', 'First Aid', 'Firefighting', 'Risk Assessment', 'SHE Rep', 'Spill Response', 'Evacuation'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              categoryFilter === cat
                ? 'bg-slate-200 text-slate-950 font-black'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Statutory Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const Icon = course.icon;
          const isExpiring = course.status === 'EXPIRING_SOON';
          const isRenewalDue = course.status === 'RENEWAL_DUE';
          const isValid = course.status === 'VALID';
          const percentProgress = Math.round((course.certifiedStaffCount / course.totalRequiredStaff) * 100);

          return (
            <div
              key={course.id}
              className={`p-5 rounded-3xl bg-slate-900/90 border transition-all duration-200 flex flex-col justify-between shadow-xl relative group ${
                isRenewalDue
                  ? 'border-red-500/50 hover:border-red-400'
                  : isExpiring
                  ? 'border-amber-500/50 hover:border-amber-400'
                  : 'border-slate-800 hover:border-cyan-500/60'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-xl ${course.bgColor} flex items-center justify-center border border-white/10`}>
                      <Icon className={`w-5 h-5 ${course.accentColor}`} />
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-slate-800 text-slate-300 border border-slate-700">
                        {course.code}
                      </span>
                      <span className="ml-1.5 text-[11px] font-bold text-slate-400">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isValid && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black flex items-center gap-1 whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Valid • {course.daysRemaining}d
                      </span>
                    )}
                    {isExpiring && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black flex items-center gap-1 whitespace-nowrap animate-pulse">
                        <Clock className="w-3 h-3 text-amber-400" />
                        Expiring Soon ({course.daysRemaining}d)
                      </span>
                    )}
                    {isRenewalDue && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black flex items-center gap-1 whitespace-nowrap">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        Renewal Overdue
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Title */}
                <h3 className="text-base font-black text-white leading-snug group-hover:text-amber-300 transition">
                  {course.title}
                </h3>

                {/* Statutory Reference */}
                <div className="mt-2 text-xs font-semibold text-cyan-300/90 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{course.statutoryReference}</span>
                </div>

                <div className="text-[11px] text-slate-400 mt-1">
                  Accreditation: <span className="text-slate-300 font-mono">{course.accreditationNumber}</span>
                </div>

                {/* Target Audience & Statutory Ratio */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
                  <div className="text-slate-400 text-[11px]">
                    <span className="font-bold text-slate-300">Statutory Mandate:</span> {course.minimumStatutoryRatio}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    <span className="font-bold text-slate-300">Audience:</span> {course.targetAudience}
                  </div>
                </div>

                {/* Course Completion Tracking Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Staff Completion:
                    </span>
                    <span className="font-mono font-black text-white">
                      {course.certifiedStaffCount}/{course.totalRequiredStaff} Certified ({percentProgress}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentProgress === 100
                          ? 'bg-emerald-400'
                          : percentProgress >= 75
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${percentProgress}%` }}
                    />
                  </div>
                </div>

                {/* Expiry Date Tracker */}
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Audited: {course.lastAuditDate}
                  </span>
                  <span className={`font-bold flex items-center gap-1 ${
                    isRenewalDue ? 'text-rose-400 font-black' : isExpiring ? 'text-amber-400 font-black' : 'text-slate-300'
                  }`}>
                    Expiry: {course.expiryDate}
                  </span>
                </div>

                {/* Key Competencies Preview */}
                <div className="mt-3 space-y-1">
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Key Competency Modules</div>
                  <ul className="text-xs text-slate-300 space-y-0.5">
                    {course.keyCompetencies.slice(0, 3).map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight text-slate-300">
                        <span className="text-amber-400 font-bold">•</span>
                        <span className="truncate">{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setSelectedPackCourse(course)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400/50 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  title="View and download full training pack with manuals, slides and checklists"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Training Pack</span>
                </button>

                {course.simulatorTabTarget && onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab(course.simulatorTabTarget!)}
                    className="py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500 font-bold text-xs transition flex items-center justify-center gap-1"
                    title="Launch interactive practical simulator drill in the platform"
                  >
                    <span>Launch Drill</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Staff Certification Audit Ledger (Compliance Expiry Dates & Records) */}
      <div className="pos-card p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1 border border-purple-500/30">
              <FileCheck className="w-3.5 h-3.5 text-purple-400" />
              Statutory Training Register (OHSA Section 8 & General Safety Reg 3)
            </div>
            <h3 className="text-xl font-black text-white">
              Individual Staff Training Records & Compliance Expiry Ledger
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              POPIA-compliant anonymized ledger verifying appointed station first aiders, fire marshals, SHE reps, and HIRA risk assessors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              Active Site: <strong className="text-amber-400">{tenant.siteCode}</strong> ({tenant.brandName})
            </span>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider bg-slate-950/60">
                <th className="py-3 px-3">Trainee / Personnel</th>
                <th className="py-3 px-3">Appointed Role</th>
                <th className="py-3 px-3">Certified Course</th>
                <th className="py-3 px-3 font-mono">Certificate #</th>
                <th className="py-3 px-3">Completion Date</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {staffTrainingRegister.map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-amber-400">
                        {record.staffName.charAt(0)}
                      </div>
                      <span>{record.staffName}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 ml-8">
                      ID: {record.idNumberMasked}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-semibold">
                    {record.appointedRole}
                  </td>
                  <td className="py-3 px-3 text-cyan-300 font-semibold max-w-[260px] truncate">
                    {record.completedCourseTitle}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-purple-300">
                    {record.certificateNumber}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">
                    {record.completionDate}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">
                    <span className={
                      record.status === 'EXPIRING_SOON'
                        ? 'text-amber-400'
                        : record.status === 'RENEWAL_DUE'
                        ? 'text-rose-400'
                        : 'text-slate-200'
                    }>
                      {record.expiryDate}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {record.status === 'VALID' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        VALID ({record.daysRemaining}d)
                      </span>
                    )}
                    {record.status === 'EXPIRING_SOON' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        EXPIRING ({record.daysRemaining}d)
                      </span>
                    )}
                    {record.status === 'RENEWAL_DUE' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        OVERDUE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Detailed Training Pack Modal / Lightbox */}
      {selectedPackCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="pos-card w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/50 bg-[#0b1329] p-6 shadow-2xl text-slate-100 space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${selectedPackCourse.bgColor} border border-white/10 flex items-center justify-center`}>
                  {React.createElement(selectedPackCourse.icon, { className: `w-6 h-6 ${selectedPackCourse.accentColor}` })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-slate-800 text-amber-300 border border-slate-700">
                      {selectedPackCourse.code}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      {selectedPackCourse.category} Training Pack
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-white mt-1">
                    {selectedPackCourse.trainingPack.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedPackCourse(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Statutory Compliance Metadata */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-cyan-300 font-semibold">
                <span className="text-slate-400 font-bold">Primary Statute:</span>
                <span>{selectedPackCourse.statutoryReference}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 font-bold">Accreditation:</span>
                <span className="font-mono text-purple-300">{selectedPackCourse.accreditationNumber}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 font-bold">Current Expiry:</span>
                <span className="font-mono text-amber-300 font-bold">{selectedPackCourse.expiryDate} ({selectedPackCourse.daysRemaining} days left)</span>
              </div>
            </div>

            {/* Description & Overview */}
            <div>
              <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider mb-1">
                Pack Overview & Curriculum Scope
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {selectedPackCourse.trainingPack.description}
              </p>
            </div>

            {/* Learning Outcomes */}
            <div>
              <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider mb-2">
                Mandatory Statutory Learning Outcomes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedPackCourse.trainingPack.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200 text-[11px] leading-tight">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Included Documents in Training Pack */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-black uppercase text-purple-400 tracking-wider">
                  Pack Files & Downloadable Resources ({selectedPackCourse.trainingPack.fileCount} Files • {selectedPackCourse.trainingPack.totalSize})
                </h4>
              </div>

              <div className="space-y-2">
                {selectedPackCourse.trainingPack.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-amber-500/50 transition flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {doc.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
                        {doc.size}
                      </span>
                      <button
                        onClick={() => handleDownloadPack(selectedPackCourse)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 transition"
                        title="Download document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div className="text-[11px] text-slate-400">
                Accredited under SAQCC & Department of Employment and Labour
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPackCourse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    handleDownloadPack(selectedPackCourse);
                    setSelectedPackCourse(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-950/60"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download Full Pack ({selectedPackCourse.trainingPack.totalSize})</span>
                </button>

                {selectedPackCourse.simulatorTabTarget && onNavigateTab && (
                  <button
                    onClick={() => {
                      const target = selectedPackCourse.simulatorTabTarget!;
                      setSelectedPackCourse(null);
                      onNavigateTab(target);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <span>Launch Drill</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

