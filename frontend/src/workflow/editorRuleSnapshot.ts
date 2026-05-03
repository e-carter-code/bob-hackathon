import type { EditorEditableRule } from '../data/editorPrescreenRules';
import { modernizationSessionKey } from './projectSession';

const STORAGE_PREFIX = 'bltmEditorEditableRules';

function storageKey(): string {
  return `${STORAGE_PREFIX}:${modernizationSessionKey()}`;
}

function isRuleRecord(o: unknown): o is Record<string, EditorEditableRule> {
  if (!o || typeof o !== 'object') return false;
  for (const v of Object.values(o as Record<string, unknown>)) {
    if (!v || typeof v !== 'object') return false;
    const r = v as Record<string, unknown>;
    if (
      typeof r.id !== 'string' ||
      typeof r.name !== 'string' ||
      typeof r.threshold !== 'number' ||
      typeof r.originalThreshold !== 'number' ||
      typeof r.technicalExpression !== 'string'
    ) {
      return false;
    }
  }
  return true;
}

/** Last saved editor rule map for the current project session (thresholds + metadata). */
export function readEditorRuleSnapshot(): Record<string, EditorEditableRule> | null {
  try {
    const raw = sessionStorage.getItem(storageKey());
    if (raw == null) return null;
    const o = JSON.parse(raw) as unknown;
    return isRuleRecord(o) ? o : null;
  } catch {
    return null;
  }
}

export function writeEditorRuleSnapshot(rules: Record<string, EditorEditableRule>): void {
  try {
    sessionStorage.setItem(storageKey(), JSON.stringify(rules));
  } catch {
    // ignore quota / private mode
  }
}

/** Rules whose current threshold differs from the COBOL sample default. */
export function listEditorRuleChanges(rules: Record<string, EditorEditableRule> | null): EditorEditableRule[] {
  if (!rules) return [];
  return Object.values(rules).filter((r) => r.threshold !== r.originalThreshold);
}
