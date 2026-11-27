/**
 * Universal POS & BOS Plug-In Ingestion Adapter
 * Connects to any retail/forecourt Back-Office or POS system:
 * - WinBranch (Flexinova / BCX) — BP & Engen standard
 * - ISIS — TotalEnergies standard
 * - NAMOS (forecourt wetstock/dispenser) + Symphony (FreshStop shop/QSR) — Astron Energy dual-BOS
 * - SmartFuel, Gilbarco, Tokheim, Generic CSV/XML exports, and Manual Quick-Entry
 *
 * Normalizes all incoming streams into one canonical `ShiftReconciliationPayload`.
 * Pure TypeScript with zero DOM dependencies so it executes identically in Browser & Node API.
 */

export type PosVendorId =
  | 'WINBRANCH'
  | 'ISIS'
  | 'NAMOS'
  | 'SYMPHONY'
  | 'SMARTFUEL'
  | 'GILBARCO'
  | 'TOKHEIM'
  | 'GENERIC_CSV'
  | 'GENERIC_XML'
  | 'MANUAL_QUICK_ENTRY';

export type CanonicalFuelGrade =
  | 'ULP_93'
  | 'ULP_95'
  | 'DIESEL_50PPM'
  | 'DIESEL_10PPM'
  | 'ILLUMINATING_PARAFFIN';

export interface CanonicalTankReading {
  tankId: string;
  fuelGrade: CanonicalFuelGrade;
  tankCapacityLitres: number;
  openingLitres: number;
  deliveryLitres: number;
  closingAtgLitres?: number;
  closingManualDipMm?: number;
  closingManualDipLitres?: number;
  waterLevelMm: number;
  temperatureC: number;
}

export interface CanonicalNozzleTotalizer {
  nozzleId: string;
  pumpNumber: number;
  tankId: string;
  fuelGrade: CanonicalFuelGrade;
  openingTotalizerLitres: number;
  closingTotalizerLitres: number;
  pumpTestReturnLitres: number;
  unitPriceLocal: number;
}

export interface CanonicalFuelGradeSale {
  fuelGrade: CanonicalFuelGrade;
  posLitresSold: number;
  posSalesValueLocal: number;
  driveOffLitres: number;
  driveOffValueLocal: number;
}

export interface CanonicalShopSaleSummary {
  convenienceSalesLocal: number;
  qsrFoodSalesLocal: number;
  lubricantsAndGasLocal: number;
  totalShopSalesLocal: number;
}

export interface CanonicalTenderBreakdown {
  cashDropsLocal: number;
  cashOnHandLocal: number;
  speedpointCardLocal: number;
  fleetCardLocal: number;
  eftLocal: number;
  vouchersLocal: number;
}

export interface ShiftReconciliationPayload {
  schemaVersion: '1.0';
  ingestionId: string;
  siteCode: string;
  currency: 'ZAR' | 'KES' | 'TZS' | 'UGX';
  shiftId: string;
  shiftDateIso: string;
  shiftStartIso: string;
  shiftEndIso: string;
  cashierOrSupervisor: string;
  sourceVendor: PosVendorId;
  sourceVendors: PosVendorId[];
  tankReadings: CanonicalTankReading[];
  nozzleTotalizers: CanonicalNozzleTotalizer[];
  fuelSalesByGrade: CanonicalFuelGradeSale[];
  shopSales: CanonicalShopSaleSummary;
  tenders: CanonicalTenderBreakdown;
  expectedTotalLocal: number;
  totalTenderedLocal: number;
  cashVarianceLocal: number;
}

export interface PosVendorMetadata {
  id: PosVendorId;
  name: string;
  brandAlignment: string;
  defaultFormat: 'CSV' | 'XML' | 'JSON';
  streamScope: 'UNIFIED' | 'FORECOURT_ONLY' | 'SHOP_QSR_ONLY';
  description: string;
}

export const POS_VENDOR_METADATA: Record<PosVendorId, PosVendorMetadata> = {
  WINBRANCH: {
    id: 'WINBRANCH',
    name: 'WinBranch BOS (Flexinova / BCX)',
    brandAlignment: 'BP & Engen Forecourts',
    defaultFormat: 'CSV',
    streamScope: 'UNIFIED',
    description:
      'Standard South African BP and Engen back-office shift close, tank dip, nozzle meter, and C-store tender export.',
  },
  ISIS: {
    id: 'ISIS',
    name: 'ISIS Forecourt BOS',
    brandAlignment: 'TotalEnergies Forecourts',
    defaultFormat: 'XML',
    streamScope: 'UNIFIED',
    description:
      'TotalEnergies ISIS shift reconciliation XML/CSV containing pump totalizers, tank gauges, Bonjour shop sales, and fleet cards.',
  },
  NAMOS: {
    id: 'NAMOS',
    name: 'NAMOS Forecourt Controller',
    brandAlignment: 'Astron Energy (Forecourt Stream)',
    defaultFormat: 'CSV',
    streamScope: 'FORECOURT_ONLY',
    description:
      'Astron Energy forecourt fuel, tank ATG/dip, and pump totalizer stream. Pair with Symphony for FreshStop shop/QSR cash-up.',
  },
  SYMPHONY: {
    id: 'SYMPHONY',
    name: 'Symphony Retail / QSR POS',
    brandAlignment: 'Astron Energy / FreshStop (Shop & QSR Stream)',
    defaultFormat: 'CSV',
    streamScope: 'SHOP_QSR_ONLY',
    description:
      'FreshStop convenience store, Crispy Chicken / Grill-to-Go QSR sales, and retail tender stream paired with NAMOS.',
  },
  SMARTFUEL: {
    id: 'SMARTFUEL',
    name: 'SmartFuel POS',
    brandAlignment: 'Shell & Independent Sites',
    defaultFormat: 'CSV',
    streamScope: 'UNIFIED',
    description: 'SmartFuel shift summary CSV export with tank stock, pump meters, and tender drops.',
  },
  GILBARCO: {
    id: 'GILBARCO',
    name: 'Gilbarco Passport / DomS',
    brandAlignment: 'Multi-Brand Forecourts',
    defaultFormat: 'XML',
    streamScope: 'UNIFIED',
    description: 'Gilbarco Passport XML shift and ATG export normalized to canonical schema.',
  },
  TOKHEIM: {
    id: 'TOKHEIM',
    name: 'Tokheim Fuel POS',
    brandAlignment: 'Multi-Brand Forecourts',
    defaultFormat: 'XML',
    streamScope: 'UNIFIED',
    description: 'Tokheim Fuel POS shift close XML/CSV export with hose totalizers and wetstock.',
  },
  GENERIC_CSV: {
    id: 'GENERIC_CSV',
    name: 'Generic CSV Shift Export',
    brandAlignment: 'Any Legacy / Standalone BOS',
    defaultFormat: 'CSV',
    streamScope: 'UNIFIED',
    description: 'Universal CSV import with visual column mapping for any site export.',
  },
  GENERIC_XML: {
    id: 'GENERIC_XML',
    name: 'Generic XML Shift Export',
    brandAlignment: 'Any XML-Capable BOS',
    defaultFormat: 'XML',
    streamScope: 'UNIFIED',
    description: 'Canonical or generic XML shift export parser.',
  },
  MANUAL_QUICK_ENTRY: {
    id: 'MANUAL_QUICK_ENTRY',
    name: 'Manual Quick-Entry Fallback',
    brandAlignment: 'Standalone / Legacy Till Sites',
    defaultFormat: 'JSON',
    streamScope: 'UNIFIED',
    description: 'Zero-POS tablet entry for standalone stations without automated BOS exports.',
  },
};

export interface ColumnMappingConfig {
  recordTypeCol: string;
  tankIdCol: string;
  gradeCol: string;
  capacityCol: string;
  openingStockCol: string;
  deliveryCol: string;
  closingAtgCol: string;
  closingDipMmCol: string;
  waterMmCol: string;
  tempCol: string;
  nozzleIdCol: string;
  pumpNumberCol: string;
  openMeterCol: string;
  closeMeterCol: string;
  pumpTestCol: string;
  unitPriceCol: string;
  posLitresCol: string;
  posValueCol: string;
  driveOffLitresCol: string;
  driveOffValueCol: string;
  shopConvCol: string;
  shopQsrCol: string;
  shopLubesCol: string;
  cashDropsCol: string;
  cashOnHandCol: string;
  speedpointCol: string;
  fleetCardCol: string;
  eftCol: string;
  vouchersCol: string;
}

const DEFAULT_COLUMN_MAP: ColumnMappingConfig = {
  recordTypeCol: 'RECORD_TYPE',
  tankIdCol: 'TANK_ID',
  gradeCol: 'GRADE',
  capacityCol: 'CAPACITY_L',
  openingStockCol: 'OPEN_L',
  deliveryCol: 'DELIVERY_L',
  closingAtgCol: 'CLOSE_ATG_L',
  closingDipMmCol: 'CLOSE_DIP_MM',
  waterMmCol: 'WATER_MM',
  tempCol: 'TEMP_C',
  nozzleIdCol: 'NOZZLE_ID',
  pumpNumberCol: 'PUMP_NO',
  openMeterCol: 'OPEN_METER',
  closeMeterCol: 'CLOSE_METER',
  pumpTestCol: 'TEST_RETURN_L',
  unitPriceCol: 'UNIT_PRICE',
  posLitresCol: 'POS_LITRES',
  posValueCol: 'POS_VALUE',
  driveOffLitresCol: 'DRIVE_OFF_L',
  driveOffValueCol: 'DRIVE_OFF_VALUE',
  shopConvCol: 'SHOP_CONV_VALUE',
  shopQsrCol: 'SHOP_QSR_VALUE',
  shopLubesCol: 'SHOP_LUBES_VALUE',
  cashDropsCol: 'CASH_DROPS',
  cashOnHandCol: 'CASH_ON_HAND',
  speedpointCol: 'SPEEDPOINT_CARD',
  fleetCardCol: 'FLEET_CARD',
  eftCol: 'EFT_SETTLED',
  vouchersCol: 'VOUCHERS',
};

export const POS_COLUMN_PRESETS: Record<PosVendorId, ColumnMappingConfig> = {
  WINBRANCH: {
    ...DEFAULT_COLUMN_MAP,
    recordTypeCol: 'REC_TYPE',
    gradeCol: 'PRODUCT_CODE',
    openingStockCol: 'OPENING_VOL',
    deliveryCol: 'RECEIPTS_VOL',
    closingAtgCol: 'CLOSING_ATG_VOL',
    openMeterCol: 'OPEN_TOT',
    closeMeterCol: 'CLOSE_TOT',
    posLitresCol: 'FUEL_POS_L',
    posValueCol: 'FUEL_POS_ZAR',
    speedpointCol: 'CARD_SPEEDPOINT',
  },
  ISIS: {
    ...DEFAULT_COLUMN_MAP,
    recordTypeCol: 'SECTION',
    gradeCol: 'GRADE_CODE',
    openingStockCol: 'START_STOCK_L',
    deliveryCol: 'DROP_L',
    closingAtgCol: 'END_ATG_L',
    openMeterCol: 'METER_START',
    closeMeterCol: 'METER_END',
    posLitresCol: 'DISPENSED_POS_L',
    posValueCol: 'DISPENSED_POS_AMT',
    shopConvCol: 'BONJOUR_SHOP_AMT',
    shopQsrCol: 'BONJOUR_CAFE_AMT',
  },
  NAMOS: {
    ...DEFAULT_COLUMN_MAP,
    recordTypeCol: 'LINE_KIND',
    gradeCol: 'FUEL_GRADE',
    openingStockCol: 'OPEN_STOCK_L',
    deliveryCol: 'BOL_DELIVERY_L',
    closingAtgCol: 'CLOSE_ATG_L',
    openMeterCol: 'NOZZLE_OPEN',
    closeMeterCol: 'NOZZLE_CLOSE',
    posLitresCol: 'FORECOURT_POS_L',
    posValueCol: 'FORECOURT_POS_AMT',
  },
  SYMPHONY: {
    ...DEFAULT_COLUMN_MAP,
    recordTypeCol: 'SYMPHONY_TYPE',
    shopConvCol: 'FRESHSTOP_RETAIL',
    shopQsrCol: 'FRESHSTOP_QSR',
    shopLubesCol: 'FORECOURT_LUBES',
    cashDropsCol: 'SAFE_DROPS',
    cashOnHandCol: 'TILL_CASH',
    speedpointCol: 'BANK_CARD',
  },
  SMARTFUEL: {
    ...DEFAULT_COLUMN_MAP,
    gradeCol: 'FUEL_PRODUCT',
    openingStockCol: 'OPEN_TANK_L',
    closingAtgCol: 'CLOSE_TANK_L',
    openMeterCol: 'PUMP_OPEN',
    closeMeterCol: 'PUMP_CLOSE',
  },
  GILBARCO: { ...DEFAULT_COLUMN_MAP },
  TOKHEIM: { ...DEFAULT_COLUMN_MAP },
  GENERIC_CSV: { ...DEFAULT_COLUMN_MAP },
  GENERIC_XML: { ...DEFAULT_COLUMN_MAP },
  MANUAL_QUICK_ENTRY: { ...DEFAULT_COLUMN_MAP },
};

export interface ParseOptions {
  siteCode?: string;
  currency?: 'ZAR' | 'KES' | 'TZS' | 'UGX';
  shiftId?: string;
  shiftDateIso?: string;
  cashierOrSupervisor?: string;
  columnOverrides?: Partial<ColumnMappingConfig>;
}

export function normalizeFuelGrade(raw: string): CanonicalFuelGrade {
  const s = String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

  if (s.includes('93') || s === 'LRP93' || s === 'ULP93' || s === 'UNLEADED_93') {
    return 'ULP_93';
  }
  if (s.includes('95') || s === 'ULP95' || s === 'UNLEADED_95' || s.includes('SUPER') || s.includes('PETROL')) {
    return 'ULP_95';
  }
  if (s.includes('10') || s.includes('LSD10') || s.includes('ULS') || s.includes('AGO_10')) {
    return 'DIESEL_10PPM';
  }
  if (s.includes('50') || s.includes('DIESEL') || s.includes('AGO')) {
    return 'DIESEL_50PPM';
  }
  if (s.includes('PARAFFIN') || s === 'IP' || s.includes('KEROSENE')) {
    return 'ILLUMINATING_PARAFFIN';
  }
  return 'ULP_95';
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseCsvRows(csvText: string): { headers: string[]; rows: Record<string, string>[] } {
  const clean = csvText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = clean
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'));

  if (lines.length === 0) return { headers: [], rows: [] };

  const headerLine = lines[0];
  const commaCount = (headerLine.match(/,/g) || []).length;
  const semiCount = (headerLine.match(/;/g) || []).length;
  const delimiter = semiCount > commaCount ? ';' : ',';

  const headers = splitCsvLine(headerLine, delimiter).map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i], delimiter);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? '';
    });
    rows.push(row);
  }

  return { headers, rows };
}

function numVal(row: Record<string, string>, colName: string, fallback = 0): number {
  const raw = row[colName];
  if (raw === undefined || raw === null || raw === '') return fallback;
  const parsed = Number(String(raw).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function strVal(row: Record<string, string>, colName: string, fallback = ''): string {
  const raw = row[colName];
  return raw !== undefined && raw !== null && String(raw).trim() !== ''
    ? String(raw).trim()
    : fallback;
}

function finalizeTotals(payload: Omit<ShiftReconciliationPayload, 'expectedTotalLocal' | 'totalTenderedLocal' | 'cashVarianceLocal'>): ShiftReconciliationPayload {
  const fuelExpected = payload.fuelSalesByGrade.reduce(
    (sum, g) => sum + (g.posSalesValueLocal - g.driveOffValueLocal),
    0
  );
  const expectedTotalLocal = Math.round((fuelExpected + payload.shopSales.totalShopSalesLocal) * 100) / 100;
  const t = payload.tenders;
  const totalTenderedLocal =
    Math.round(
      (t.cashDropsLocal +
        t.cashOnHandLocal +
        t.speedpointCardLocal +
        t.fleetCardLocal +
        t.eftLocal +
        t.vouchersLocal) *
        100
    ) / 100;
  const cashVarianceLocal = Math.round((totalTenderedLocal - expectedTotalLocal) * 100) / 100;

  return {
    ...payload,
    expectedTotalLocal,
    totalTenderedLocal,
    cashVarianceLocal,
  };
}

export function parseCsvShiftExport(
  csvText: string,
  vendor: PosVendorId = 'GENERIC_CSV',
  options?: ParseOptions
): ShiftReconciliationPayload {
  const map: ColumnMappingConfig = {
    ...(POS_COLUMN_PRESETS[vendor] || DEFAULT_COLUMN_MAP),
    ...(options?.columnOverrides || {}),
  };

  const { rows } = parseCsvRows(csvText);
  const now = new Date();
  const dateIso = options?.shiftDateIso || now.toISOString().split('T')[0];

  const tankReadings: CanonicalTankReading[] = [];
  const nozzleTotalizers: CanonicalNozzleTotalizer[] = [];
  const fuelGradeMap = new Map<CanonicalFuelGrade, CanonicalFuelGradeSale>();
  let shopConv = 0;
  let shopQsr = 0;
  let shopLubes = 0;
  const tenders: CanonicalTenderBreakdown = {
    cashDropsLocal: 0,
    cashOnHandLocal: 0,
    speedpointCardLocal: 0,
    fleetCardLocal: 0,
    eftLocal: 0,
    vouchersLocal: 0,
  };

  let detectedSite = options?.siteCode || '';
  let detectedShiftId = options?.shiftId || '';
  let detectedCashier = options?.cashierOrSupervisor || '';

  for (const row of rows) {
    if (!detectedSite && row.SITE_CODE) detectedSite = row.SITE_CODE;
    if (!detectedShiftId && row.SHIFT_ID) detectedShiftId = row.SHIFT_ID;
    if (!detectedCashier && (row.CASHIER || row.SUPERVISOR)) {
      detectedCashier = row.CASHIER || row.SUPERVISOR;
    }

    const recType = strVal(row, map.recordTypeCol, '').toUpperCase();

    if (recType === 'TANK' || (!recType && row[map.tankIdCol] && !row[map.nozzleIdCol])) {
      tankReadings.push({
        tankId: strVal(row, map.tankIdCol, `TK-0${tankReadings.length + 1}`),
        fuelGrade: normalizeFuelGrade(strVal(row, map.gradeCol, 'ULP_95')),
        tankCapacityLitres: numVal(row, map.capacityCol, 30000),
        openingLitres: numVal(row, map.openingStockCol, 0),
        deliveryLitres: numVal(row, map.deliveryCol, 0),
        closingAtgLitres: row[map.closingAtgCol] !== undefined && row[map.closingAtgCol] !== ''
          ? numVal(row, map.closingAtgCol, 0)
          : undefined,
        closingManualDipMm: row[map.closingDipMmCol] !== undefined && row[map.closingDipMmCol] !== ''
          ? numVal(row, map.closingDipMmCol, 0)
          : undefined,
        waterLevelMm: numVal(row, map.waterMmCol, 0),
        temperatureC: numVal(row, map.tempCol, 15),
      });
    } else if (recType === 'NOZZLE' || (!recType && row[map.nozzleIdCol])) {
      const grade = normalizeFuelGrade(strVal(row, map.gradeCol, 'ULP_95'));
      const openTot = numVal(row, map.openMeterCol, 0);
      const closeTot = numVal(row, map.closeMeterCol, openTot);
      const testRet = numVal(row, map.pumpTestCol, 0);
      const unitPrice = numVal(row, map.unitPriceCol, 22.5);
      nozzleTotalizers.push({
        nozzleId: strVal(row, map.nozzleIdCol, `NZ-0${nozzleTotalizers.length + 1}`),
        pumpNumber: numVal(row, map.pumpNumberCol, nozzleTotalizers.length + 1),
        tankId: strVal(row, map.tankIdCol, 'TK-01'),
        fuelGrade: grade,
        openingTotalizerLitres: openTot,
        closingTotalizerLitres: closeTot,
        pumpTestReturnLitres: testRet,
        unitPriceLocal: unitPrice,
      });

      // If explicit FUEL_SALE lines aren't provided, accumulate POS litres/value if present on nozzle row
      const posL = numVal(row, map.posLitresCol, 0);
      const posV = numVal(row, map.posValueCol, 0);
      if (posL > 0 || posV > 0) {
        const existing = fuelGradeMap.get(grade) || {
          fuelGrade: grade,
          posLitresSold: 0,
          posSalesValueLocal: 0,
          driveOffLitres: 0,
          driveOffValueLocal: 0,
        };
        existing.posLitresSold += posL;
        existing.posSalesValueLocal += posV;
        existing.driveOffLitres += numVal(row, map.driveOffLitresCol, 0);
        existing.driveOffValueLocal += numVal(row, map.driveOffValueCol, 0);
        fuelGradeMap.set(grade, existing);
      }
    } else if (recType === 'FUEL_SALE' || recType === 'GRADE_SALE') {
      const grade = normalizeFuelGrade(strVal(row, map.gradeCol, 'ULP_95'));
      const existing = fuelGradeMap.get(grade) || {
        fuelGrade: grade,
        posLitresSold: 0,
        posSalesValueLocal: 0,
        driveOffLitres: 0,
        driveOffValueLocal: 0,
      };
      existing.posLitresSold += numVal(row, map.posLitresCol, 0);
      existing.posSalesValueLocal += numVal(row, map.posValueCol, 0);
      existing.driveOffLitres += numVal(row, map.driveOffLitresCol, 0);
      existing.driveOffValueLocal += numVal(row, map.driveOffValueCol, 0);
      fuelGradeMap.set(grade, existing);
    } else if (recType === 'SHOP' || recType === 'QSR' || recType === 'FRESHSTOP') {
      shopConv += numVal(row, map.shopConvCol, 0);
      shopQsr += numVal(row, map.shopQsrCol, 0);
      shopLubes += numVal(row, map.shopLubesCol, 0);
    } else if (recType === 'TENDER' || recType === 'CASHUP') {
      tenders.cashDropsLocal += numVal(row, map.cashDropsCol, 0);
      tenders.cashOnHandLocal += numVal(row, map.cashOnHandCol, 0);
      tenders.speedpointCardLocal += numVal(row, map.speedpointCol, 0);
      tenders.fleetCardLocal += numVal(row, map.fleetCardCol, 0);
      tenders.eftLocal += numVal(row, map.eftCol, 0);
      tenders.vouchersLocal += numVal(row, map.vouchersCol, 0);
    }
  }

  // Derive fuel sales from nozzle totalizers if no FUEL_SALE rows existed
  if (fuelGradeMap.size === 0 && nozzleTotalizers.length > 0) {
    for (const nz of nozzleTotalizers) {
      const dispensed = Math.max(0, nz.closingTotalizerLitres - nz.openingTotalizerLitres - nz.pumpTestReturnLitres);
      const existing = fuelGradeMap.get(nz.fuelGrade) || {
        fuelGrade: nz.fuelGrade,
        posLitresSold: 0,
        posSalesValueLocal: 0,
        driveOffLitres: 0,
        driveOffValueLocal: 0,
      };
      existing.posLitresSold += dispensed;
      existing.posSalesValueLocal += Math.round(dispensed * nz.unitPriceLocal * 100) / 100;
      fuelGradeMap.set(nz.fuelGrade, existing);
    }
  }

  const totalShopSalesLocal = Math.round((shopConv + shopQsr + shopLubes) * 100) / 100;

  return finalizeTotals({
    schemaVersion: '1.0',
    ingestionId: `ING-${vendor}-${Date.now().toString(36).toUpperCase()}`,
    siteCode: detectedSite || 'STN-ALPHA',
    currency: options?.currency || 'ZAR',
    shiftId: detectedShiftId || `SHF-${dateIso}-01`,
    shiftDateIso: dateIso,
    shiftStartIso: `${dateIso}T06:00:00.000Z`,
    shiftEndIso: `${dateIso}T14:00:00.000Z`,
    cashierOrSupervisor: detectedCashier || 'Shift Supervisor A',
    sourceVendor: vendor,
    sourceVendors: [vendor],
    tankReadings,
    nozzleTotalizers,
    fuelSalesByGrade: Array.from(fuelGradeMap.values()),
    shopSales: {
      convenienceSalesLocal: Math.round(shopConv * 100) / 100,
      qsrFoodSalesLocal: Math.round(shopQsr * 100) / 100,
      lubricantsAndGasLocal: Math.round(shopLubes * 100) / 100,
      totalShopSalesLocal,
    },
    tenders,
  });
}

function readXmlTag(block: string, tagNames: string[]): string {
  for (const tag of tagNames) {
    const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'));
    if (match) return match[1].trim();
  }
  return '';
}

function readXmlBlocks(xml: string, tagName: string): string[] {
  const blocks: string[] = [];
  const regex = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)</${tagName}>`, 'gi');
  let m: RegExpExecArray | null;
  while ((m = regex.exec(xml)) !== null) {
    blocks.push(m[1]);
  }
  return blocks;
}

export function parseXmlShiftExport(
  xmlText: string,
  vendor: PosVendorId = 'GENERIC_XML',
  options?: ParseOptions
): ShiftReconciliationPayload {
  const now = new Date();
  const dateIso = readXmlTag(xmlText, ['ShiftDate', 'Date']) || options?.shiftDateIso || now.toISOString().split('T')[0];
  const siteCode = readXmlTag(xmlText, ['SiteCode', 'StationId']) || options?.siteCode || 'STN-ALPHA';
  const shiftId = readXmlTag(xmlText, ['ShiftId', 'ShiftNumber']) || options?.shiftId || `SHF-${dateIso}-01`;
  const cashier = readXmlTag(xmlText, ['Supervisor', 'Cashier']) || options?.cashierOrSupervisor || 'Shift Supervisor A';

  const tankReadings: CanonicalTankReading[] = readXmlBlocks(xmlText, 'Tank').map((blk, i) => ({
    tankId: readXmlTag(blk, ['Id', 'TankId']) || `TK-0${i + 1}`,
    fuelGrade: normalizeFuelGrade(readXmlTag(blk, ['Grade', 'Product', 'FuelGrade']) || 'ULP_95'),
    tankCapacityLitres: Number(readXmlTag(blk, ['CapacityLitres', 'Capacity']) || 30000),
    openingLitres: Number(readXmlTag(blk, ['OpeningLitres', 'Opening']) || 0),
    deliveryLitres: Number(readXmlTag(blk, ['DeliveryLitres', 'Deliveries']) || 0),
    closingAtgLitres: readXmlTag(blk, ['ClosingAtgLitres', 'ClosingAtg', 'ClosingLitres'])
      ? Number(readXmlTag(blk, ['ClosingAtgLitres', 'ClosingAtg', 'ClosingLitres']))
      : undefined,
    closingManualDipMm: readXmlTag(blk, ['ClosingDipMm']) ? Number(readXmlTag(blk, ['ClosingDipMm'])) : undefined,
    waterLevelMm: Number(readXmlTag(blk, ['WaterMm', 'WaterLevelMm']) || 0),
    temperatureC: Number(readXmlTag(blk, ['TempC', 'TemperatureC']) || 15),
  }));

  const nozzleTotalizers: CanonicalNozzleTotalizer[] = readXmlBlocks(xmlText, 'Nozzle').map((blk, i) => ({
    nozzleId: readXmlTag(blk, ['Id', 'NozzleId']) || `NZ-0${i + 1}`,
    pumpNumber: Number(readXmlTag(blk, ['Pump', 'PumpNumber']) || i + 1),
    tankId: readXmlTag(blk, ['TankId']) || 'TK-01',
    fuelGrade: normalizeFuelGrade(readXmlTag(blk, ['Grade', 'Product', 'FuelGrade']) || 'ULP_95'),
    openingTotalizerLitres: Number(readXmlTag(blk, ['OpeningTotalizer', 'OpeningMeter']) || 0),
    closingTotalizerLitres: Number(readXmlTag(blk, ['ClosingTotalizer', 'ClosingMeter']) || 0),
    pumpTestReturnLitres: Number(readXmlTag(blk, ['TestReturnLitres', 'PumpTest']) || 0),
    unitPriceLocal: Number(readXmlTag(blk, ['UnitPrice', 'Price']) || 22.5),
  }));

  const fuelSalesByGrade: CanonicalFuelGradeSale[] = readXmlBlocks(xmlText, 'FuelSale').map((blk) => ({
    fuelGrade: normalizeFuelGrade(readXmlTag(blk, ['Grade', 'Product', 'FuelGrade']) || 'ULP_95'),
    posLitresSold: Number(readXmlTag(blk, ['Litres', 'PosLitresSold']) || 0),
    posSalesValueLocal: Number(readXmlTag(blk, ['Value', 'PosSalesValue']) || 0),
    driveOffLitres: Number(readXmlTag(blk, ['DriveOffLitres']) || 0),
    driveOffValueLocal: Number(readXmlTag(blk, ['DriveOffValue']) || 0),
  }));

  const shopConv = Number(readXmlTag(xmlText, ['ConvenienceSales', 'ShopSales']) || 0);
  const shopQsr = Number(readXmlTag(xmlText, ['QsrSales', 'FoodSales']) || 0);
  const shopLubes = Number(readXmlTag(xmlText, ['LubricantsSales', 'Lubes']) || 0);

  const tenders: CanonicalTenderBreakdown = {
    cashDropsLocal: Number(readXmlTag(xmlText, ['CashDrops']) || 0),
    cashOnHandLocal: Number(readXmlTag(xmlText, ['CashOnHand', 'Cash']) || 0),
    speedpointCardLocal: Number(readXmlTag(xmlText, ['SpeedpointCard', 'Card']) || 0),
    fleetCardLocal: Number(readXmlTag(xmlText, ['FleetCard']) || 0),
    eftLocal: Number(readXmlTag(xmlText, ['Eft', 'EFT']) || 0),
    vouchersLocal: Number(readXmlTag(xmlText, ['Vouchers']) || 0),
  };

  return finalizeTotals({
    schemaVersion: '1.0',
    ingestionId: `ING-${vendor}-${Date.now().toString(36).toUpperCase()}`,
    siteCode,
    currency: options?.currency || 'ZAR',
    shiftId,
    shiftDateIso: dateIso,
    shiftStartIso: `${dateIso}T06:00:00.000Z`,
    shiftEndIso: `${dateIso}T14:00:00.000Z`,
    cashierOrSupervisor: cashier,
    sourceVendor: vendor,
    sourceVendors: [vendor],
    tankReadings,
    nozzleTotalizers,
    fuelSalesByGrade,
    shopSales: {
      convenienceSalesLocal: shopConv,
      qsrFoodSalesLocal: shopQsr,
      lubricantsAndGasLocal: shopLubes,
      totalShopSalesLocal: Math.round((shopConv + shopQsr + shopLubes) * 100) / 100,
    },
    tenders,
  });
}

export function autoDetectVendorAndParse(
  rawContent: string,
  fileName = '',
  options?: ParseOptions
): ShiftReconciliationPayload {
  const trimmed = rawContent.trim();
  const upper = trimmed.toUpperCase();
  const upperFile = fileName.toUpperCase();

  if (trimmed.startsWith('<')) {
    let vendor: PosVendorId = 'GENERIC_XML';
    if (upper.includes('ISIS') || upperFile.includes('ISIS')) vendor = 'ISIS';
    else if (upper.includes('GILBARCO') || upper.includes('PASSPORT')) vendor = 'GILBARCO';
    else if (upper.includes('TOKHEIM')) vendor = 'TOKHEIM';
    else if (upper.includes('NAMOS')) vendor = 'NAMOS';
    return parseXmlShiftExport(trimmed, vendor, options);
  }

  let vendor: PosVendorId = 'GENERIC_CSV';
  if (upper.includes('OPENING_VOL') || upper.includes('WINBRANCH') || upperFile.includes('WINBRANCH')) {
    vendor = 'WINBRANCH';
  } else if (upper.includes('BONJOUR_SHOP_AMT') || upper.includes('START_STOCK_L') || upperFile.includes('ISIS')) {
    vendor = 'ISIS';
  } else if (upper.includes('FORECOURT_POS_L') || upper.includes('BOL_DELIVERY_L') || upperFile.includes('NAMOS')) {
    vendor = 'NAMOS';
  } else if (upper.includes('FRESHSTOP_RETAIL') || upper.includes('SYMPHONY_TYPE') || upperFile.includes('SYMPHONY')) {
    vendor = 'SYMPHONY';
  } else if (upper.includes('OPEN_TANK_L') || upperFile.includes('SMARTFUEL')) {
    vendor = 'SMARTFUEL';
  }
  return parseCsvShiftExport(trimmed, vendor, options);
}

/**
 * Merges two POS/BOS streams — e.g. Astron Energy's dual-system architecture:
 *   Stream 1: NAMOS (Forecourt tanks, nozzles, fuel sales)
 *   Stream 2: SYMPHONY (FreshStop convenience store, QSR food & till tenders)
 */
export function mergeShiftReconciliationStreams(
  forecourtPayload: ShiftReconciliationPayload,
  shopPayload: ShiftReconciliationPayload
): ShiftReconciliationPayload {
  const combinedVendors = Array.from(
    new Set<PosVendorId>([...forecourtPayload.sourceVendors, ...shopPayload.sourceVendors])
  );

  const mergedTenders: CanonicalTenderBreakdown = {
    cashDropsLocal: forecourtPayload.tenders.cashDropsLocal + shopPayload.tenders.cashDropsLocal,
    cashOnHandLocal: forecourtPayload.tenders.cashOnHandLocal + shopPayload.tenders.cashOnHandLocal,
    speedpointCardLocal: forecourtPayload.tenders.speedpointCardLocal + shopPayload.tenders.speedpointCardLocal,
    fleetCardLocal: forecourtPayload.tenders.fleetCardLocal + shopPayload.tenders.fleetCardLocal,
    eftLocal: forecourtPayload.tenders.eftLocal + shopPayload.tenders.eftLocal,
    vouchersLocal: forecourtPayload.tenders.vouchersLocal + shopPayload.tenders.vouchersLocal,
  };

  const mergedShop: CanonicalShopSaleSummary = {
    convenienceSalesLocal:
      forecourtPayload.shopSales.convenienceSalesLocal + shopPayload.shopSales.convenienceSalesLocal,
    qsrFoodSalesLocal:
      forecourtPayload.shopSales.qsrFoodSalesLocal + shopPayload.shopSales.qsrFoodSalesLocal,
    lubricantsAndGasLocal:
      forecourtPayload.shopSales.lubricantsAndGasLocal + shopPayload.shopSales.lubricantsAndGasLocal,
    totalShopSalesLocal:
      Math.round(
        (forecourtPayload.shopSales.totalShopSalesLocal + shopPayload.shopSales.totalShopSalesLocal) * 100
      ) / 100,
  };

  return finalizeTotals({
    schemaVersion: '1.0',
    ingestionId: `ING-DUAL-${Date.now().toString(36).toUpperCase()}`,
    siteCode: forecourtPayload.siteCode || shopPayload.siteCode,
    currency: forecourtPayload.currency,
    shiftId: forecourtPayload.shiftId || shopPayload.shiftId,
    shiftDateIso: forecourtPayload.shiftDateIso,
    shiftStartIso: forecourtPayload.shiftStartIso,
    shiftEndIso: forecourtPayload.shiftEndIso,
    cashierOrSupervisor: forecourtPayload.cashierOrSupervisor || shopPayload.cashierOrSupervisor,
    sourceVendor: forecourtPayload.sourceVendor,
    sourceVendors: combinedVendors,
    tankReadings:
      forecourtPayload.tankReadings.length > 0
        ? forecourtPayload.tankReadings
        : shopPayload.tankReadings,
    nozzleTotalizers:
      forecourtPayload.nozzleTotalizers.length > 0
        ? forecourtPayload.nozzleTotalizers
        : shopPayload.nozzleTotalizers,
    fuelSalesByGrade:
      forecourtPayload.fuelSalesByGrade.length > 0
        ? forecourtPayload.fuelSalesByGrade
        : shopPayload.fuelSalesByGrade,
    shopSales: mergedShop,
    tenders: mergedTenders,
  });
}

export interface ManualQuickEntryInput {
  siteCode: string;
  currency?: 'ZAR' | 'KES' | 'TZS' | 'UGX';
  shiftId: string;
  shiftDateIso?: string;
  cashierOrSupervisor: string;
  tankReadings: CanonicalTankReading[];
  nozzleTotalizers: CanonicalNozzleTotalizer[];
  fuelSalesByGrade?: CanonicalFuelGradeSale[];
  shopSales: CanonicalShopSaleSummary;
  tenders: CanonicalTenderBreakdown;
}

export function buildManualQuickEntryPayload(input: ManualQuickEntryInput): ShiftReconciliationPayload {
  const dateIso = input.shiftDateIso || new Date().toISOString().split('T')[0];
  let fuelSales = input.fuelSalesByGrade;

  if (!fuelSales || fuelSales.length === 0) {
    const byGrade = new Map<CanonicalFuelGrade, CanonicalFuelGradeSale>();
    for (const nz of input.nozzleTotalizers) {
      const dispensed = Math.max(0, nz.closingTotalizerLitres - nz.openingTotalizerLitres - nz.pumpTestReturnLitres);
      const cur = byGrade.get(nz.fuelGrade) || {
        fuelGrade: nz.fuelGrade,
        posLitresSold: 0,
        posSalesValueLocal: 0,
        driveOffLitres: 0,
        driveOffValueLocal: 0,
      };
      cur.posLitresSold += dispensed;
      cur.posSalesValueLocal += Math.round(dispensed * nz.unitPriceLocal * 100) / 100;
      byGrade.set(nz.fuelGrade, cur);
    }
    fuelSales = Array.from(byGrade.values());
  }

  return finalizeTotals({
    schemaVersion: '1.0',
    ingestionId: `ING-MANUAL-${Date.now().toString(36).toUpperCase()}`,
    siteCode: input.siteCode || 'STN-ALPHA',
    currency: input.currency || 'ZAR',
    shiftId: input.shiftId || `SHF-${dateIso}-01`,
    shiftDateIso: dateIso,
    shiftStartIso: `${dateIso}T06:00:00.000Z`,
    shiftEndIso: `${dateIso}T14:00:00.000Z`,
    cashierOrSupervisor: input.cashierOrSupervisor || 'Shift Supervisor',
    sourceVendor: 'MANUAL_QUICK_ENTRY',
    sourceVendors: ['MANUAL_QUICK_ENTRY'],
    tankReadings: input.tankReadings,
    nozzleTotalizers: input.nozzleTotalizers,
    fuelSalesByGrade: fuelSales,
    shopSales: {
      ...input.shopSales,
      totalShopSalesLocal:
        Math.round(
          (input.shopSales.convenienceSalesLocal +
            input.shopSales.qsrFoodSalesLocal +
            input.shopSales.lubricantsAndGasLocal) *
            100
        ) / 100,
    },
    tenders: input.tenders,
  });
}

export function validateWebhookPayload(body: unknown): {
  valid: boolean;
  payload?: ShiftReconciliationPayload;
  errors: string[];
} {
  const errors: string[] = [];
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object.'] };
  }

  const obj = body as Record<string, any>;

  // Support raw vendor file push + optional secondary FreshStop/Symphony shop stream
  if (typeof obj.rawContent === 'string') {
    const vendor = (obj.vendor as PosVendorId) || 'GENERIC_CSV';
    const primary =
      obj.format === 'XML' || obj.rawContent.trim().startsWith('<')
        ? parseXmlShiftExport(obj.rawContent, vendor, { siteCode: obj.siteCode })
        : parseCsvShiftExport(obj.rawContent, vendor, { siteCode: obj.siteCode });

    if (obj.secondaryShopStream && typeof obj.secondaryShopStream.rawContent === 'string') {
      const secVendor = (obj.secondaryShopStream.vendor as PosVendorId) || 'SYMPHONY';
      const secondary =
        obj.secondaryShopStream.format === 'XML' ||
        obj.secondaryShopStream.rawContent.trim().startsWith('<')
          ? parseXmlShiftExport(obj.secondaryShopStream.rawContent, secVendor, {
              siteCode: obj.siteCode,
            })
          : parseCsvShiftExport(obj.secondaryShopStream.rawContent, secVendor, {
              siteCode: obj.siteCode,
            });
      return { valid: true, payload: mergeShiftReconciliationStreams(primary, secondary), errors: [] };
    }

    return { valid: true, payload: primary, errors: [] };
  }

  if (!obj.siteCode || typeof obj.siteCode !== 'string') errors.push('siteCode is required.');
  if (!obj.shiftId || typeof obj.shiftId !== 'string') errors.push('shiftId is required.');
  if (!Array.isArray(obj.tankReadings)) errors.push('tankReadings array is required.');
  if (!Array.isArray(obj.nozzleTotalizers)) errors.push('nozzleTotalizers array is required.');
  if (!obj.tenders || typeof obj.tenders !== 'object') errors.push('tenders object is required.');

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const shopSales: CanonicalShopSaleSummary = obj.shopSales || {
    convenienceSalesLocal: 0,
    qsrFoodSalesLocal: 0,
    lubricantsAndGasLocal: 0,
    totalShopSalesLocal: 0,
  };

  const payload = finalizeTotals({
    schemaVersion: '1.0',
    ingestionId: obj.ingestionId || `ING-API-${Date.now().toString(36).toUpperCase()}`,
    siteCode: obj.siteCode,
    currency: obj.currency || 'ZAR',
    shiftId: obj.shiftId,
    shiftDateIso: obj.shiftDateIso || new Date().toISOString().split('T')[0],
    shiftStartIso: obj.shiftStartIso || new Date().toISOString(),
    shiftEndIso: obj.shiftEndIso || new Date().toISOString(),
    cashierOrSupervisor: obj.cashierOrSupervisor || 'POS Webhook',
    sourceVendor: obj.sourceVendor || 'GENERIC_CSV',
    sourceVendors: Array.isArray(obj.sourceVendors)
      ? obj.sourceVendors
      : [obj.sourceVendor || 'GENERIC_CSV'],
    tankReadings: obj.tankReadings,
    nozzleTotalizers: obj.nozzleTotalizers,
    fuelSalesByGrade: Array.isArray(obj.fuelSalesByGrade) ? obj.fuelSalesByGrade : [],
    shopSales,
    tenders: obj.tenders,
  });

  return { valid: true, payload, errors: [] };
}

export function generateSamplePosExport(vendor: PosVendorId, format: 'CSV' | 'XML' = 'CSV'): string {
  if (format === 'XML' || vendor === 'ISIS' || vendor === 'GILBARCO' || vendor === 'TOKHEIM') {
    const tagHint = vendor === 'ISIS' ? 'ISIS-TotalEnergies' : vendor;
    return `<ShiftExport vendor="${tagHint}">
  <SiteCode>${vendor === 'ISIS' ? 'TOT-ZA-005' : 'STN-ALPHA'}</SiteCode>
  <ShiftId>SHF-20261127-AM</ShiftId>
  <ShiftDate>2026-11-27</ShiftDate>
  <Supervisor>Shift Supervisor A</Supervisor>
  <Tanks>
    <Tank>
      <TankId>TK-01</TankId>
      <FuelGrade>ULP_95</FuelGrade>
      <CapacityLitres>30000</CapacityLitres>
      <OpeningLitres>15000</OpeningLitres>
      <DeliveryLitres>10000</DeliveryLitres>
      <ClosingAtgLitres>19980</ClosingAtgLitres>
      <WaterMm>3</WaterMm>
      <TempC>15</TempC>
    </Tank>
    <Tank>
      <TankId>TK-02</TankId>
      <FuelGrade>DIESEL_50PPM</FuelGrade>
      <CapacityLitres>35000</CapacityLitres>
      <OpeningLitres>20000</OpeningLitres>
      <DeliveryLitres>0</DeliveryLitres>
      <ClosingAtgLitres>14985</ClosingAtgLitres>
      <WaterMm>5</WaterMm>
      <TempC>15</TempC>
    </Tank>
  </Tanks>
  <Nozzles>
    <Nozzle>
      <NozzleId>NZ-01</NozzleId>
      <PumpNumber>1</PumpNumber>
      <TankId>TK-01</TankId>
      <FuelGrade>ULP_95</FuelGrade>
      <OpeningTotalizer>120000</OpeningTotalizer>
      <ClosingTotalizer>125000</ClosingTotalizer>
      <TestReturnLitres>0</TestReturnLitres>
      <UnitPrice>22.50</UnitPrice>
    </Nozzle>
    <Nozzle>
      <NozzleId>NZ-02</NozzleId>
      <PumpNumber>2</PumpNumber>
      <TankId>TK-02</TankId>
      <FuelGrade>DIESEL_50PPM</FuelGrade>
      <OpeningTotalizer>240000</OpeningTotalizer>
      <ClosingTotalizer>245000</ClosingTotalizer>
      <TestReturnLitres>0</TestReturnLitres>
      <UnitPrice>21.00</UnitPrice>
    </Nozzle>
  </Nozzles>
  <FuelSales>
    <FuelSale>
      <FuelGrade>ULP_95</FuelGrade>
      <Litres>5000</Litres>
      <Value>112500</Value>
      <DriveOffLitres>0</DriveOffLitres>
      <DriveOffValue>0</DriveOffValue>
    </FuelSale>
    <FuelSale>
      <FuelGrade>DIESEL_50PPM</FuelGrade>
      <Litres>5000</Litres>
      <Value>105000</Value>
      <DriveOffLitres>0</DriveOffLitres>
      <DriveOffValue>0</DriveOffValue>
    </FuelSale>
  </FuelSales>
  <ShopSales>
    <ConvenienceSales>18500</ConvenienceSales>
    <QsrSales>9400</QsrSales>
    <LubricantsSales>2100</LubricantsSales>
  </ShopSales>
  <Tenders>
    <CashDrops>45000</CashDrops>
    <CashOnHand>12500</CashOnHand>
    <SpeedpointCard>110000</SpeedpointCard>
    <FleetCard>62000</FleetCard>
    <Eft>15000</Eft>
    <Vouchers>3000</Vouchers>
  </Tenders>
</ShiftExport>`;
  }

  if (vendor === 'WINBRANCH') {
    return [
      'REC_TYPE,SITE_CODE,SHIFT_ID,TANK_ID,PRODUCT_CODE,CAPACITY_L,OPENING_VOL,RECEIPTS_VOL,CLOSING_ATG_VOL,WATER_MM,TEMP_C,NOZZLE_ID,PUMP_NO,OPEN_TOT,CLOSE_TOT,TEST_RETURN_L,UNIT_PRICE,FUEL_POS_L,FUEL_POS_ZAR,DRIVE_OFF_L,DRIVE_OFF_VALUE,SHOP_CONV_VALUE,SHOP_QSR_VALUE,SHOP_LUBES_VALUE,CASH_DROPS,CASH_ON_HAND,CARD_SPEEDPOINT,FLEET_CARD,EFT_SETTLED,VOUCHERS',
      'TANK,BP-ZA-001,SHF-WB-01,TK-01,ULP_95,30000,14500,10000,19280,4,15,,,,,,,,,,,,,,,,,,,',
      'TANK,BP-ZA-001,SHF-WB-01,TK-02,DIESEL_50PPM,35000,22000,0,15990,6,15,,,,,,,,,,,,,,,,,,,',
      'NOZZLE,BP-ZA-001,SHF-WB-01,TK-01,ULP_95,,,,,,,NZ-01,1,150000,155200,0,22.50,,,,,,,,,,,,',
      'NOZZLE,BP-ZA-001,SHF-WB-01,TK-02,DIESEL_50PPM,,,,,,,NZ-02,2,280000,286000,0,21.00,,,,,,,,,,,,',
      'FUEL_SALE,BP-ZA-001,SHF-WB-01,,ULP_95,,,,,,,,,,,,,5200,117000,0,0,,,,,,,,,,',
      'FUEL_SALE,BP-ZA-001,SHF-WB-01,,DIESEL_50PPM,,,,,,,,,,,,,6000,126000,0,0,,,,,,,,,,',
      'SHOP,BP-ZA-001,SHF-WB-01,,,,,,,,,,,,,,,,,,,21400,8900,3200,,,,,,',
      'TENDER,BP-ZA-001,SHF-WB-01,,,,,,,,,,,,,,,,,,,,,,55000,14500,122000,68000,12000,5000',
    ].join('\n');
  }

  if (vendor === 'NAMOS') {
    return [
      'LINE_KIND,SITE_CODE,SHIFT_ID,TANK_ID,FUEL_GRADE,CAPACITY_L,OPEN_STOCK_L,BOL_DELIVERY_L,CLOSE_ATG_L,WATER_MM,TEMP_C,NOZZLE_ID,PUMP_NO,NOZZLE_OPEN,NOZZLE_CLOSE,TEST_RETURN_L,UNIT_PRICE,FORECOURT_POS_L,FORECOURT_POS_AMT,DRIVE_OFF_L,DRIVE_OFF_VALUE,CASH_DROPS,CASH_ON_HAND,SPEEDPOINT_CARD,FLEET_CARD,EFT_SETTLED,VOUCHERS',
      'TANK,AST-ZA-004,SHF-AST-01,TK-01,ULP_95,30000,16000,8000,19490,3,15,,,,,,,,,,,,,,,,',
      'TANK,AST-ZA-004,SHF-AST-01,TK-02,DIESEL_50PPM,35000,21000,0,16480,5,15,,,,,,,,,,,,,,,,',
      'NOZZLE,AST-ZA-004,SHF-AST-01,TK-01,ULP_95,,,,,,,NZ-01,1,110000,114500,0,22.50,,,,,,,,',
      'NOZZLE,AST-ZA-004,SHF-AST-01,TK-02,DIESEL_50PPM,,,,,,,NZ-02,2,210000,214500,0,21.00,,,,,,,,',
      'FUEL_SALE,AST-ZA-004,SHF-AST-01,,ULP_95,,,,,,,,,,,,,4500,101250,0,0,,,,,,',
      'FUEL_SALE,AST-ZA-004,SHF-AST-01,,DIESEL_50PPM,,,,,,,,,,,,,4500,94500,0,0,,,,,,',
      'TENDER,AST-ZA-004,SHF-AST-01,,,,,,,,,,,,,,,,,,,40000,10750,88000,52000,5000,0',
    ].join('\n');
  }

  if (vendor === 'SYMPHONY') {
    return [
      'SYMPHONY_TYPE,SITE_CODE,SHIFT_ID,FRESHSTOP_RETAIL,FRESHSTOP_QSR,FORECOURT_LUBES,SAFE_DROPS,TILL_CASH,BANK_CARD,FLEET_CARD,EFT_SETTLED,VOUCHERS',
      'FRESHSTOP,AST-ZA-004,SHF-AST-01,24800,14600,3100,,,,,,',
      'TENDER,AST-ZA-004,SHF-AST-01,,,,12000,6500,21000,0,2000,1000',
    ].join('\n');
  }

  return [
    'RECORD_TYPE,SITE_CODE,SHIFT_ID,TANK_ID,GRADE,CAPACITY_L,OPEN_L,DELIVERY_L,CLOSE_ATG_L,WATER_MM,TEMP_C,NOZZLE_ID,PUMP_NO,OPEN_METER,CLOSE_METER,TEST_RETURN_L,UNIT_PRICE,POS_LITRES,POS_VALUE,DRIVE_OFF_L,DRIVE_OFF_VALUE,SHOP_CONV_VALUE,SHOP_QSR_VALUE,SHOP_LUBES_VALUE,CASH_DROPS,CASH_ON_HAND,SPEEDPOINT_CARD,FLEET_CARD,EFT_SETTLED,VOUCHERS',
    'TANK,STN-ALPHA,SHF-GEN-01,TK-01,ULP_95,30000,12000,10000,17990,4,15,,,,,,,,,,,,,,,,,,,',
    'NOZZLE,STN-ALPHA,SHF-GEN-01,TK-01,ULP_95,,,,,,,NZ-01,1,100000,104000,0,22.50,,,,,,,,,,,,',
    'FUEL_SALE,STN-ALPHA,SHF-GEN-01,,ULP_95,,,,,,,,,,,,,4000,90000,0,0,,,,,,,,,,',
    'SHOP,STN-ALPHA,SHF-GEN-01,,,,,,,,,,,,,,,,,,,14000,6000,1500,,,,,,',
    'TENDER,STN-ALPHA,SHF-GEN-01,,,,,,,,,,,,,,,,,,,,,,35000,9500,48000,15000,4000,0',
  ].join('\n');
}

