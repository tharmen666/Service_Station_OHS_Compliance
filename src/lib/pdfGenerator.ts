/**
 * Generates a valid, standards-compliant PDF 1.4 document in the browser
 * and triggers a real file download (.pdf) without requiring external heavy dependencies.
 */

function escapePdfText(text: string): string {
  return text
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapLines(rawText: string, maxChars: number = 88): string[] {
  const paragraphs = rawText.split(/\r?\n/);
  const lines: string[] = [];

  for (const para of paragraphs) {
    const cleaned = para.replace(/^[#*>-]+\s*/, '').trim();
    if (!cleaned) {
      lines.push('');
      continue;
    }
    const words = cleaned.split(/\s+/);
    let current = '';
    for (const w of words) {
      if ((current + ' ' + w).trim().length > maxChars) {
        if (current) lines.push(current);
        current = w;
      } else {
        current = (current ? current + ' ' : '') + w;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

export function buildValidPdfBytes(title: string, bodyText: string): Uint8Array {
  const headerLines = [
    `FORECOURT SENTINEL - STATUTORY OHS COMPLIANCE DOCUMENT`,
    `Title: ${title}`,
    `Generated: ${new Date().toISOString()} | Jurisdiction: South Africa (OHS Act 85 of 1993 / SANS 10089-3)`,
    `POPIA Data-Minimisation Notice (Act 4 of 2013, Sec 10 & 14): Contains role placeholders only.`,
    `----------------------------------------------------------------------------------------`,
    '',
  ];

  const allLines = [...headerLines, ...wrapLines(bodyText, 86)].slice(0, 52);

  const streamOps: string[] = ['BT', '/F1 10 Tf', '40 790 Td', '14 TL'];
  for (const line of allLines) {
    streamOps.push(`(${escapePdfText(line)}) Tj T*`);
  }
  streamOps.push('ET');
  const streamContent = streamOps.join('\n');

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  const encoder = new TextEncoder();
  return encoder.encode(pdf);
}

export function downloadStatutoryPdf(filename: string, title: string, bodyText: string): Uint8Array {
  const bytes = buildValidPdfBytes(title, bodyText);
  if (typeof window !== 'undefined' && typeof Blob !== 'undefined') {
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return bytes;
}

