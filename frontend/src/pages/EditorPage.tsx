export default function EditorPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-strong mb-2">
          Visual Logic Editor
        </h1>
        <p className="text-text-muted">
          Explore and edit nested business logic workflows
        </p>
      </div>

      <div className="card">
        <div className="h-96 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
          <div className="text-center">
            <p className="text-text-muted text-lg mb-2">
              Visual Editor Canvas
            </p>
            <p className="text-text-subtle text-sm">
              Graph editor will be implemented in Phase 4
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-text-subtle text-sm">
          Phase 1: App shell complete. Visual editor coming in Phase 4.
        </p>
      </div>
    </div>
  );
}

// Made with Bob
