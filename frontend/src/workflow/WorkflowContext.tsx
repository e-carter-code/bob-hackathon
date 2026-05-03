import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  WORKFLOW_STEPS,
  clearUnlockedStep,
  readUnlockedStep,
  stepIndexFromPathname,
  writeUnlockedStep,
  type WorkflowStepIndex,
} from './workflowConfig';

type WorkflowContextValue = {
  unlockedStep: WorkflowStepIndex;
  unlockTo: (stepIndex: WorkflowStepIndex) => void;
  /** Sets the highest reachable step index (e.g. reset to 1 when starting a new upload). */
  setUnlockedExact: (stepIndex: WorkflowStepIndex) => void;
  resetWorkflow: () => void;
};

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

let unlockedSnapshot = readUnlockedStep();
const listeners = new Set<() => void>();

function emitUnlockedChange() {
  for (const l of listeners) l();
}

function setUnlockedExternal(next: WorkflowStepIndex) {
  unlockedSnapshot = next;
  writeUnlockedStep(next);
  emitUnlockedChange();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getUnlockedSnapshot() {
  return unlockedSnapshot;
}

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const unlockedStep = useSyncExternalStore(subscribe, getUnlockedSnapshot, getUnlockedSnapshot);

  const unlockTo = useCallback((stepIndex: WorkflowStepIndex) => {
    const max = WORKFLOW_STEPS.length - 1;
    const clamped = Math.max(0, Math.min(max, stepIndex));
    const cur = getUnlockedSnapshot();
    if (clamped > cur) {
      setUnlockedExternal(clamped);
    }
  }, []);

  const setUnlockedExact = useCallback((stepIndex: WorkflowStepIndex) => {
    const max = WORKFLOW_STEPS.length - 1;
    const clamped = Math.max(0, Math.min(max, stepIndex));
    setUnlockedExternal(clamped);
  }, []);

  const resetWorkflow = useCallback(() => {
    clearUnlockedStep();
    unlockedSnapshot = 0;
    emitUnlockedChange();
  }, []);

  const value = useMemo(
    () => ({ unlockedStep, unlockTo, setUnlockedExact, resetWorkflow }),
    [unlockedStep, unlockTo, setUnlockedExact, resetWorkflow]
  );

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflow must be used within WorkflowProvider');
  return ctx;
}

/** Redirects away from routes the user has not unlocked yet. */
export function WorkflowRouteGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const unlocked = useSyncExternalStore(subscribe, getUnlockedSnapshot, getUnlockedSnapshot);

  useEffect(() => {
    const current = stepIndexFromPathname(location.pathname);
    if (current > unlocked) {
      const safe = WORKFLOW_STEPS[unlocked]?.path ?? '/';
      navigate(safe, { replace: true });
    }
  }, [location.pathname, unlocked, navigate]);

  return null;
}
