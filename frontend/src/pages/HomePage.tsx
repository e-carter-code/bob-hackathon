export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-block px-4 py-1 bg-ibm-blue/10 border border-ibm-blue/30 rounded-full text-ibm-blue text-sm font-medium mb-4">
          Enterprise Legacy Modernization Platform
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-text-strong leading-tight">
          Legacy Logic Studio
        </h1>
        <p className="text-xl md:text-2xl text-text-muted max-w-4xl mx-auto leading-relaxed">
          Discover, visualize, and modernize hidden business logic in legacy enterprise applications with AI-powered analysis and visual workflow editing.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <a href="/upload" className="btn-primary text-lg px-8 py-3">
            Start Analysis
          </a>
          <a href="/upload" className="btn-secondary text-lg px-8 py-3">
            View Sample Project
          </a>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:border-ibm-blue/50 transition-all">
          <div className="w-12 h-12 bg-ibm-blue/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-ibm-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-strong mb-3">
            Intelligent Discovery
          </h3>
          <p className="text-text-muted leading-relaxed">
            AI-powered analysis automatically discovers and maps nested business logic, service dependencies, and decision flows across your legacy codebase.
          </p>
        </div>

        <div className="card hover:border-ibm-blue/50 transition-all">
          <div className="w-12 h-12 bg-ibm-blue/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-ibm-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-strong mb-3">
            Visual Workflow Editor
          </h3>
          <p className="text-text-muted leading-relaxed">
            Interactive 2D graph visualization of business logic with nested rule hierarchies. Edit rules directly and see real-time impact analysis.
          </p>
        </div>

        <div className="card hover:border-ibm-blue/50 transition-all">
          <div className="w-12 h-12 bg-ibm-blue/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-ibm-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-strong mb-3">
            Visual Test Runner
          </h3>
          <p className="text-text-muted leading-relaxed">
            Execute test scenarios and watch execution paths light up on the workflow graph. Validate modernization changes with confidence.
          </p>
        </div>
      </div>

      {/* Workflow Stepper */}
      <div className="card">
        <h2 className="text-2xl font-bold text-text-strong mb-8 text-center">
          Modernization Workflow
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-ibm-blue rounded-full flex items-center justify-center mx-auto text-white font-bold">
              1
            </div>
            <div className="text-sm font-medium text-text-strong">Upload</div>
            <div className="text-xs text-text-muted">Legacy project</div>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-ibm-blue rounded-full flex items-center justify-center mx-auto text-white font-bold">
              2
            </div>
            <div className="text-sm font-medium text-text-strong">Analyze</div>
            <div className="text-xs text-text-muted">AI discovery</div>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-ibm-blue rounded-full flex items-center justify-center mx-auto text-white font-bold">
              3
            </div>
            <div className="text-sm font-medium text-text-strong">Visualize</div>
            <div className="text-xs text-text-muted">Logic graph</div>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-ibm-blue rounded-full flex items-center justify-center mx-auto text-white font-bold">
              4
            </div>
            <div className="text-sm font-medium text-text-strong">Edit</div>
            <div className="text-xs text-text-muted">Refactor rules</div>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-ibm-blue rounded-full flex items-center justify-center mx-auto text-white font-bold">
              5
            </div>
            <div className="text-sm font-medium text-text-strong">Test</div>
            <div className="text-xs text-text-muted">Visual paths</div>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-ibm-blue rounded-full flex items-center justify-center mx-auto text-white font-bold">
              6
            </div>
            <div className="text-sm font-medium text-text-strong">Report</div>
            <div className="text-xs text-text-muted">Export results</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-12 space-y-6">
        <h2 className="text-3xl font-bold text-text-strong">
          Ready to modernize your legacy systems?
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto">
          Start with a sample project or upload your own legacy application to discover hidden business logic and begin your modernization journey.
        </p>
        <a href="/upload" className="btn-primary text-lg px-8 py-3 inline-block">
          Get Started Now
        </a>
      </div>

      {/* Built with IBM Bob */}
      <div className="text-center pt-8 border-t border-border">
        <p className="text-text-subtle text-sm">
          Developed in partnership with <span className="text-ibm-blue font-medium">IBM Bob</span> — AI-powered development assistant
        </p>
      </div>
    </div>
  );
}

// Made with Bob
