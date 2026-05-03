import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import WorkflowStepper from '../components/workflow/WorkflowStepper';
import { useWorkflow } from '../workflow/WorkflowContext';

const FEATURE_CARD =
  'card flex h-full min-h-[280px] flex-col border-border transition-all duration-200 hover:border-live-sky/45 hover:shadow-[0_0_24px_-10px_rgba(125,211,252,0.18)]';
const ICON_WELL =
  'mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-live-sky/15';
const ICON_CLASS = 'h-6 w-6 text-live-sky';

const HERO_TAGS = [
  { text: 'COBOL depth', className: 'text-live-sky' },
  { text: 'Visual rules', className: 'text-live-mint' },
  { text: 'Test impact', className: 'text-live-rose' },
  { text: 'Java / Quarkus', className: 'text-live-violet' },
  { text: 'Traceability', className: 'text-live-cyan' },
] as const;

/** 72° between consecutive labels; base phase puts “Visual rules” at -90°; +90° rotates the whole ring (east vs north). */
const HERO_ANGLE_STEP = 360 / HERO_TAGS.length;
const HERO_FIRST_ANGLE_DEG = -90 - HERO_ANGLE_STEP; // -162° for COBOL before layout rotation
const HERO_LAYOUT_ROTATION_DEG = 90;

const heroOrbitShellStyle: CSSProperties = {
  aspectRatio: '1',
  maxHeight: 'min(72vh, 680px)',
  /** Label orbit radius (×0.7 vs prior ring so text sits closer to center). */
  ['--orbit-r' as string]: 'clamp(7.35rem, 29.4vmin, 17.15rem)',
};

export default function HomePage() {
  const { setUnlockedExact } = useWorkflow();

  return (
    <div>
      <div className="space-y-5 pb-0 pt-8 text-center sm:space-y-6 sm:pt-10 md:pt-12">
        <div className="inline-block rounded-full border border-live-sky/40 bg-live-sky/10 px-5 py-1.5 text-sm font-medium text-live-sky">
          IBM Bob Dev Day
        </div>
        <h1 className="text-5xl font-bold leading-tight text-text-strong md:text-6xl">
          Business Logic Time <span className="text-live-sky">Machine</span>
        </h1>

        <div className="mx-auto w-full max-w-[min(98vw,67rem)] px-1 sm:px-2">
          <div
            className="isolate relative mx-auto w-full overflow-visible"
            style={heroOrbitShellStyle}
          >
            {/* Image: small, drawn behind orbit labels (z-0 vs z-20). */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center p-2 sm:p-3">
              <div className="relative w-[min(92%,59rem)] max-w-[868px] overflow-hidden bg-app-bg sm:w-[min(94%,64rem)] sm:max-w-[980px]">
                <img
                  src="/back.png"
                  alt=""
                  width={1200}
                  height={675}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto block max-h-[min(84vmin,616px)] w-full bg-app-bg object-contain object-top sm:max-h-[min(95vmin,728px)] md:max-h-[min(101vmin,784px)]"
                />
              </div>
            </div>

            {HERO_TAGS.map(({ text, className }, i) => {
              const angleDeg = HERO_FIRST_ANGLE_DEG + i * HERO_ANGLE_STEP + HERO_LAYOUT_ROTATION_DEG;
              return (
                <span
                  key={text}
                  className={`absolute left-1/2 top-1/2 z-20 max-w-[min(44vw,11rem)] whitespace-normal text-center text-base font-bold uppercase leading-tight tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:max-w-[10rem] sm:text-xl md:max-w-none md:text-2xl md:whitespace-nowrap ${className}`}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angleDeg}deg) translateY(calc(-1 * var(--orbit-r))) rotate(${-angleDeg}deg)`,
                  }}
                >
                  {text}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-0">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-strong md:text-3xl">
            What You Can Do In BLT<span className="text-live-sky">M</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
            End-to-end steps from legacy discovery through visual rules, modernization, and export — each card is a
            milestone on the path above.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className={FEATURE_CARD}>
          <div className={ICON_WELL}>
            <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-text-strong">Discover Legacy Logic</h3>
          <p className="flex-1 leading-relaxed text-text-muted">
            Analyze COBOL programs, copybooks, and batch jobs as one connected legacy project.
          </p>
        </div>

        <div className={FEATURE_CARD}>
          <div className={ICON_WELL}>
            <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-text-strong">Visualize Business Rules</h3>
          <p className="flex-1 leading-relaxed text-text-muted">
            Turn nested procedural logic into an editable business-rule map.
          </p>
        </div>

        <div className={FEATURE_CARD}>
          <div className={ICON_WELL}>
            <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-text-strong">Edit Rules Safely</h3>
          <p className="flex-1 leading-relaxed text-text-muted">
            Change business thresholds visually; your edits appear on the modernization report for this session.
          </p>
        </div>

        <div className={FEATURE_CARD}>
          <div className={ICON_WELL}>
            <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-text-strong">Modernize to Java / Quarkus</h3>
          <p className="flex-1 leading-relaxed text-text-muted">
            Generate a clean modern service project with resources, services, models, tests, and traceability
            mapping from the whole legacy program — not a single COBOL file mapped to a single Java class.
          </p>
        </div>

        <div className={FEATURE_CARD}>
          <div className={ICON_WELL}>
            <svg className={ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-text-strong">Download Modernized Project</h3>
          <div className="flex flex-1 flex-col gap-3">
            <p className="leading-relaxed text-text-muted">
              Export the generated modern service package as a zip file for review, CI, or handoff.
            </p>
            <p className="text-sm leading-relaxed text-text-muted">
              The modernization workspace unlocks after you complete the visual editor and run modernize from
              there — follow the numbered flow above.
            </p>
          </div>
        </div>
        </div>
      </div>

      <div className="mt-16 space-y-6">
        <h2 className="text-center text-2xl font-bold text-text-strong">Modernization workflow</h2>
        <WorkflowStepper />
        <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-text-muted">
          The strip matches your progress everywhere: the current step uses the same light-blue + mint accent as
          primary buttons; light-blue outlined steps are unlocked and you can jump to them; dim dashed steps are not
          unlocked yet. Choosing a project on Upload resets later steps when you start a new path.
        </p>
      </div>

      <div className="mt-16 space-y-6 py-12 text-center">
        <h2 className="text-3xl font-bold text-text-strong">Ready to use the product path?</h2>
        <p className="mx-auto max-w-2xl text-text-muted">
          Run the full pipeline in Business Logic Time Machine: upload and analyze your legacy project, edit rules
          in the visual editor, modernize in the workspace, export the package, and close the loop with the
          modernization report.
        </p>
        <Link to="/upload" className="btn-primary inline-block px-8 py-3 text-lg" onClick={() => setUnlockedExact(1)}>
          Start upload
        </Link>
      </div>
    </div>
  );
}
