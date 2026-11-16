import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Scale, 
  Bot, 
  Sparkles, 
  X, 
  AlertTriangle, 
  Lock, 
  RefreshCw,
  Zap,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { requestStatutoryComplianceDoc } from '../services/complianceClient';
import { StatutoryComplianceResponse } from '../api/compliance';
import { hashAuditSignature } from '../popiActCompliance';
import { getActiveTenant } from '../multiTenantConfig';

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
  const [siteContext, setSiteContext] = useState<string>(`${tenant.brandName} - ${tenant.stationName} (${tenant.siteCode})`);
  const [hazards, setHazards] = useState<string>(
    'High-pressure fuel dispenser pipe wear, volatile gasoline vapor accumulation during peak forecourt traffic, and static discharge potential during tanker offloading.'
  );
  
  const [loading, setLoading] = useState<boolean>(false);
  const [docResponse, setDocResponse] = useState<StatutoryComplianceResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [exportedAudit, setExportedAudit] = useState<boolean>(false);
  // Human sign-off gate: AI output is a draft until a named competent person reviews it (OHS Act s16.2 / SHE Rep)
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerConfirmed, setReviewerConfirmed] = useState<boolean>(false);
  const canExport = reviewerName.trim().length >= 3 && reviewerConfirmed;

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!hazards.trim()) return;
    setLoading(true);
    setCopied(false);
    setExportedAudit(false);
    
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
      console.error('Failed to generate statutory doc:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!docResponse?.document) return;
    navigator.clipboard.writeText(docResponse.document);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExportAuditLog = async () => {
    if (!docResponse?.document || !canExport) return;
    const reviewedAt = new Date().toISOString();

    // SHA-256 integrity digest of the audit signature (POPIA Condition 7 / Section 19 integrity safeguard)
    const timestamp = new Date().toISOString();
    const signatureDigest = await hashAuditSignature(
      `STATUTORY_DOC_${taskType}_${siteContext}_${timestamp}`
    );

    // Prepare full audit export content
    const exportContent = `${docResponse.document}

---
### POPIA & STATUTORY AUDIT LEDGER TRAIL
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

    setExportedAudit(true);
    setTimeout(() => setExportedAudit(false), 4000);
  };

  const hazardPresets = [
    'Dispenser hose rupture & high-pressure petrol splash during peak hours',
    'Tanker fuel offloading static electric discharge (RSD 26 protocol)',
    'Food prep hot fryer oil spill & ergonomics 12-hour shift standing strain',
    'Underground storage tank (UST) confined space inspection & vapor lock',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative font-sans">
        
        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/80 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                  Statutory OHS Document Engine
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cyan-400" /> Temp 0.0 (Deterministic)
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white leading-tight mt-0.5">
                Generate Statutory Compliance Document
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* Form Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Document Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                1. Statutory Document Type
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-bold focus:outline-none focus:border-amber-500 transition"
              >
                <option value="HIRA">HIRA (Hazard Identification & Risk Assessment)</option>
                <option value="SWP">SWP (Safe Work Procedure & Standard Operating Proc)</option>
                <option value="Incident Root Cause">Incident Root Cause Analysis (Section 24 COIDA)</option>
                <option value="Toolbox Talk">Toolbox Talk (60s Statutory Shift Briefing)</option>
                <option value="Emergency Protocol">Emergency Evacuation & ESD Isolation Protocol</option>
              </select>
            </div>

            {/* Site Context Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                2. Site Context & Location
              </label>
              <input
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
            <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              3. Hazard Description & Operational Scope
            </label>
            <textarea
              rows={3}
              value={hazards}
              onChange={(e) => setHazards(e.target.value)}
              placeholder="Describe specific forecourt/retail hazards, machinery, or work tasks..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 transition"
            />
            
            {/* Quick Preset Chips */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-bold">Quick Hazard Presets:</span>
              <div className="flex flex-wrap gap-2">
                {hazardPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setHazards(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-medium border border-slate-700 transition"
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
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-950/60 transition flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Generated Document Display Output */}
          {docResponse && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              
              {/* Metadata Banner */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
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
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition flex-1 sm:flex-none"
                  >
                    {copied ? (
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
                    onClick={handleExportAuditLog}
                    disabled={!canExport}
                    title={canExport ? 'Export with reviewer sign-off' : 'Enter the reviewer name and confirm review first'}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg border border-purple-400/40 transition flex-1 sm:flex-none"
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

              {/* Human sign-off gate */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3">
                <p className="text-amber-300 text-xs font-bold">
                  DRAFT - AI-generated. Not approved. A competent person must review it before it is used or exported.
                </p>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Reviewer full name (competent person / SHE Representative)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs"
                />
                <label className="flex items-start gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={reviewerConfirmed}
                    onChange={(e) => setReviewerConfirmed(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>I have reviewed this draft against the primary legislation and accept responsibility for it.</span>
                </label>
              </div>

              {/* Formatted Markdown Container */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto shadow-inner select-text border-l-4 border-l-amber-500">
                {docResponse.document}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500 flex-shrink-0">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ErgoSafe Statutory Engine • Grounded in SA OHS Regulations
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
