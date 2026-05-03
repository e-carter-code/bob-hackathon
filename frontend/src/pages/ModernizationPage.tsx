import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Sparkles } from 'lucide-react';
import {
  DEFAULT_LEGACY_PATH,
  DEFAULT_MODERN_PATH,
  FALLBACK_MODERN_PATH,
  legacyFileContents,
  legacyToModernMap,
  modernFileContents,
} from '../data/modernizationRealProjectData';
import { downloadModernizedProject } from '../lib/downloadModernizedProject';
import SyntaxCodeViewer from '../components/modernization/SyntaxCodeViewer';
import PageHeader from '../components/workflow/PageHeader';
import { useWorkflow } from '../workflow/WorkflowContext';
import {
  readModernizationWorkspaceReady,
  writeModernizationWorkspaceReady,
} from '../workflow/projectSession';

interface TreeNode {
  name: string;
  path?: string;
  children?: TreeNode[];
}

const legacyTree: TreeNode = {
  name: 'loan-approvals-COBOL',
  children: [
    {
      name: 'src',
      children: [
        { name: 'LNMAIN.cbl', path: 'src/LNMAIN.cbl' },
        { name: 'LNRULES.cbl', path: 'src/LNRULES.cbl' },
        { name: 'LNRATE.cbl', path: 'src/LNRATE.cbl' },
      ],
    },
    {
      name: 'copy',
      children: [
        { name: 'APPLICANT.cpy', path: 'copy/APPLICANT.cpy' },
        { name: 'DECISION.cpy', path: 'copy/DECISION.cpy' },
      ],
    },
  ],
};

const modernTree: TreeNode = {
  name: 'loan-approval-service',
  children: [
    { name: 'README.md', path: 'README.md' },
    { name: 'pom.xml', path: 'pom.xml' },
    {
      name: 'src',
      children: [
        {
          name: 'main',
          children: [
            {
              name: 'java',
              children: [
                {
                  name: 'com',
                  children: [
                    {
                      name: 'legacylogic',
                      children: [
                        {
                          name: 'loan',
                          children: [
                            {
                              name: 'batch',
                              children: [
                                {
                                  name: 'BatchRowResult.java',
                                  path: 'src/main/java/com/legacylogic/loan/batch/BatchRowResult.java',
                                },
                                {
                                  name: 'LoanBatchProcessor.java',
                                  path: 'src/main/java/com/legacylogic/loan/batch/LoanBatchProcessor.java',
                                },
                                {
                                  name: 'LoanBatchRunner.java',
                                  path: 'src/main/java/com/legacylogic/loan/batch/LoanBatchRunner.java',
                                },
                              ],
                            },
                            {
                              name: 'cobol',
                              children: [
                                {
                                  name: 'CobolDecimal.java',
                                  path: 'src/main/java/com/legacylogic/loan/cobol/CobolDecimal.java',
                                },
                              ],
                            },
                            {
                              name: 'model',
                              children: [
                                {
                                  name: 'ApplicantCalc.java',
                                  path: 'src/main/java/com/legacylogic/loan/model/ApplicantCalc.java',
                                },
                                {
                                  name: 'ApplicantRecord.java',
                                  path: 'src/main/java/com/legacylogic/loan/model/ApplicantRecord.java',
                                },
                                {
                                  name: 'DecisionRecord.java',
                                  path: 'src/main/java/com/legacylogic/loan/model/DecisionRecord.java',
                                },
                                {
                                  name: 'RuleFlags.java',
                                  path: 'src/main/java/com/legacylogic/loan/model/RuleFlags.java',
                                },
                              ],
                            },
                            {
                              name: 'parser',
                              children: [
                                {
                                  name: 'ApplicantLineParser.java',
                                  path: 'src/main/java/com/legacylogic/loan/parser/ApplicantLineParser.java',
                                },
                              ],
                            },
                            {
                              name: 'rate',
                              children: [
                                {
                                  name: 'LnRateEngine.java',
                                  path: 'src/main/java/com/legacylogic/loan/rate/LnRateEngine.java',
                                },
                              ],
                            },
                            {
                              name: 'rules',
                              children: [
                                {
                                  name: 'LnRulesEngine.java',
                                  path: 'src/main/java/com/legacylogic/loan/rules/LnRulesEngine.java',
                                },
                                {
                                  name: 'RatioCalculator.java',
                                  path: 'src/main/java/com/legacylogic/loan/rules/RatioCalculator.java',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'test',
          children: [
            {
              name: 'java',
              children: [
                {
                  name: 'com',
                  children: [
                    {
                      name: 'legacylogic',
                      children: [
                        {
                          name: 'loan',
                          children: [
                            {
                              name: 'GoldenCobolParityTest.java',
                              path: 'src/test/java/com/legacylogic/loan/GoldenCobolParityTest.java',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const PROGRESS_DURATION_MS = 5200;

const phaseLabels: { at: number; text: string }[] = [
  { at: 0, text: 'Loading loan-approvals-COBOL structure…' },
  { at: 18, text: 'Indexing LNMAIN, LNRULES, LNRATE and copybooks…' },
  { at: 36, text: 'Linking paragraphs to Java (RatioCalculator, LnRulesEngine, LnRateEngine)…' },
  { at: 52, text: 'Materializing Maven module loan-approval-service…' },
  { at: 70, text: 'Wiring golden parity test vs expected-output.txt…' },
  { at: 88, text: 'Workspace ready — explorer and download unlocked.' },
];

function statusForProgress(pct: number): string {
  let label = phaseLabels[0].text;
  for (const phase of phaseLabels) {
    if (pct >= phase.at) label = phase.text;
  }
  return label;
}

function ExplorerTree({
  node,
  depth,
  selectedPath,
  onSelectFile,
  relatedPaths,
  primaryPath,
}: {
  node: TreeNode;
  depth: number;
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  relatedPaths: Set<string>;
  primaryPath: string | null;
}) {
  const [open, setOpen] = useState(true);

  if (node.path) {
    const isSelected = selectedPath === node.path;
    const isRelated = relatedPaths.has(node.path);
    const isPrimary = primaryPath === node.path;
    return (
      <button
        type="button"
        onClick={() => onSelectFile(node.path!)}
        className={`w-full text-left flex items-center gap-2 py-1 px-2 rounded text-xs font-mono transition-colors ${
          isSelected
            ? 'border border-live-cyan/55 bg-live-cyan/20 text-text-strong'
            : isPrimary
              ? 'border border-live-sky/45 bg-live-sky/12 text-text-strong'
              : isRelated
                ? 'bg-success-green/10 text-text-primary border border-success-green/30'
                : 'text-text-muted hover:bg-panel-bg-secondary'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <span className="truncate flex-1">{node.name}</span>
        {isPrimary ? (
          <span className="shrink-0 rounded bg-gradient-to-r from-live-cyan to-live-mint px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#061018]">
            Primary
          </span>
        ) : isRelated ? (
          <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-success-green/20 text-success-green">
            Related
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center gap-1 py-1 text-xs font-medium text-text-strong hover:bg-panel-bg-secondary rounded px-2"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        <span className="text-text-subtle w-3">{open ? '▼' : '▶'}</span>
        {node.name}
      </button>
      {open &&
        node.children?.map((child) => (
          <ExplorerTree
            key={child.name + (child.path ?? '')}
            node={child}
            depth={depth + 1}
            selectedPath={selectedPath}
            onSelectFile={onSelectFile}
            relatedPaths={relatedPaths}
            primaryPath={primaryPath}
          />
        ))}
    </div>
  );
}

export default function ModernizationPage() {
  const navigate = useNavigate();
  const { unlockTo } = useWorkflow();
  const [progressPct, setProgressPct] = useState(() =>
    readModernizationWorkspaceReady() ? 100 : 0,
  );
  const [workspaceReady, setWorkspaceReady] = useState(readModernizationWorkspaceReady);

  const [selectedLegacyPath, setSelectedLegacyPath] = useState(DEFAULT_LEGACY_PATH);
  const [selectedModernPath, setSelectedModernPath] = useState(DEFAULT_MODERN_PATH);
  const [relatedModernPaths, setRelatedModernPaths] = useState<Set<string>>(
    () => new Set(legacyToModernMap[DEFAULT_LEGACY_PATH]?.relatedModernFiles ?? [])
  );
  const [primaryModernPath, setPrimaryModernPath] = useState<string | null>(
    legacyToModernMap[DEFAULT_LEGACY_PATH]?.primaryModernFile ?? null
  );
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (workspaceReady) return;

    const start = performance.now();
    let raf = 0;
    let cancelled = false;

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / PROGRESS_DURATION_MS);
      setProgressPct(Math.round(t * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setWorkspaceReady(true);
        writeModernizationWorkspaceReady();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [workspaceReady]);

  const legacySource = legacyFileContents[selectedLegacyPath] ?? '// No preview for this path.';

  const modernSource =
    modernFileContents[selectedModernPath] ?? '// Select a generated file to preview.';

  const selectLegacy = useCallback((path: string) => {
    setSelectedLegacyPath(path);
    const entry = legacyToModernMap[path];
    if (entry) {
      setRelatedModernPaths(new Set(entry.relatedModernFiles));
      setPrimaryModernPath(entry.primaryModernFile);
      setSelectedModernPath(entry.primaryModernFile);
    } else {
      setRelatedModernPaths(new Set());
      setPrimaryModernPath(null);
      setSelectedModernPath(FALLBACK_MODERN_PATH);
    }
  }, []);

  const selectModern = useCallback((path: string) => {
    setSelectedModernPath(path);
  }, []);

  const handleDownload = async () => {
    setDownloadError(null);
    setDownloadSuccess(false);
    try {
      await downloadModernizedProject();
      setDownloadSuccess(true);
      window.setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      setDownloadError(e instanceof Error ? e.message : 'Zip generation failed');
    }
  };

  const goToReport = () => {
    unlockTo(5);
    navigate('/report');
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Modernization workspace"
        tagline="COBOL rules out. Java services in."
        Icon={Sparkles}
      />
      <div className="flex flex-wrap gap-2">
        <Link to="/editor" className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to visual editor
        </Link>
        <button
          type="button"
          className="rounded-lg border-2 border-live-cyan/85 bg-transparent px-4 py-2 text-sm font-semibold text-live-cyan transition-colors hover:border-live-mint hover:text-live-mint"
          onClick={goToReport}
        >
          Generate modernization report
        </button>
        <button
          type="button"
          className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Download modernized project
        </button>
      </div>

      {downloadSuccess && (
        <div className="rounded-lg border border-success-green/40 bg-success-green/10 px-4 py-2 text-sm text-success-green">
          Modernized project downloaded
        </div>
      )}
      {downloadError && (
        <div className="rounded-lg border border-error-red/40 bg-error-red/10 px-4 py-2 text-sm text-error-red">
          {downloadError}
        </div>
      )}

      {!workspaceReady && (
        <div className="card py-8 px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-3">
            <h2 className="text-lg font-semibold text-text-strong">Modernizing…</h2>
            <span className="text-2xl font-bold tabular-nums text-live-cyan">{progressPct}%</span>
          </div>
          <p className="text-sm text-text-muted mb-4 min-h-[1.25rem]">{statusForProgress(progressPct)}</p>
          <div className="h-3 rounded-full bg-panel-bg-secondary border border-border overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-live-cyan via-live-sky to-live-mint transition-[width] duration-150 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-text-subtle mt-3">
            Generating the modern service package — explorers and code preview unlock when this finishes.
          </p>
        </div>
      )}

      {workspaceReady && (
      <div className="grid min-h-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-text-strong px-1">Legacy — Explorer</h3>
          <p className="text-xs text-text-subtle px-1 font-medium">loan-approvals-COBOL</p>
          <div className="h-[200px] shrink-0 rounded-lg border border-border bg-panel-bg p-2 overflow-y-auto custom-scrollbar">
            {legacyTree.children?.map((child) => (
              <ExplorerTree
                key={child.name}
                node={child}
                depth={0}
                selectedPath={selectedLegacyPath}
                onSelectFile={selectLegacy}
                relatedPaths={new Set()}
                primaryPath={null}
              />
            ))}
          </div>
          <div className="h-[600px] shrink-0 min-h-0 flex flex-col overflow-hidden">
            <SyntaxCodeViewer title="Legacy Source" filePath={selectedLegacyPath} content={legacySource} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-text-strong px-1">Modernized — Explorer</h3>
          <p className="text-xs text-text-subtle px-1 font-medium">loan-approval-service</p>
          <div className="h-[200px] shrink-0 rounded-lg border border-border bg-panel-bg p-2 overflow-y-auto custom-scrollbar">
            {modernTree.children?.map((child) => (
              <ExplorerTree
                key={child.name}
                node={child}
                depth={0}
                selectedPath={selectedModernPath}
                onSelectFile={selectModern}
                relatedPaths={relatedModernPaths}
                primaryPath={primaryModernPath}
              />
            ))}
          </div>
          <div className="h-[600px] shrink-0 min-h-0 flex flex-col overflow-hidden">
            <SyntaxCodeViewer title="Modernized Output" filePath={selectedModernPath} content={modernSource} />
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
