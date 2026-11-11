import os
import sys
import zipfile
from pathlib import Path

# 5 Target Statutory Core Files
TARGET_FILES = [
    {
        "rel_path": "api/_lib/security.js",
        "scope": "Serverless endpoint security guard, token authentication (requireToken), IP rate limiting, and CORS configuration."
    },
    {
        "rel_path": "api/compliance.js",
        "scope": "Vercel serverless HTTP route handler, payload validation (siteContext, hazards, taskType), method gating, and error handling."
    },
    {
        "rel_path": "src/api/compliance.ts",
        "scope": "Core document generation logic and system prompt interfacing."
    },
    {
        "rel_path": "src/store/complianceStore.ts",
        "scope": "Deterministic statutory risk engine, weight parsing (parseMaxWeightKg), the > 25 kg guidance boundary check, Regulation 8(1) OMP surveillance referral logic, and 40-year retention tags."
    },
    {
        "rel_path": "src/components/nelly/NellyEmergencyUI.tsx",
        "scope": "Emergency dialer UI, tel: link protocols (112 fallback vs tenant config), and escalation decoupling."
    }
]

# Primary source repo (ErgoSafe_Reborn_V3) or local workspace
SOURCE_CANDIDATES = [
    Path(r"c:\Users\Desigan Tharmen\Desktop\ErgoSafe_Reborn_V3"),
    Path(__file__).resolve().parent
]

def find_source_root():
    for candidate in SOURCE_CANDIDATES:
        if (candidate / "src" / "store" / "complianceStore.ts").exists():
            return candidate
    return SOURCE_CANDIDATES[0]

def bundle_to_markdown(source_root: Path, output_file: Path):
    with open(output_file, "w", encoding="utf-8") as out:
        out.write("# 📦 STATUTORY COMPLIANCE CORE CODE BUNDLE\n\n")
        out.write("**Source Repository**: `" + str(source_root) + "`  \n")
        out.write("**Bundle Target**: 5 High-Impact Core Statutory & Security Files  \n\n")
        out.write("---\n\n")
        for item in TARGET_FILES:
            rel = item["rel_path"]
            scope = item["scope"]
            file_path = source_root / rel
            ext = Path(rel).suffix.lstrip(".")
            lang = "typescript" if ext == "ts" else "tsx" if ext == "tsx" else "javascript" if ext == "js" else ""

            out.write(f"## File: `{rel}`\n")
            out.write(f"> **Scope**: {scope}\n\n")
            if file_path.exists():
                content = file_path.read_text(encoding="utf-8", errors="replace")
                out.write(f"```{lang}\n{content}\n```\n\n")
            else:
                out.write(f"> *⚠️ File not found at `{file_path}`*\n\n")
    print(f"[+] Markdown bundle written to: {output_file} ({output_file.stat().st_size:,} bytes)")

def bundle_to_xml(source_root: Path, output_file: Path):
    with open(output_file, "w", encoding="utf-8") as out:
        out.write("<statutory_compliance_bundle>\n")
        for item in TARGET_FILES:
            rel = item["rel_path"]
            scope = item["scope"]
            file_path = source_root / rel
            out.write(f'  <file path="{rel}">\n')
            out.write(f'    <scope>{scope}</scope>\n')
            out.write('    <content><![CDATA[\n')
            if file_path.exists():
                content = file_path.read_text(encoding="utf-8", errors="replace")
                out.write(content)
            out.write('\n    ]]></content>\n')
            out.write('  </file>\n\n')
        out.write("</statutory_compliance_bundle>\n")
    print(f"[+] XML bundle written to: {output_file} ({output_file.stat().st_size:,} bytes)")

def bundle_to_zip(source_root: Path, output_file: Path):
    with zipfile.ZipFile(output_file, "w", zipfile.ZIP_DEFLATED) as z:
        for item in TARGET_FILES:
            rel = item["rel_path"]
            file_path = source_root / rel
            if file_path.exists():
                z.write(file_path, arcname=rel)
    print(f"[+] ZIP bundle written to: {output_file} ({output_file.stat().st_size:,} bytes)")

if __name__ == "__main__":
    src = find_source_root()
    base_dir = Path(__file__).resolve().parent
    bundle_to_markdown(src, base_dir / "STATUTORY_COMPLIANCE_BUNDLE.md")
    bundle_to_xml(src, base_dir / "STATUTORY_COMPLIANCE_BUNDLE.xml")
    bundle_to_zip(src, base_dir / "STATUTORY_COMPLIANCE_BUNDLE.zip")
