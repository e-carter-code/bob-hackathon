import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  REPORT_PROJECT,
  businessLogicTreeLines,
  changedRuleDetail,
  executiveSummaryItems,
  finalModernizationStatement,
  impactedTestNote,
  impactedTestPaths,
  modernizedProjectTreeLines,
  productTagline,
  representativeRuleSectionTitle,
  traceabilityHeaders,
  traceabilityRows,
} from '../data/reportDemoContent';

/**
 * jsPDF standard fonts only support WinAnsi. Replace Unicode that would render as wrong glyphs.
 */
function pdfSafeText(input: string): string {
  let s = input;
  s = s.replace(/\u2192/g, '->'); // RIGHTWARDS ARROW
  s = s.replace(/\u2190/g, '<-');
  s = s.replace(/\u2014/g, '--'); // em dash
  s = s.replace(/\u2013/g, '-'); // en dash
  s = s.replace(/\u2212/g, '-'); // minus sign
  s = s.replace(/\u00b7/g, '-'); // middle dot (in header)
  s = s.replace(/\u2026/g, '...'); // ellipsis
  s = s.replace(/\u2018|\u2019/g, "'"); // smart single quotes
  s = s.replace(/\u201c|\u201d/g, '"'); // smart double quotes
  // Box drawing (tree / project structure)
  s = s.replace(/\u251c\u2500\u2500/g, '|--'); // ├──
  s = s.replace(/\u2514\u2500\u2500/g, '`--'); // └── (ASCII tree corner in monospace)
  s = s.replace(/\u2502/g, '|'); // │
  s = s.replace(/\u2500/g, '-'); // ─ (any remaining)
  return s;
}

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const safe = pdfSafeText(text);
  const lines = doc.splitTextToSize(safe, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function pdfCellRow(row: string[]): string[] {
  return row.map((c) => pdfSafeText(c));
}

export async function downloadReportPdf(): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  const maxW = pageW - margin * 2;
  let y = 16;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(pdfSafeText('Business Logic Time Machine — Modernization Report'), margin, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    pdfSafeText(`Business Logic Time Machine · ${REPORT_PROJECT.generatedAt()}`),
    margin,
    y
  );
  doc.setTextColor(0, 0, 0);
  y += 8;

  doc.setFontSize(9);
  y = addWrappedText(doc, productTagline, margin, y, maxW, 4.2) + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(pdfSafeText('1. Executive summary'), margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  for (const item of executiveSummaryItems) {
    doc.setFont('helvetica', 'bold');
    const head = pdfSafeText(`${item.label}: `);
    doc.text(head, margin, y);
    const w = doc.getTextWidth(head);
    doc.setFont('helvetica', 'normal');
    y = addWrappedText(doc, item.value, margin + w, y, maxW - w, 4.2) + 1;
    if (y > 270) {
      doc.addPage();
      y = 16;
    }
  }
  y += 4;

  if (y > 230) {
    doc.addPage();
    y = 16;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(pdfSafeText('2. Visual business logic summary'), margin, y);
  y += 5;
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  for (const line of businessLogicTreeLines) {
    doc.text(pdfSafeText(line), margin, y);
    y += 3.8;
    if (y > 278) {
      doc.addPage();
      y = 16;
    }
  }
  doc.setFont('helvetica', 'normal');
  y += 4;

  if (y > 210) {
    doc.addPage();
    y = 16;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(pdfSafeText(`3. ${representativeRuleSectionTitle}`), margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  y = addWrappedText(doc, `Rule: ${changedRuleDetail.ruleName}`, margin, y, maxW, 4.2) + 1;
  y = addWrappedText(doc, `Legacy source: ${changedRuleDetail.legacySource}`, margin, y, maxW, 4.2) + 2;
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  y = addWrappedText(doc, `Before:\n${changedRuleDetail.beforeCobol}`, margin, y, maxW, 3.6) + 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  y = addWrappedText(doc, `Analysis / visual: ${changedRuleDetail.visualEdit}`, margin, y, maxW, 4.2) + 2;
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  y = addWrappedText(doc, `Modern:\n${changedRuleDetail.modernJava}`, margin, y, maxW, 3.6) + 4;
  doc.setFont('helvetica', 'normal');

  if (y > 200) {
    doc.addPage();
    y = 16;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(pdfSafeText('4. Impacted test paths'), margin, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [pdfCellRow(['Scenario', 'Before', 'After', 'Status'])],
    body: impactedTestPaths.map((r) => pdfCellRow([r.scenario, r.before, r.after, r.status])),
    styles: { fontSize: 8, cellPadding: 1.5 },
    headStyles: { fillColor: [15, 98, 254] },
    margin: { left: margin, right: margin },
  });
  y = ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y) + 4;
  doc.setFontSize(8);
  y = addWrappedText(doc, impactedTestNote, margin, y, maxW, 3.8) + 6;

  if (y > 220) {
    doc.addPage();
    y = 16;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(pdfSafeText('5. Modernized project output'), margin, y);
  y += 5;
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  for (const line of modernizedProjectTreeLines) {
    const raw = line.length > 95 ? `${line.slice(0, 92)}...` : line;
    doc.text(pdfSafeText(raw), margin, y);
    y += 3.6;
    if (y > 278) {
      doc.addPage();
      y = 16;
    }
  }
  doc.setFont('helvetica', 'normal');
  y += 4;

  if (y > 200) {
    doc.addPage();
    y = 16;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(pdfSafeText('6. Traceability mapping'), margin, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [pdfCellRow([...traceabilityHeaders])],
    body: traceabilityRows.map((r) => pdfCellRow([...r])),
    styles: { fontSize: 7, cellPadding: 1 },
    headStyles: { fillColor: [15, 98, 254] },
    margin: { left: margin, right: margin },
  });
  y = ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y) + 8;

  if (y > 250) {
    doc.addPage();
    y = 16;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(pdfSafeText('Closing'), margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  y = addWrappedText(doc, finalModernizationStatement, margin, y, maxW, 4.5) + 4;

  doc.save('legacy-logic-studio-modernization-report.pdf');
}
