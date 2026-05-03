import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import PageHeader from '../components/workflow/PageHeader';
import { useWorkflow } from '../workflow/WorkflowContext';
import {
  dispatchProjectSessionChanged,
  fingerprintForFile,
  newProjectSessionId,
  patchProjectSession,
  readProjectSession,
  writeProjectSession,
  type ProjectSession,
} from '../workflow/projectSession';

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const navigate = useNavigate();
  const { unlockTo, setUnlockedExact } = useWorkflow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [session, setSession] = useState<ProjectSession | null>(() => readProjectSession());
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLabel, setUploadLabel] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLabel, setScanLabel] = useState('');
  const [isFileDragOver, setIsFileDragOver] = useState(false);

  const refreshSession = useCallback(() => {
    setSession(readProjectSession());
  }, []);

  const isZip = (file: File) =>
    file.name.toLowerCase().endsWith('.zip') ||
    file.type === 'application/zip' ||
    file.type === 'application/x-zip-compressed';

  const simulateUpload = useCallback(async () => {
    setUploading(true);
    setUploadProgress(0);
    setUploadLabel('Preparing upload…');
    const labels = ['Reading archive…', 'Transferring…', 'Verifying ZIP…', 'Almost done…'];
    for (let p = 0; p <= 100; p += 2) {
      setUploadProgress(p);
      setUploadLabel(labels[Math.min(Math.floor(p / 28), labels.length - 1)]);
      await new Promise((r) => setTimeout(r, 45));
    }
    setUploadProgress(100);
    setUploadLabel('Upload complete');
    patchProjectSession({ uploadComplete: true });
    refreshSession();
    setUploading(false);
    setUnlockedExact(1);
  }, [refreshSession, setUnlockedExact]);

  const pickZip = useCallback(
    async (file: File | null) => {
      if (!file) return;
      if (!isZip(file)) {
        alert('Please choose a .zip file only.');
        return;
      }

      const fp = fingerprintForFile(file);
      writeProjectSession({
        projectSessionId: newProjectSessionId(),
        fingerprint: fp,
        fileName: file.name,
        fileSize: file.size,
        lastModified: file.lastModified,
        uploadComplete: false,
        analyzed: false,
      });
      setUnlockedExact(1);
      const s = readProjectSession();
      if (s) dispatchProjectSessionChanged(s.projectSessionId);
      refreshSession();
      setZipFile(file);
      await simulateUpload();
      window.location.reload();
    },
    [refreshSession, setUnlockedExact, simulateUpload],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    void pickZip(f);
    e.target.value = '';
  };

  const hasFilePayload = (e: React.DragEvent) =>
    Array.from(e.dataTransfer?.types ?? []).includes('Files');

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasFilePayload(e)) return;
    setIsFileDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = e.relatedTarget as Node | null;
    if (next && (e.currentTarget as HTMLElement).contains(next)) return;
    setIsFileDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasFilePayload(e)) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragOver(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    void pickZip(f);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleDropZoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFilePicker();
    }
  };

  const handleRunAnalyze = async () => {
    const s = readProjectSession();
    if (!s?.uploadComplete || s.analyzed || uploading) return;

    setScanning(true);
    setScanProgress(0);
    const steps = [
      'Scanning project structure…',
      'Detecting legacy assets…',
      'Finding business-logic hotspots…',
      'Building analysis model…',
      'Preparing analysis view…',
    ];
    const perStep = 100 / steps.length;

    for (let i = 0; i < steps.length; i++) {
      setScanLabel(steps[i]);
      const target = Math.round((i + 1) * perStep);
      for (let p = Math.round(i * perStep); p <= target; p += 4) {
        setScanProgress(Math.min(p, target));
        await new Promise((r) => setTimeout(r, 60));
      }
      setScanProgress(target);
    }

    setScanProgress(100);
    setScanLabel('Opening analysis…');
    await new Promise((r) => setTimeout(r, 200));

    patchProjectSession({ analyzed: true });
    refreshSession();
    unlockTo(2);
    navigate('/analysis');
    setScanning(false);
  };

  const uploadDone = session?.uploadComplete === true;
  const analyzed = session?.analyzed === true;
  const archiveName = zipFile?.name ?? session?.fileName;
  const archiveSize = zipFile?.size ?? session?.fileSize;

  return (
    <div className="w-full space-y-8">
      <PageHeader
        title="Upload project"
        tagline="Upload a .ZIP once per session—it stays here when you navigate away. After analysis, upload a new archive to refresh results across the app."
        Icon={Upload}
      />

      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-text-strong">Upload legacy project</h2>
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          className="hidden"
          onChange={handleFileInput}
        />
        <div
          role="button"
          tabIndex={0}
          className={`w-full cursor-pointer rounded-lg border-2 border-dashed p-12 text-center outline-none transition-[border-color,box-shadow,background-color] duration-200 focus-visible:ring-2 focus-visible:ring-live-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-panel-bg ${
            isFileDragOver
              ? 'border-live-cyan border-solid bg-live-cyan/10 shadow-[0_0_0_1px_rgba(34,211,238,0.5),0_0_28px_rgba(34,211,238,0.35)] ring-2 ring-live-cyan/50'
              : 'border-border hover:border-live-cyan hover:border-solid hover:bg-live-cyan/5 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35),0_0_24px_rgba(34,211,238,0.22)] hover:ring-2 hover:ring-live-cyan/35'
          }`}
          onClick={openFilePicker}
          onKeyDown={handleDropZoneKeyDown}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="pointer-events-none">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-panel-bg-secondary">
              <svg className="h-8 w-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="mb-2 font-medium text-text-muted">Drag and drop your project ZIP here</p>
            <p className="text-sm text-text-subtle">or click to browse — .zip only (new ZIP replaces the current session)</p>
          </div>
        </div>

        {uploading && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm text-text-muted">
              <span>{uploadLabel}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-panel-bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-live-cyan via-live-sky to-live-mint transition-[width] duration-150 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {uploadDone && archiveName != null && typeof archiveSize === 'number' && (
        <div className="card border-live-cyan/35 bg-live-cyan/10">
          <h3 className="mb-3 text-lg font-semibold text-text-strong">Uploaded archive</h3>
          <div className="rounded-lg bg-panel-bg p-4 text-left">
            <div className="font-medium text-text-strong">{archiveName}</div>
            <div className="mt-1 text-sm text-text-muted">{formatBytes(archiveSize)}</div>
            <p className="mt-3 text-sm text-text-muted">
              {analyzed
                ? 'This archive was analyzed. Upload a different .zip to start a new project session.'
                : 'ZIP is ready. Run analysis to continue the workflow.'}
            </p>
          </div>
        </div>
      )}

      {analyzed && (
        <div className="card border-success-green/40 bg-success-green/10">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-text-strong">
            <svg className="h-5 w-5 shrink-0 text-success-green" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Analysis complete
          </h3>
          <p className="text-sm text-text-muted">
            This project has already been analyzed. The <strong className="text-text-primary">Analyze the Project</strong>{' '}
            action stays disabled until you upload another ZIP (that clears this state and resets downstream steps).
          </p>
        </div>
      )}

      {scanning && (
        <div className="card border-live-sky/40 bg-live-sky/10">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 shrink-0 animate-spin rounded-full border-b-2 border-live-sky" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 font-medium text-text-strong">Analyzing project</div>
              <div className="text-sm text-text-muted">{scanLabel}</div>
            </div>
            <span className="shrink-0 text-sm tabular-nums text-text-muted">{scanProgress}%</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-panel-bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-live-cyan via-live-sky to-live-mint transition-[width] duration-150 ease-out"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          type="button"
          className="btn-primary"
          disabled={!uploadDone || analyzed || uploading || scanning}
          onClick={() => void handleRunAnalyze()}
        >
          {scanning ? 'Analyzing…' : analyzed ? 'Analysis done' : 'Analyze the Project'}
        </button>
        {!uploadDone && !uploading && (
          <p className="mt-2 text-sm text-text-subtle">Upload a .zip file to continue</p>
        )}
        {uploadDone && !analyzed && !uploading && !scanning && (
          <p className="mt-2 text-sm text-text-subtle">Run analysis once per archive, then upload a new ZIP to analyze again.</p>
        )}
      </div>
    </div>
  );
}

// Made with Bob
