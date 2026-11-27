/**
 * Shared Non-Conformance Report (NCR) Store
 * Persists automated & manual NCRs across Wetstock SIR, Nozzle Drift, Water Ingress,
 * BOL Delivery Shortages, Shift Cash-Up Variances, R638 HACCP Breaches, and Cleaning Logs.
 */

export type NcrCategory =
  | 'WETSTOCK_VARIANCE'
  | 'SIR_30DAY_DRIFT'
  | 'NOZZLE_METER_DRIFT'
  | 'WATER_INGRESS'
  | 'BOL_SHORTAGE'
  | 'CASH_UP_VARIANCE'
  | 'R638_HACCP'
  | 'CLEANING_COMPLIANCE';

export type NcrSeverity = 'WARNING' | 'CRITICAL';
export type NcrStatus = 'OPEN' | 'INVESTIGATING' | 'CLOSED';

export interface NonConformanceReport {
  id: string;
  siteCode: string;
  category: NcrCategory;
  severity: NcrSeverity;
  title: string;
  description: string;
  statutoryReference: string;
  measuredValue: string;
  thresholdValue: string;
  status: NcrStatus;
  createdAtIso: string;
  slaHours: number;
  resolvedAtIso?: string;
  resolvedBy?: string;
  closureNotes?: string;
  sha256Signature?: string;
}

const NCR_STORAGE_KEY = 'forecourt_ncr_ledger_v1';

const DEFAULT_INITIAL_NCRS: NonConformanceReport[] = [
  {
    id: 'NCR-WET-TK04-INIT',
    siteCode: 'STN-ALPHA',
    category: 'WETSTOCK_VARIANCE',
    severity: 'CRITICAL',
    title: 'TK-04 (Diesel 10ppm) Multi-Day Negative Wetstock Variance',
    description:
      'Legacy steel line tank recorded 3+ consecutive days of negative stock variance exceeding daily threshold. Line pressure hold & VacuSonic NDT verification scheduled.',
    statutoryReference: 'SANS 10089-3 / NEMA Section 30',
    measuredValue: '-240 L (-8.28%)',
    thresholdValue: '±0.50%',
    status: 'INVESTIGATING',
    createdAtIso: '2026-11-26T06:15:00.000Z',
    slaHours: 4,
  },
];

let memoryFallbackNcrs: NonConformanceReport[] = [...DEFAULT_INITIAL_NCRS];
const listeners = new Set<(ncrs: NonConformanceReport[]) => void>();

function readStorage(): NonConformanceReport[] {
  if (typeof localStorage === 'undefined') {
    return memoryFallbackNcrs;
  }
  try {
    const raw = localStorage.getItem(NCR_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return [...DEFAULT_INITIAL_NCRS];
}

function writeStorage(ncrs: NonConformanceReport[]): void {
  memoryFallbackNcrs = ncrs;
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(NCR_STORAGE_KEY, JSON.stringify(ncrs));
    } catch {
      // ignore storage errors
    }
  }
  listeners.forEach((cb) => cb(ncrs));
}

export function getNcrs(): NonConformanceReport[] {
  return readStorage();
}

export function addNcrs(incoming: NonConformanceReport[]): NonConformanceReport[] {
  if (!incoming || incoming.length === 0) return readStorage();
  const existing = readStorage();
  const byId = new Map<string, NonConformanceReport>();
  for (const item of existing) {
    byId.set(item.id, item);
  }
  for (const item of incoming) {
    if (!byId.has(item.id)) {
      byId.set(item.id, item);
    }
  }
  const merged = Array.from(byId.values()).sort((a, b) =>
    b.createdAtIso.localeCompare(a.createdAtIso)
  );
  writeStorage(merged);
  return merged;
}

export function updateNcrStatus(
  id: string,
  status: NcrStatus,
  opts?: { resolvedBy?: string; closureNotes?: string; sha256Signature?: string }
): NonConformanceReport[] {
  const existing = readStorage();
  const updated = existing.map((item) => {
    if (item.id !== id) return item;
    return {
      ...item,
      status,
      resolvedAtIso: status === 'CLOSED' ? new Date().toISOString() : item.resolvedAtIso,
      resolvedBy: opts?.resolvedBy ?? item.resolvedBy,
      closureNotes: opts?.closureNotes ?? item.closureNotes,
      sha256Signature: opts?.sha256Signature ?? item.sha256Signature,
    };
  });
  writeStorage(updated);
  return updated;
}

export function clearNcrs(): NonConformanceReport[] {
  const reset = [...DEFAULT_INITIAL_NCRS];
  writeStorage(reset);
  return reset;
}

export function subscribeNcrChange(cb: (ncrs: NonConformanceReport[]) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

