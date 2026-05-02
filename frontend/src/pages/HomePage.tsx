export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-text-strong">
          Legacy Logic Studio
        </h1>
        <p className="text-xl text-text-muted max-w-3xl mx-auto">
          Upload legacy projects. Discover hidden business logic. Visualize, edit, test, and report modernization changes.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="card">
          <h3 className="text-lg font-semibold text-text-strong mb-2">
            Visual Analysis
          </h3>
          <p className="text-text-muted">
            Automatically discover and visualize nested business logic as interactive 2D workflow graphs.
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-text-strong mb-2">
            Rule Editing
          </h3>
          <p className="text-text-muted">
            Edit business rules directly from the visual graph and see impact analysis in real-time.
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-text-strong mb-2">
            Visual Testing
          </h3>
          <p className="text-text-muted">
            Run tests and see execution paths highlighted directly on the workflow graph.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-12">
        <a href="/upload" className="btn-primary inline-block">
          Get Started
        </a>
      </div>

      {/* Built with IBM Bob */}
      <div className="text-center mt-16 pt-8 border-t border-border">
        <p className="text-text-subtle text-sm">
          Built with IBM Bob as the AI development partner
        </p>
      </div>
    </div>
  );
}

// Made with Bob
