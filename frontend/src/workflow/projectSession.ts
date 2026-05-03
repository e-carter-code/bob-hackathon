/** Session-persisted “current ZIP” so Upload survives navigation; new ZIP clears analysis lock. */

const STORAGE_KEY = 'bltmProjectSession';

export const BLTM_PROJECT_CHANGED = 'bltm-project-changed';

export type ProjectSession = {
  projectSessionId: string;
  fingerprint: string;
  fileName: string;
  fileSize: number;
  lastModified: number;
  uploadComplete: boolean;
  analyzed: boolean;
};

export function fingerprintForFile(f: File): string {
  return `${f.name}\0${f.size}\0${f.lastModified}`;
}

function isSessionShape(o: unknown): o is ProjectSession {
  if (!o || typeof o !== 'object') return false;
  const s = o as Record<string, unknown>;
  return (
    typeof s.projectSessionId === 'string' &&
    typeof s.fingerprint === 'string' &&
    typeof s.fileName === 'string' &&
    typeof s.fileSize === 'number' &&
    typeof s.lastModified === 'number' &&
    typeof s.uploadComplete === 'boolean' &&
    typeof s.analyzed === 'boolean'
  );
}

export function readProjectSession(): ProjectSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw == null) return null;
    const o = JSON.parse(raw) as unknown;
    return isSessionShape(o) ? o : null;
  } catch {
    return null;
  }
}

export function writeProjectSession(s: ProjectSession): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function patchProjectSession(patch: Partial<ProjectSession>): void {
  const cur = readProjectSession();
  if (!cur) return;
  writeProjectSession({ ...cur, ...patch });
}

export function clearProjectSession(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function newProjectSessionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `p-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Label for UI when no archive name is stored (sample / pre-upload). */
export const DEFAULT_PROJECT_DISPLAY_NAME = 'loan-approvals-COBOL';

/** Human-readable project name from the uploaded ZIP (`fileName` without `.zip`). */
export function projectDisplayName(session: ProjectSession | null): string {
  if (!session?.fileName?.trim()) return DEFAULT_PROJECT_DISPLAY_NAME;
  const base = session.fileName.trim();
  const lower = base.toLowerCase();
  if (lower.endsWith('.zip')) {
    const stem = base.slice(0, -4).trim();
    return stem.length > 0 ? stem : DEFAULT_PROJECT_DISPLAY_NAME;
  }
  return base;
}

export function dispatchProjectSessionChanged(projectSessionId: string): void {
  window.dispatchEvent(
    new CustomEvent(BLTM_PROJECT_CHANGED, { detail: { projectSessionId } }),
  );
}

const MODERNIZATION_STATE_KEY = 'bltmModernizationWorkspaceState';

type ModernizationWorkspacePersisted = {
  projectSessionId: string;
  workspaceReady: boolean;
};

function isModernizationPersisted(o: unknown): o is ModernizationWorkspacePersisted {
  if (!o || typeof o !== 'object') return false;
  const r = o as Record<string, unknown>;
  return (
    typeof r.projectSessionId === 'string' &&
    typeof r.workspaceReady === 'boolean'
  );
}

/** Stable id when no upload session exists yet (demo / pre-upload flow). */
export function modernizationSessionKey(): string {
  return readProjectSession()?.projectSessionId ?? '__nosession__';
}

/** Whether the Modernize page finished its progress for the current project session. */
export function readModernizationWorkspaceReady(): boolean {
  const id = modernizationSessionKey();
  try {
    const raw = sessionStorage.getItem(MODERNIZATION_STATE_KEY);
    if (raw == null) return false;
    const o = JSON.parse(raw) as unknown;
    if (!isModernizationPersisted(o)) return false;
    return o.projectSessionId === id && o.workspaceReady === true;
  } catch {
    return false;
  }
}

export function writeModernizationWorkspaceReady(): void {
  const id = modernizationSessionKey();
  sessionStorage.setItem(
    MODERNIZATION_STATE_KEY,
    JSON.stringify({ projectSessionId: id, workspaceReady: true } satisfies ModernizationWorkspacePersisted),
  );
}
