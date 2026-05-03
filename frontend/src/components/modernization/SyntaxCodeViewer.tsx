import { useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileCode } from 'lucide-react';
import { computeRuleHighlightLines, prismLanguageForPath } from '../../data/modernizationCodeUtils';
import { ruleHighlightNeedles } from '../../data/modernizationRealProjectData';

function markThresholdDigits(text: string) {
  const parts = text.split(/(\b740\b|\b680\b|\b620\b|\b580\b|\b43\.00\b)/g);
  return parts.map((part, i) => {
    if (part === '740' || part === '680' || part === '620' || part === '580' || part === '43.00') {
      return (
        <mark
          key={i}
          className="mx-px rounded bg-live-sky/45 px-0.5 font-semibold text-text-strong"
        >
          {part}
        </mark>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export type SyntaxCodeHighlightRange = { start: number; end: number };

function excerptRangeToFileLines(
  range: SyntaxCodeHighlightRange,
  snippetStartingFileLine: number | undefined,
): SyntaxCodeHighlightRange {
  if (snippetStartingFileLine == null) return range;
  const off = snippetStartingFileLine - 1;
  return { start: range.start + off, end: range.end + off };
}

export default function SyntaxCodeViewer({
  title,
  filePath,
  content,
  /** Inclusive 1-based line range within `content` to highlight (overrides needle-based highlights). */
  highlightLineRange,
  /** When set, gutter line numbers start at this value (first line of `content` in the repo file). */
  snippetStartingFileLine,
}: {
  title: string;
  filePath: string;
  content: string;
  highlightLineRange?: SyntaxCodeHighlightRange;
  snippetStartingFileLine?: number;
}) {
  const language = prismLanguageForPath(filePath);
  const needles = ruleHighlightNeedles[filePath] ?? [];

  const highlightLines = useMemo(() => {
    if (highlightLineRange) {
      const s = new Set<number>();
      const off = snippetStartingFileLine != null ? snippetStartingFileLine - 1 : 0;
      for (let i = highlightLineRange.start; i <= highlightLineRange.end; i++) {
        s.add(i + off);
      }
      return s;
    }
    return computeRuleHighlightLines(content, needles);
  }, [content, needles, highlightLineRange, snippetStartingFileLine]);

  const primaryNeedle = needles[0];
  const excerptLineRange =
    highlightLineRange != null
      ? excerptRangeToFileLines(highlightLineRange, snippetStartingFileLine)
      : null;
  const startingLineNumber = snippetStartingFileLine ?? 1;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col rounded-lg border border-border overflow-hidden bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-panel-bg-secondary">
        <span className="text-sm font-semibold text-text-strong">{title}</span>
        <FileCode className="w-4 h-4 text-text-subtle" />
      </div>
      <div className="px-3 py-1.5 text-xs font-mono text-text-muted border-b border-border bg-[#252526] truncate">
        {filePath}
      </div>
      {excerptLineRange ? (
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-live-sky/25 bg-live-sky/[0.07] px-3 py-2 text-xs">
          <span className="shrink-0 font-semibold uppercase tracking-wide text-live-sky">
            {snippetStartingFileLine != null ? 'Source lines' : 'Excerpt focus'}
          </span>
          <code className="font-mono text-text-primary/95">
            {excerptLineRange.start}–{excerptLineRange.end}
            {snippetStartingFileLine != null ? ' in repo file' : ''}
          </code>
        </div>
      ) : primaryNeedle ? (
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-live-sky/25 bg-live-sky/[0.07] px-3 py-2 text-xs">
          <span className="shrink-0 font-semibold uppercase tracking-wide text-live-sky">
            Rule focus
          </span>
          <code className="font-mono text-text-primary/95 break-all">{markThresholdDigits(primaryNeedle)}</code>
        </div>
      ) : (
        <div className="px-3 py-1.5 text-[11px] text-text-subtle border-b border-border bg-[#252526]">
          VS Code-style syntax colors (Dark+ theme).
        </div>
      )}
      <div className="flex-1 overflow-auto custom-scrollbar modernization-syntax-viewer">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers
          startingLineNumber={startingLineNumber}
          wrapLines
          lineProps={(lineNumber) => {
            const isRule = highlightLines.has(lineNumber);
            return {
              style: {
                display: 'block',
                width: '100%',
                backgroundColor: isRule ? 'rgba(245, 158, 11, 0.12)' : undefined,
                boxShadow: isRule ? 'inset 4px 0 0 0 #f59e0b' : undefined,
              },
            };
          }}
          customStyle={{
            margin: 0,
            padding: '12px 0 12px 4px',
            fontSize: '13px',
            lineHeight: 1.55,
            background: '#1e1e1e',
          }}
          codeTagProps={{
            style: {
              fontFamily:
                "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas, monospace",
            },
          }}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
