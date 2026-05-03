import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Loader2 } from 'lucide-react';
import {
  REPORT_PROJECT,
  businessLogicTreeLines,
  changedRuleDetail,
  downloadablePackageLabel,
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
import { downloadModernizedProject } from '../lib/downloadModernizedProject';
import { downloadReportPdf } from '../lib/reportExportPdf';
import PageHeader from '../components/workflow/PageHeader';
import { useWorkflow } from '../workflow/WorkflowContext';

/** Mostly light blue; one rose accent (~20% non-blue family) */
const SUMMARY_LABEL_ACCENTS = [
  'text-live-cyan',
  'text-live-sky',
  'text-sky-200',
  'text-cyan-200',
  'text-teal-300',
  'text-live-rose',
] as const;

export default function ReportPage() {
  const { resetWorkflow } = useWorkflow();
  const [exporting, setExporting] = useState<'pdf' | 'zip' | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const handlePdf = useCallback(async () => {
    setExportError(null);
    setExporting('pdf');
    try {
      await downloadReportPdf();
    } catch (e) {
      setExportError(e instanceof Error ? e.message : 'PDF export failed');
    } finally {
      setExporting(null);
    }
  }, []);

  const handleZip = useCallback(async () => {
    setExportError(null);
    setExporting('zip');
    try {
      await downloadModernizedProject();
    } catch (e) {
      setExportError(e instanceof Error ? e.message : 'ZIP export failed');
    } finally {
      setExporting(null);
    }
  }, []);

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title="Modernization report"
        tagline="Final proof: summary, logic tree, tests, and trace—ready to export or hand off."
        Icon={FileText}
      />

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          to="/modernization"
          className="btn-secondary inline-flex min-h-[44px] w-full items-center justify-center gap-2 px-4 py-3 text-sm"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span className="text-center leading-snug">Back to Modernization Workspace</span>
        </Link>
        <button
          type="button"
          className="btn-primary inline-flex min-h-[44px] w-full items-center justify-center gap-2 px-4 py-3 text-sm disabled:opacity-50"
          disabled={exporting !== null}
          onClick={handlePdf}
        >
          {exporting === 'pdf' ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <Download className="h-4 w-4 shrink-0" />
          )}
          Download Report
        </button>
        <button
          type="button"
          className="btn-secondary inline-flex min-h-[44px] w-full items-center justify-center gap-2 px-4 py-3 text-sm disabled:opacity-50"
          disabled={exporting !== null}
          onClick={handleZip}
        >
          {exporting === 'zip' ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <Download className="h-4 w-4 shrink-0" />
          )}
          <span className="text-center leading-snug">Download Modernized Project</span>
        </button>
        <Link
          to="/"
          className="btn-secondary inline-flex min-h-[44px] w-full items-center justify-center px-4 py-3 text-sm"
          onClick={() => resetWorkflow()}
        >
          Start new analysis
        </Link>
      </div>

      {exportError && (
        <div className="rounded-lg border border-error-red/40 bg-error-red/10 px-4 py-2 text-sm text-error-red max-w-2xl mx-auto">
          {exportError}
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-semibold text-text-strong mb-2">1. Executive summary</h2>
        <p className="mb-2 text-xs text-text-subtle md:text-sm">
          {REPORT_PROJECT.legacy} → {REPORT_PROJECT.modern} · {REPORT_PROJECT.generatedAt()}
        </p>
        <p className="mb-5 text-sm leading-relaxed text-text-muted">{productTagline}</p>
        <dl className="space-y-4">
          {executiveSummaryItems.map((item, i) => (
            <div key={item.label} className="border-b border-border/60 pb-4 last:border-0 last:pb-0">
              <dt
                className={`mb-1 text-xs font-semibold uppercase tracking-wide ${SUMMARY_LABEL_ACCENTS[i % SUMMARY_LABEL_ACCENTS.length]}`}
              >
                {item.label}
              </dt>
              <dd className="text-text-muted leading-relaxed">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-text-strong mb-4">2. Visual business logic summary</h2>
        <pre className="text-sm font-mono text-text-primary/95 bg-[#0d1117] border border-border rounded-lg p-4 overflow-x-auto custom-scrollbar leading-relaxed">
          {businessLogicTreeLines.join('\n')}
        </pre>
      </div>

      <div className="card border-live-sky/35">
        <h2 className="text-xl font-semibold text-text-strong mb-5">
          3. {representativeRuleSectionTitle}
        </h2>
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-xs font-semibold uppercase text-text-subtle mb-1">Rule name</div>
            <p className="text-lg font-semibold text-text-strong">{changedRuleDetail.ruleName}</p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-text-subtle mb-1">Legacy source</div>
            <code className="text-text-muted font-mono">{changedRuleDetail.legacySource}</code>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-text-subtle mb-2">Before</div>
            <pre className="whitespace-pre-wrap rounded-lg border border-border bg-[#0d1117] p-4 font-mono text-xs text-live-sky md:text-sm">
              {changedRuleDetail.beforeCobol}
            </pre>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-text-subtle mb-1">Analysis / visual</div>
            <p className="inline-block rounded-lg border border-live-sky/40 bg-live-sky/12 px-3 py-2 font-mono text-text-strong">
              {changedRuleDetail.visualEdit}
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-text-subtle mb-2">Modern output</div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-[#0d1117] p-4 font-mono text-xs text-success-green custom-scrollbar md:text-sm">
              {changedRuleDetail.modernJava}
            </pre>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto custom-scrollbar">
        <h2 className="text-xl font-semibold text-text-strong mb-4">4. Impacted test paths</h2>
        <table className="w-full text-sm border-collapse min-w-[520px]">
          <thead>
            <tr className="bg-gradient-to-r from-live-sky via-live-cyan to-teal-400 text-[#061018]">
              <th className="border border-black/10 px-3 py-2 text-left font-semibold">Scenario</th>
              <th className="border border-black/10 px-3 py-2 text-left font-semibold">Before</th>
              <th className="border border-black/10 px-3 py-2 text-left font-semibold">After</th>
              <th className="border border-black/10 px-3 py-2 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {impactedTestPaths.map((row, ri) => (
              <tr key={ri} className="border-b border-border hover:bg-panel-bg-secondary/50">
                <td className="px-3 py-2 text-text-strong font-medium">{row.scenario}</td>
                <td className="px-3 py-2 text-text-muted">{row.before}</td>
                <td className="px-3 py-2 text-text-muted">{row.after}</td>
                <td className="px-3 py-2">
                  <span
                    className={
                      row.status === 'Changed'
                        ? 'font-semibold text-live-cyan'
                        : 'text-text-subtle'
                    }
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-sm text-text-muted italic border-t border-border pt-4">{impactedTestNote}</p>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold text-text-strong">5. Modernized project output</h2>
          <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-success-green/15 text-success-green border border-success-green/30 w-fit self-start sm:self-center">
            {downloadablePackageLabel}
          </span>
        </div>
        <pre className="text-sm font-mono text-text-primary/90 bg-[#0d1117] border border-border rounded-lg p-4 overflow-x-auto custom-scrollbar leading-relaxed">
          {modernizedProjectTreeLines.join('\n')}
        </pre>
      </div>

      <div className="card overflow-x-auto custom-scrollbar">
        <h2 className="text-xl font-semibold text-text-strong mb-4">6. Traceability mapping</h2>
        <table className="w-full text-xs md:text-sm border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-panel-bg-secondary text-text-strong">
              {traceabilityHeaders.map((h) => (
                <th key={h} className="text-left font-semibold px-2 py-2 border border-border">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {traceabilityRows.map((row, ri) => (
              <tr key={ri} className="border-b border-border hover:bg-panel-bg-secondary/40">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-2 py-2 align-top text-text-muted font-mono border-r border-border/40 last:border-r-0">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-success-green/30 bg-success-green/5 px-6 py-5 text-center">
        <p className="text-base md:text-lg text-text-strong font-medium leading-relaxed max-w-4xl mx-auto">
          {finalModernizationStatement}
        </p>
      </div>
    </div>
  );
}
