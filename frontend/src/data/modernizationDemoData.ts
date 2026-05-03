/**
 * Barrel for modernization data and helpers.
 * Real COBOL + Java come from `modernizationRealProjectData.ts` (Vite ?raw imports).
 */
export type { LegacyToModernEntry, RuleTraceInfo } from './modernizationTypes';
export { computeRuleHighlightLines, prismLanguageForPath } from './modernizationCodeUtils';
export {
  DEFAULT_LEGACY_PATH,
  DEFAULT_MODERN_PATH,
  FALLBACK_MODERN_PATH,
  getModernZipFileMap,
  legacyFileContents,
  legacyToModernMap,
  modernFileContents,
  ruleHighlightNeedles,
} from './modernizationRealProjectData';
