export function computeRuleHighlightLines(content: string, needles: string[]): Set<number> {
  const lines = content.split('\n');
  const out = new Set<number>();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const n of needles) {
      if (n && line.includes(n)) {
        out.add(i + 1);
        break;
      }
    }
  }
  return out;
}

export function prismLanguageForPath(path: string): string {
  if (path.endsWith('.java')) return 'java';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.xml')) return 'markup';
  if (path.endsWith('.cbl') || path.endsWith('.cpy')) return 'cobol';
  if (path.endsWith('.jcl')) return 'bash';
  return 'markdown';
}
