export const WORKFLOW_STEPS = [
  { path: '/', label: 'Home', subtitle: 'Start' },
  { path: '/upload', label: 'Upload', subtitle: 'Legacy project' },
  { path: '/analysis', label: 'Analyze', subtitle: 'Discovery' },
  { path: '/editor', label: 'Editor', subtitle: 'Map & rules' },
  { path: '/modernization', label: 'Modernize', subtitle: 'Java / Quarkus' },
  { path: '/report', label: 'Report', subtitle: 'Summary' },
] as const;

export type WorkflowStepIndex = number;

const STORAGE_KEY = 'legacyLogicUnlockedStep';

export function readUnlockedStep(): WorkflowStepIndex {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw == null) return 0;
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0 || n >= WORKFLOW_STEPS.length) return 0;
    return n;
  } catch {
    return 0;
  }
}

export function writeUnlockedStep(n: WorkflowStepIndex): void {
  sessionStorage.setItem(STORAGE_KEY, String(n));
}

export function clearUnlockedStep(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function stepIndexFromPathname(pathname: string): WorkflowStepIndex {
  const normalized = pathname === '' ? '/' : pathname;
  const idx = WORKFLOW_STEPS.findIndex((s) => s.path === normalized);
  return idx >= 0 ? idx : 0;
}
