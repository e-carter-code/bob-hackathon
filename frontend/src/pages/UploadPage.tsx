export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-strong mb-2">
          Upload Project
        </h1>
        <p className="text-text-muted">
          Upload a legacy project or select a sample to begin analysis
        </p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-text-strong mb-4">
          Upload Legacy Project
        </h2>
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-ibm-blue transition-colors cursor-pointer">
          <p className="text-text-muted mb-2">
            Drag and drop your project ZIP file here
          </p>
          <p className="text-text-subtle text-sm">
            or click to browse
          </p>
        </div>
      </div>

      <div className="text-center text-text-muted">
        <span>or</span>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-text-strong mb-4">
          Sample Projects
        </h2>
        <div className="space-y-3">
          <button className="w-full text-left p-4 bg-panel-bg-secondary rounded-lg border border-border hover:border-ibm-blue transition-colors">
            <div className="font-medium text-text-strong">
              Credit Decision Engine (Java)
            </div>
            <div className="text-sm text-text-muted mt-1">
              Complex nested business logic with risk assessment and pricing rules
            </div>
          </button>
        </div>
      </div>

      <div className="text-center">
        <button className="btn-primary" disabled>
          Run Modernization Scan
        </button>
        <p className="text-text-subtle text-sm mt-2">
          Select a project to continue
        </p>
      </div>
    </div>
  );
}

// Made with Bob
