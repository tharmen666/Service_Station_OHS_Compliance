export type JurisdictionCode = 'ZA' | 'KE' | 'TZ' | 'UG';

export interface RegionalRegulatoryPreset {
  code: JurisdictionCode;
  country: string;
  flag: string;
  regulators: string;
  statutoryReference: string;
  siteCode: string;
  siteName: string;
  currency: string;
  fiscalSystem: string;
  maxLossTolerancePct: number;
  maxLossToleranceLitres: number;
  emergencyNumber: string;
  regulatoryNotice: string;
}

export const EAST_AFRICA_PRESETS: Record<JurisdictionCode, RegionalRegulatoryPreset> = {
  ZA: {
    code: 'ZA',
    country: 'South Africa',
    flag: '🇿🇦',
    regulators: 'DMRE / DoEL',
    statutoryReference: 'SANS 10089-3 & OHSA 85',
    siteCode: 'ENG-JHB-042',
    siteName: 'Gauteng South Forecourt Hub',
    currency: 'ZAR',
    fiscalSystem: 'SARS eFiling / eBOL Verified',
    maxLossTolerancePct: 0.35,
    maxLossToleranceLitres: 50,
    emergencyNumber: '10177 / 112',
    regulatoryNotice: 'Compliant with DMRE Petroleum Products Act & SANS 10089-3 flammable liquid handling regulations.'
  },
  KE: {
    code: 'KE',
    country: 'Kenya',
    flag: '🇰🇪',
    regulators: 'EPRA',
    statutoryReference: 'KRA eTIMS Live & OSHA 2007',
    siteCode: 'NBO-MSA-018',
    siteName: 'Nairobi Mombasa Rd Energy Plaza',
    currency: 'KES',
    fiscalSystem: 'KRA eTIMS Fiscal Electronic Device',
    maxLossTolerancePct: 0.35,
    maxLossToleranceLitres: 50,
    emergencyNumber: '999 / 112',
    regulatoryNotice: 'Regulated by EPRA (Energy Act 2019) & OSHA 2007. Real-time fiscal offload tracking matched to KRA eTIMS.'
  },
  TZ: {
    code: 'TZ',
    country: 'Tanzania',
    flag: '🇹🇿',
    regulators: 'EWURA',
    statutoryReference: 'TRA EFD / VFD & OSHA 2003',
    siteCode: 'DAR-KIG-009',
    siteName: 'Dar es Salaam Kigamboni Marine Hub',
    currency: 'TZS',
    fiscalSystem: 'TRA EFD / VFD Electronic Fiscal Device',
    maxLossTolerancePct: 0.35,
    maxLossToleranceLitres: 50,
    emergencyNumber: '112 / 114',
    regulatoryNotice: 'Licensed under EWURA Petroleum General Regulations & OSHA 2003. TRA EFD automated receipting active.'
  },
  UG: {
    code: 'UG',
    country: 'Uganda',
    flag: '🇺🇬',
    regulators: 'PAU / MEMD',
    statutoryReference: 'URA EFRIS Live & OSH Act 2006',
    siteCode: 'KLA-ENT-014',
    siteName: 'Kampala Entebbe Corridor Station',
    currency: 'UGX',
    fiscalSystem: 'URA EFRIS Electronic Fiscal Receipting',
    maxLossTolerancePct: 0.35,
    maxLossToleranceLitres: 50,
    emergencyNumber: '999 / 112',
    regulatoryNotice: 'Monitored by Petroleum Authority of Uganda (PAU) & Ministry of Energy. Real-time URA EFRIS tax invoice matching.'
  }
};

export interface KiswahiliTranslations {
  evacuation: {
    badge: string;
    title: string;
    subtitle: string;
    esdPrompt: string;
    assemblyPoint: string;
  };
  spillContainment: {
    badge: string;
    title: string;
    subtitle: string;
    peatMossRule: string;
    drainWarning: string;
  };
  firefighting: {
    badge: string;
    title: string;
    subtitle: string;
    passSteps: {
      pull: string;
      aim: string;
      squeeze: string;
      sweep: string;
    };
  };
  wetstockOffload: {
    badge: string;
    title: string;
    subtitle: string;
    interlockTitle: string;
    reconciliationTitle: string;
    shrinkageAlert: string;
    commitAuditBtn: string;
  };
}

export const KISWAHILI_REGIONAL_TRANSLATIONS: KiswahiliTranslations = {
  evacuation: {
    badge: 'Mwongozo wa Uokoaji wa Dharura',
    title: 'Itifaki ya Kuzima ya Dharura (ESD) na Uokoaji',
    subtitle: 'Hatua 9 za haraka za uokoaji wa kituo cha mafuta na kuzima umeme na pampu mara moja.',
    esdPrompt: 'Bonyeza Kitufe cha Dharura cha ESD ndani ya sekunde 2',
    assemblyPoint: 'Kusanyika kwenye Eneo Salama Lililo Juu ya Upepo'
  },
  spillContainment: {
    badge: 'Udhibiti wa Uvujaji wa Mafuta',
    title: 'Udhibiti wa Uvujaji na Uzuiaji wa Mafuta Kuingia Mitaroni',
    subtitle: 'Wajibu 4 wa wahudumu na hatua 8 za kuzuia moto na uchafuzi wa mazingira.',
    peatMossRule: 'Tumia Majembe ya Plastiki Pekee (Yasiyotoa Cheche)',
    drainWarning: 'Funga mara moja valvu za dhoruba kabla ya kusafisha'
  },
  firefighting: {
    badge: 'Zima Moto Forecourt',
    title: 'Mbinu ya PASS ya Kizima Moto cha Poda Kavu (9kg DCP)',
    subtitle: 'Njia sanifu ya kuzima moto wa petroli na dizeli kwa usalama.',
    passSteps: {
      pull: 'P - Vuta pini ya usalama (Pull)',
      aim: 'A - Lenga chini kwenye mzizi wa moto (Aim)',
      squeeze: 'S - Finya kishikio cha mtungi (Squeeze)',
      sweep: 'S - Tikisa kushoto na kulia kwa utulivu (Sweep)'
    }
  },
  wetstockOffload: {
    badge: 'LogiGuard Sentinel Bridge',
    title: 'Upakuaji wa Mafuta na Ulinganishaji wa Wetstock',
    subtitle: 'Uthibitishaji wa usalama wa RSD 26 na ulinganishaji wa kiwango cha mafuta chini ya ardhi.',
    interlockTitle: 'Kizuizi cha Usalama cha RSD 26 (Ukaguzi 5 wa Lazima)',
    reconciliationTitle: 'Uhesabuji wa Matangi na Ankara ya Lori (Waybill)',
    shrinkageAlert: 'ONYO: Upungufu wa mafuta umezidi kiwango cha 0.35% au lita 50!',
    commitAuditBtn: 'Thibitisha na Weka kwenye Daftari la Ukaguzi (HITL)'
  }
};

