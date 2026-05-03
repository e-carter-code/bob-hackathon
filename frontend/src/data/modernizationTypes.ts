export interface RuleTraceInfo {
  legacyParagraph: string;
  legacyRule: string;
  visualEdit: string;
  modernMethod: string;
  modernRule: string;
}

export interface LegacyToModernEntry {
  primaryModernFile: string;
  relatedModernFiles: string[];
  ruleMapping: RuleTraceInfo;
}
