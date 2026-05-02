export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-strong mb-2">
          Analysis Dashboard
        </h1>
        <p className="text-text-muted">
          Nested business logic hierarchy and complexity analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Total Rules</div>
          <div className="text-3xl font-bold text-text-strong">247</div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Nested Flows</div>
          <div className="text-3xl font-bold text-text-strong">18</div>
        </div>
        <div className="card">
          <div className="text-text-subtle text-sm mb-1">Test Coverage</div>
          <div className="text-3xl font-bold text-success-green">87%</div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-text-strong mb-4">
          Business Logic Hierarchy
        </h2>
        <div className="space-y-2">
          <div className="p-3 bg-panel-bg-secondary rounded border border-border">
            <div className="font-medium text-text-strong">Credit Decision Engine</div>
            <div className="text-sm text-text-muted mt-1">4 domains, 247 rules</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <a href="/editor" className="btn-primary inline-block">
          Open Visual Editor
        </a>
      </div>
    </div>
  );
}

// Made with Bob
