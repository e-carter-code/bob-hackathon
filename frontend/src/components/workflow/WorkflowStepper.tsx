import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WORKFLOW_STEPS, stepIndexFromPathname } from '../../workflow/workflowConfig';
import { useWorkflow } from '../../workflow/WorkflowContext';

/** Compact chevrons centered in the gap between step circles */
const CONNECTOR_CHEVRON_COUNT = 4;

const STEPPER_CHROME =
  'w-full rounded-xl border border-border/90 bg-panel-bg shadow-sm';

type WorkflowStepperProps = {
  className?: string;
};

/**
 * Horizontal scroll lives on an outer wrapper; inner padding gives ring / glow / scale room
 * so effects are not clipped (overflow-x would otherwise pair with vertical clipping).
 */
export default function WorkflowStepper({ className = '' }: WorkflowStepperProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { unlockedStep } = useWorkflow();
  const currentIndex = stepIndexFromPathname(location.pathname);

  const shell = className.trim() ? `${STEPPER_CHROME} ${className}`.trim() : STEPPER_CHROME;

  return (
    <nav aria-label="Modernization workflow" className={shell}>
      <div
        className={[
          'overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'px-2 sm:px-3',
        ].join(' ')}
      >
        {/* Vertical padding inside scroll track so box-shadow / ring stay inside paint bounds */}
        <div className="mx-auto max-w-6xl py-8 sm:py-10">
          <ol className="flex w-full min-w-0 flex-row flex-nowrap items-start justify-center">
            {WORKFLOW_STEPS.map((step, i) => {
              const isCurrent = i === currentIndex;
              const isUnavailable = i > unlockedStep;
              const isAvailable = i <= unlockedStep && !isCurrent;
              const connectorUnlocked = i > 0 && i <= unlockedStep;

              const baseCircle =
                'relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 sm:h-12 sm:w-12';

              let circleClass = baseCircle;
              if (isUnavailable) {
                circleClass +=
                  ' cursor-not-allowed border border-dashed border-border bg-panel-bg-secondary/80 text-text-subtle/80 opacity-90';
              } else if (isCurrent) {
                /* Same “button” recipe as .btn-primary: mostly light blue + mint cap */
                circleClass +=
                  ' z-[2] scale-110 border-2 border-live-cyan bg-gradient-to-br from-live-cyan via-live-sky to-live-mint text-[#061018] ring-4 ring-live-sky/45 shadow-[0_0_20px_-4px_rgba(125,211,252,0.45),0_0_28px_-6px_rgba(52,211,153,0.25)]';
              } else if (isAvailable) {
                circleClass +=
                  ' cursor-pointer border-2 border-live-sky bg-app-bg text-live-sky shadow-[0_0_0_1px_rgba(125,211,252,0.22)] hover:scale-[1.06] hover:border-sky-200 hover:text-sky-100 hover:shadow-[0_0_22px_rgba(125,211,252,0.42)]';
              }

              const labelClass = isUnavailable
                ? 'text-text-subtle'
                : isCurrent
                  ? 'font-bold text-live-cyan'
                  : 'font-semibold text-live-sky';

              const subClass = isUnavailable
                ? 'text-text-subtle/75'
                : isCurrent
                  ? 'font-medium text-live-sky/95'
                  : 'text-live-sky/85';

              const handleClick = () => {
                if (isUnavailable || isCurrent) return;
                navigate(step.path);
              };

              return (
                <Fragment key={step.path}>
                  {i > 0 ? (
                    <li
                      aria-hidden
                      className="flex min-w-0 flex-1 basis-0 items-center justify-center self-start pt-3 sm:pt-4"
                    >
                      <div
                        className={`flex h-11 items-center justify-center sm:h-12 ${
                          connectorUnlocked ? 'text-live-sky/65' : 'text-border'
                        }`}
                      >
                        {Array.from({ length: CONNECTOR_CHEVRON_COUNT }, (_, ci) => (
                          <ChevronRight
                            key={ci}
                            strokeWidth={2.5}
                            className="-mx-1 h-4 w-4 shrink-0 first:ml-0 last:mr-0 sm:h-[1.15rem] sm:w-[1.15rem]"
                          />
                        ))}
                      </div>
                    </li>
                  ) : null}
                  <li
                    aria-current={isCurrent ? 'step' : undefined}
                    className="flex w-[4.5rem] shrink-0 flex-col items-center sm:w-[5.25rem]"
                  >
                    <div className="flex w-full flex-col items-center gap-1.5 px-0.5 text-center sm:gap-2">
                      <div className="flex w-full justify-center px-1 pb-1.5 pt-3 sm:px-2 sm:pb-2 sm:pt-4">
                        <button
                          type="button"
                          disabled={isUnavailable || isCurrent}
                          onClick={handleClick}
                          className={circleClass}
                          title={
                            isUnavailable
                              ? 'Complete earlier steps to unlock'
                              : isCurrent
                                ? 'Current step'
                                : `${step.label}: ${step.subtitle}`
                          }
                        >
                          {i + 1}
                        </button>
                      </div>
                      <span
                        className={`w-full text-[11px] font-semibold leading-tight sm:text-xs ${labelClass}`}
                      >
                        {step.label}
                      </span>
                      <span className={`w-full text-[10px] leading-snug sm:text-[11px] ${subClass}`}>
                        {step.subtitle}
                      </span>
                    </div>
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
}
