import JSZip from 'jszip';
import { getModernZipFileMap } from '../data/modernizationRealProjectData';

export async function downloadModernizedProject(): Promise<void> {
  const zip = new JSZip();
  const root = zip.folder('loan-approval-service');
  if (!root) {
    throw new Error('Could not create zip folder');
  }

  const files = getModernZipFileMap();
  for (const [relativePath, content] of Object.entries(files)) {
    root.file(relativePath, content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'loan-approval-service.zip';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
