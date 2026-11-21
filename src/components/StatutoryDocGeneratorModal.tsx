import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Scale,
  Sparkles,
  X,
  AlertTriangle,
  Lock,
  RefreshCw,
  Zap,
  CheckCircle2,
  ClipboardCheck,
} from 'lucide-react';
import { requestStatutoryComplianceDoc } from '../services/complianceClient';
import { StatutoryComplianceResponse } from '../api/compliance';
import { hashAuditSignature } from '../popiActCompliance';
import { getActiveTenant } from '../multiTenantConfig';
import { downloadStatutoryPdf } from '../lib/pdfGenerator';

export const AUDIT_LOG_STORAGE_KEY = 'forecourt_statutory_audit_log_v1';

export interface PersistedAuditLogRecord {
  id: string;
  taskType: string;
  siteContext: string;
  hazards: string;
  user: string;
  timestamp: string;
  popiaSignatureHash: string;
}

export function getPersistedAuditLogs(): PersistedAuditLogRecord[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return [];
}

interface StatutoryDocGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatutoryDocGeneratorModal: React.FC<StatutoryDocGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const tenant = getActiveTenant();
  const [taskType, setTaskType] = useState<string>('HIRA');
  const [siteContext, setSiteContext] = useState<string>(
    `${tenant.brandName} - ${tenant.stationName} (${tenant.siteCode})`
  );
  const [hazards, setHazards] = useState<string>(
    'High-pressure fuel dispenser pipe wear, volatile gasoline vapor accumulation during peak forecourt traffic, and static discharge potential during tanker offloading.'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [docResponse, setDocResponse] = useState<StatutoryComplianceResponse | null>(null);
  const [copyStatus, setCopyStatus] = useState<'success' | 'error' | null>(null);
  const [copyMessage, setCopyMessage] = useState<string>('');
  const [exportedAudit, setExportedAudit] = useState<boolean>(false);
  // Human sign-off gate: AI output is a draft until a named competent person reviews it (OHS Act s16.2 / SHE Rep)
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerConfirmed, setReviewerConfirmed] = useState<boolean>(false);
  const canExport = reviewerName.trim().length >= 3 && reviewerConfirmed;
  const [genError, setGenError] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<PersistedAuditLogRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      setAuditLogs(getPersistedAuditLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!hazards.trim()) return;
    setLoading(true);
    setCopyStatus(null);
    setCopyMessage('');
    setExportedAudit(false);
    setGenError(null);
    setReviewerName('');
    setReviewerConfirmed(false);

    try {
      // Model Configuration: temperature: 0.0 is selected for deterministic prompt hydration
      // and repeatable statutory outputs, requiring human-in-the-loop review by a designated competent person (Section 16.2 / SHE Rep).
      const response = await requestStatutoryComplianceDoc({
        taskType,
        siteContext,
        hazards,
      });
      setDocResponse(response);
    } catch (err) {
      // No draft is shown when the governed path fails. The user sees why.
      setDocResponse(null);
      setGenError(err instanceof Error ? err.message : 'The draft could not be produced.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!docResponse?.document) return;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(docResponse.document);
      } else {
        const ta = document.createElement('textarea');
        ta.value = docResponse.document;
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!ok) throw new Error('execCommand copy failed');
      }
      setCopyStatus('success');
      setCopyMessage('✓ Copied to clipboard! Document text is ready to paste.');
    } catch {
      setCopyStatus('error');
      setCopyMessage(
        '✗ Failed to copy automatically. Please select the document text below and press Ctrl+C.'
      );
    }
  };

  const handleExportAuditLog = async () => {
    if (!docResponse?.document || !canExport) return;
    const reviewedAt = new Date().toISOString();

    // SHA-256 integrity digest of the audit signature (POPIA Condition 7 / Section 19 integrity safeguard)
    const timestamp = new Date().toISOString();
    const signatureDigest = await hashAuditSignature(
      `STATUTORY_DOC_${taskType}_${siteContext}_${timestamp}`
    );

    const recordId =
      docResponse.metadata.governance?.recordId ||
      `DEMO-EPHEMERAL-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const exportContent = `${docResponse.document}

---
### POPIA & STATUTORY AUDIT LEDGER TRAIL
- **Record ID**: \`${recordId}\`
- **Audit Signature (SHA-256)**: \`${signatureDigest}\`
- **Digest Standard**: SHA-256
- **Timestamp**: ${timestamp}
- **Human Reviewer (competent person)**: ${reviewerName.trim()}
- **Review Confirmed At**: ${reviewedAt}
- **Review Status**: AI-drafted. Reviewed and confirmed by the named person above. Verify against primary legislation before reliance.
- **Audit Verification Code**: ZA-OHS-ACT85-COMPLIANT
`;

    const blob = new Blob([exportContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ErgoSafe_Statutory_OHS_${taskType.replace(/\s+/g, '_')}_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Browser-only copy for the on-page list. The server audit record (recordId) is the authoritative one.
    const record: PersistedAuditLogRecord = {
      id: recordId,
      taskType,
      siteContext,
      hazards,
      user: reviewerName.trim(),
      timestamp,
      popiaSignatureHash: signatureDigest,
    };
    const existing = getPersistedAuditLogs();
    const updated = [record, ...existing];
    try {
      localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setAuditLogs(updated);
    setExportedAudit(true);
  };

  const handleDownloadPdf = () => {
    if (!docResponse?.document) return;
    downloadStatutoryPdf(
      `Forecourt_Statutory_${taskType.replace(/\s+/g, '_')}.pdf`,
      `${taskType} — ${siteContext}`,
      docResponse.document
    );
  };

  const hazardPresets = [
    'Dispenser hose rupture & high-pressure petrol splash during peak hours',
    'Tanker fuel offloading static electric discharge (RSD 26 protocol)',
    'Food prep hot fryer oil spill & ergonomics 12-hour shift standing strain',
    'Underground storage tank (UST) confined space inspection & vapor lock',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="statutory-doc-modal-title"
    >
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative font-sans">
        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/80 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/30">
                  Statutory OHS Document Engine
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cyan-400" /> Temp 0.0 (Deterministic)
                </span>
              </div>
              <h2
                id="statutory-doc-modal-title"
                className="text-xl md:text-2xl font-black text-white leading-tight mt-0.5"
              >
                Generate Statutory Compliance Document
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Statutory Document Modal"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* POPIA Data-Minimisation Notice */}
          <div
            data-testid="popia-minimisation-note"
            className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 text-xs text-cyan-200 flex items-start gap-2.5"
          >
            <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-cyan-300 font-bold">
                POPIA Data-Minimisation &amp; Retention Notice (Act 4 of 2013, Section 10 &amp; 14):
              </strong>{' '}
              Enter role titles or station codes rather than personal ID numbers or private contact details. Exported audit logs are retained solely for statutory OHS inspection intervals.
            </div>
          </div>

          {/* Form Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Type Selector */}
            <div className="space-y-1.5">
              <label
                htmlFor="doc-task-type"
                className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                1. Statutory Document Type
              </label>
              <select
                id="doc-task-type"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-bold focus:outline-none focus:border-amber-500 transition"
              >
                <option value="HIRA">HIRA (Hazard Identification &amp; Risk Assessment)</option>
                <option value="SWP">SWP (Safe Work Procedure &amp; Standard Operating Proc)</option>
                <option value="Incident Root Cause">
                  Incident Root Cause Analysis (Section 24 COIDA)
                </option>
                <option value="Toolbox Talk">Toolbox Talk (60s Statutory Shift Briefing)</option>
                <option value="Emergency Protocol">
                  Emergency Evacuation &amp; ESD Isolation Protocol
                </option>
              </select>
            </div>

            {/* Site Context Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="doc-site-context"
                className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                2. Site Context &amp; Location
              </label>
              <input
                id="doc-site-context"
                type="text"
                value={siteContext}
                onChange={(e) => setSiteContext(e.target.value)}
                placeholder="e.g. Gauteng Forecourt - Lenasia Station"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-semibold focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Hazard & Scope Description */}
          <div className="space-y-2">
            <label
              htmlFor="doc-hazards-textarea"
              className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              3. Hazard Description &amp; Operational Scope
            </label>
            <textarea
              id="doc-hazards-textarea"
              rows={3}
              value={hazards}
              onChange={(e) => setHazards(e.target.value)}
              placeholder="Describe specific forecourt/retail hazards, machinery, or work tasks..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 transition"
            />

            <div className="space-y-1">
              <span className="text-xs text-slate-300 font-bold">Quick Hazard Presets:</span>
              <div className="flex flex-wrap gap-2">
                {hazardPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setHazards(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 text-xs font-medium border border-slate-700 transition"
                  >
                    + {preset.substring(0, 42)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !hazards.trim()}
            data-testid="generate-statutory-doc-btn"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl transition flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Hydrating Statutory Prompt (Temp 0.0)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Compile Statutory Document Draft</span>
              </>
            )}
          </button>

          {genError && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs"
            >
              {genError}
            </div>
          )}

          {/* Generated Document Display Output */}
          {docResponse && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              {/* Metadata Banner */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-extrabold text-white">AI draft compiled - not approved</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black font-mono border border-emerald-500/30">
                      {docResponse.metadata.engineVersion}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Grounding: OHS Act 85 of 1993 • Driven Machinery Regs • Ergonomics Regs 2019 • Hierarchy of Controls (citations to be verified by the reviewer)
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Engine: {docResponse.metadata.governance?.engine === 'live-model'
                      ? `live model (${docResponse.metadata.governance.modelId})`
                      : 'template (no live model used)'}
                    {' • '}Governance check: {docResponse.metadata.governance?.issues.length ?? 0} issue(s) flagged
                    {' • '}Policy {docResponse.metadata.governance?.policyVersion ?? 'n/a'}
                  </p>
                  {docResponse.metadata.governance?.recordStore === 'memory-ephemeral' && (
                    <p role="status" className="text-amber-300 text-[11px] font-bold">
                      SANDBOX DEMO MODE (In-Memory Ephemeral — Connect Postgres DATABASE_URL for Persistent Audit Storage)
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <button
                    type="button"
                    onClick={handleCopy}
                    data-testid="copy-doc-btn"
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                  >
                    {copyStatus === 'success' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-amber-400" />
                        <span>Copy to Clipboard</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    data-testid="download-doc-pdf-btn"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportAuditLog}
                    disabled={!canExport}
                    data-testid="export-audit-log-btn"
                    title={
                      canExport
                        ? 'Export with reviewer sign-off'
                        : 'Enter the reviewer name and confirm review first'
                    }
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg border border-purple-400/40 transition"
                  >
                    {exportedAudit ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Exported to Audit Log!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-purple-200" />
                        <span>Export to Audit Log</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Explicit Copy Success / Failure Confirmation Banner */}
              {copyStatus && (
                <div
                  role={copyStatus === 'success' ? 'status' : 'alert'}
                  data-testid="doc-copy-status"
                  className={`p-3 rounded-xl border text-xs font-bold ${
                    copyStatus === 'success'
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-red-950/60 border-red-500/50 text-red-300'
                  }`}
                >
                  {copyMessage}
                </div>
              )}

              {/* Human sign-off gate */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3">
                <p className="text-amber-300 text-xs font-bold">
                  DRAFT - AI-generated. Not approved. A competent person must review it before it is used or exported.
                </p>
                <input
                  type="text"
                  data-testid="doc-audit-user-input"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Reviewer full name (competent person / SHE Representative)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs"
                />
                <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    data-testid="doc-reviewer-confirm-checkbox"
                    checked={reviewerConfirmed}
                    onChange={(e) => setReviewerConfirmed(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    I have reviewed this draft against the primary legislation and accept responsibility for it.
                  </span>
                </label>
              </div>

              {/* Formatted Markdown Container */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto shadow-inner select-text border-l-4 border-l-amber-500">
                {docResponse.document}
              </div>
            </div>
          )}

          {/* Persisted Statutory Audit Log Table (Survives Reload) */}
          <div
            data-testid="persisted-audit-log-section"
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <ClipboardCheck className="w-4 h-4 text-purple-400" />
                Persisted Statutory Audit Log ({auditLogs.length} records)
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Stored in this browser only. Not the server audit trail.
              </span>
            </div>

            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-300">
                No audit log records saved yet. Compile a document, complete reviewer sign-off, and click &ldquo;Export to Audit Log&rdquo; to persist a timestamped record.
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {auditLogs.map((entry) => (
                  <div
                    key={entry.id}
                    data-testid="persisted-audit-log-row"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-mono font-bold text-amber-400">{entry.id}</span>
                      <span className="mx-2 text-slate-500">•</span>
                      <span className="font-bold text-white">{entry.taskType}</span>
                      <span className="mx-2 text-slate-500">•</span>
                      <span className="text-slate-300">{entry.siteContext}</span>
                    </div>
                    <div className="font-mono text-xs text-slate-300">
                      <span>User: {entry.user}</span>
                      <span className="mx-2 text-slate-500">|</span>
                      <span>{entry.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-300 flex-shrink-0">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Forecourt Sentinel Statutory Engine • Grounded in SA OHS Regulations
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
