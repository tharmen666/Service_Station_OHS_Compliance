import { assessmentQuestions } from '../data/assessmentData';

export const PASS_MARK = 80; // 80% minimum statutory pass mark (confirmable with client)

export interface IssuedCertificateRecord {
  certificateId: string;
  candidateName: string;
  moduleName: string;
  score: number;
  totalQuestions: number;
  answeredCount: number;
  percentage: number;
  issueDate: string;
  timestamp: string;
  siteName: string;
  verifiedBySupervisor: boolean;
  supervisorName?: string;
  supervisorRegNo?: string;
  verifiedAt?: string;
}

const CERT_STORAGE_KEY = 'forecourt_issued_certificates_v1';
const USED_IDS_STORAGE_KEY = 'forecourt_used_certificate_ids_v1';
const LATEST_QUIZ_ATTEMPT_KEY = 'forecourt_latest_quiz_attempt_v1';

export interface QuizAttemptSnapshot {
  score: number;
  totalQuestions: number;
  answeredCount: number;
  moduleName: string;
  updatedAt: string;
}

function getUsedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(USED_IDS_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {
    // ignore storage errors
  }
  return new Set<string>();
}

function saveUsedIds(ids: Set<string>): void {
  try {
    localStorage.setItem(USED_IDS_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore storage errors
  }
}

/**
 * Generates a unique certificate ID per issue: CERT-OHS-<yyyymmdd>-<random>
 * Never reuses an ID across the session or persisted storage.
 */
export function generateUniqueCertificateId(now: Date = new Date()): string {
  const usedIds = getUsedIds();
  const yyyy = now.getFullYear().toString();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const datePart = `${yyyy}${mm}${dd}`;

  let candidateId = '';
  let attempts = 0;
  do {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase() +
      Math.floor(10 + Math.random() * 90).toString();
    candidateId = `CERT-OHS-${datePart}-${randomPart}`;
    attempts++;
  } while (usedIds.has(candidateId) && attempts < 100);

  usedIds.add(candidateId);
  saveUsedIds(usedIds);
  return candidateId;
}

export function getIssuedCertificates(): IssuedCertificateRecord[] {
  try {
    const raw = localStorage.getItem(CERT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export function issueAndStoreCertificate(params: {
  candidateName: string;
  moduleName: string;
  score: number;
  totalQuestions: number;
  answeredCount?: number;
  siteName: string;
}): IssuedCertificateRecord | null {
  const denominator = params.totalQuestions > 0 ? params.totalQuestions : assessmentQuestions.length;
  const percentage = Math.round((params.score / denominator) * 100);

  if (percentage < PASS_MARK) {
    return null;
  }

  const now = new Date();
  const record: IssuedCertificateRecord = {
    certificateId: generateUniqueCertificateId(now),
    candidateName: params.candidateName.trim() || 'Forecourt Attendant',
    moduleName: params.moduleName.trim() || 'Basic Forecourt Safety & OHS Awareness Training',
    score: params.score,
    totalQuestions: denominator,
    answeredCount: params.answeredCount ?? denominator,
    percentage,
    issueDate: now.toISOString().split('T')[0],
    timestamp: now.toISOString(),
    siteName: params.siteName,
    verifiedBySupervisor: false,
  };

  const existing = getIssuedCertificates();
  existing.unshift(record);
  try {
    localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
  return record;
}

export function markCertificateVerified(
  certificateId: string,
  supervisorName: string,
  supervisorRegNo: string
): IssuedCertificateRecord | null {
  const certs = getIssuedCertificates();
  const idx = certs.findIndex((c) => c.certificateId === certificateId);
  if (idx === -1) return null;

  const updated: IssuedCertificateRecord = {
    ...certs[idx],
    verifiedBySupervisor: true,
    supervisorName: supervisorName.trim(),
    supervisorRegNo: supervisorRegNo.trim(),
    verifiedAt: new Date().toISOString(),
  };
  certs[idx] = updated;
  try {
    localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(certs));
  } catch {
    // ignore
  }
  return updated;
}

export function saveLatestQuizAttempt(attempt: QuizAttemptSnapshot): void {
  try {
    localStorage.setItem(LATEST_QUIZ_ATTEMPT_KEY, JSON.stringify(attempt));
  } catch {
    // ignore
  }
}

export function getLatestQuizAttempt(): QuizAttemptSnapshot {
  try {
    const raw = localStorage.getItem(LATEST_QUIZ_ATTEMPT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.score === 'number' && typeof parsed.totalQuestions === 'number') {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return {
    score: 0,
    totalQuestions: assessmentQuestions.length,
    answeredCount: 0,
    moduleName: 'Basic Forecourt Safety & OHS Awareness Training (All Topics)',
    updatedAt: new Date().toISOString(),
  };
}

