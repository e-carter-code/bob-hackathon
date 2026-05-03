/**
 * Verifies the real `loan-approval-service` tree at the repo root (sibling of `frontend/`).
 * The Modernization page and zip download load the same sources via Vite `?raw` imports.
 *
 * Run from frontend: npm run materialize-loan-service
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..');
const serviceDir = join(repoRoot, 'loan-approval-service');

function walkFiles(dir: string, base: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name === 'target') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      out.push(...walkFiles(p, base));
    } else {
      out.push(relative(base, p).replace(/\\/g, '/'));
    }
  }
  return out;
}

if (!existsSync(serviceDir)) {
  console.error('Missing directory:', serviceDir);
  process.exit(1);
}

const paths = walkFiles(serviceDir, serviceDir);
console.log(`loan-approval-service: ${paths.length} files under ${serviceDir}`);
console.log('Preview and zip in the app use Vite raw imports from this tree (see modernizationRealProjectData.ts).');
