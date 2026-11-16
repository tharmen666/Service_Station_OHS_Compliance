/**
 * Service Station OHS Compliance Platform - POPIA Data Protection Safeguards
 * Protection of Personal Information Act (Act 4 of 2013) - Condition 7 / Section 19
 *
 * Design rules:
 * - Encryption (AES-256-GCM via Web Crypto) requires a key supplied by the caller.
 *   There is NO built-in or VITE_-prefixed default key: anything embedded in client
 *   JavaScript is public and cannot protect personal information.
 * - No silent fallbacks. If Web Crypto is unavailable or an operation fails, the
 *   function throws. Data is never labelled "encrypted" unless it was encrypted.
 * - Audit-trail signatures are SHA-256 digests (integrity), not encryption.
 * - PII masking for SA ID numbers and phone numbers.
 */

export interface POPIAEncryptionResult {
  ciphertext: string;
  iv: string;
  algo: 'AES-256-GCM';
  timestamp: string;
  isEncrypted: true;
}

export interface EmployeePII {
  employeeId: string;
  fullName: string;
  saIdNumber: string; // Sensitive 13-digit SA ID number
  phoneNumber: string;
  medicalClearanceDate?: string;
  incidentNotes?: string;
}

const MIN_KEY_LENGTH = 16;

/**
 * Mask South African 13-digit ID number to preserve POPIA privacy
 * Example: '8801015029082' -> '880101****082'
 */
export function maskSAIDNumber(saId: string): string {
  if (!saId || saId.length < 13) return '************';
  return `${saId.substring(0, 6)}****${saId.substring(10)}`;
}

/**
 * Mask Phone Number
 * Example: '+27821234567' -> '+2782***4567'
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 7) return '***-***-****';
  return `${phone.substring(0, 5)}***${phone.substring(phone.length - 4)}`;
}

function getSubtle(): SubtleCrypto {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('POPIA safeguard unavailable: Web Crypto (crypto.subtle) is not accessible in this context.');
  }
  return subtle;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(b64);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Derive a 256-bit AES key from a caller-supplied secret via SHA-256.
 * Throws if the secret is missing or too short, rather than padding it.
 */
async function importAesKey(secret: string, usage: 'encrypt' | 'decrypt'): Promise<CryptoKey> {
  if (!secret || secret.length < MIN_KEY_LENGTH) {
    throw new Error(`POPIA encryption key must be supplied and at least ${MIN_KEY_LENGTH} characters.`);
  }
  const subtle = getSubtle();
  const keyBytes = await subtle.digest('SHA-256', new TextEncoder().encode(secret));
  return subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, [usage]);
}

/**
 * AES-256-GCM encryption of PII. The key must be supplied by the caller.
 * Throws on any failure; never returns unencrypted data.
 */
export async function encryptPIIWithAES256GCM(data: string, secretKey: string): Promise<POPIAEncryptionResult> {
  const key = await importAesKey(secretKey, 'encrypt');
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await getSubtle().encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(data));

  return {
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
    iv: bytesToBase64(iv),
    algo: 'AES-256-GCM',
    timestamp: new Date().toISOString(),
    isEncrypted: true,
  };
}

/**
 * Decrypts AES-256-GCM encrypted PII. Throws if the key is wrong or data was tampered with.
 */
export async function decryptPIIWithAES256GCM(encryptedResult: POPIAEncryptionResult, secretKey: string): Promise<string> {
  const key = await importAesKey(secretKey, 'decrypt');
  const decrypted = await getSubtle().decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(encryptedResult.iv) },
    key,
    base64ToBytes(encryptedResult.ciphertext)
  );
  return new TextDecoder().decode(decrypted);
}

/**
 * SHA-256 digest (hex) for audit-trail signatures. Integrity only, not confidentiality.
 */
export async function hashAuditSignature(data: string): Promise<string> {
  const digest = await getSubtle().digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Runtime check that the Web Crypto safeguards are available in this browser.
 * Does not claim encryption is active: that depends on the caller supplying a key.
 */
export function verifyPOPIAEncryption(): {
  compliant: boolean;
  algorithm: string;
  popiActSection: string;
  auditMessage: string;
} {
  const available = typeof globalThis.crypto?.subtle !== 'undefined';
  return {
    compliant: available,
    algorithm: 'AES-256-GCM (caller-supplied key); SHA-256 for audit signatures',
    popiActSection: 'POPIA Act 4 of 2013 - Section 19 (Security Measures on Integrity and Confidentiality of Personal Information)',
    auditMessage: available
      ? 'POPIA Web Crypto safeguards available.'
      : 'POPIA Web Crypto safeguards NOT available: encryption and signing will fail.',
  };
}
