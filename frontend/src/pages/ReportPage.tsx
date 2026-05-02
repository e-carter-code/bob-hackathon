import { mockReportData, generateMarkdownReport, generateJSONReport } from '../data/reportData';

export default function ReportPage() {
  const report = mockReportData;

  const downloadMarkdown = () => {
    const markdown = generateMarkdownReport(report);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.projectName.replace(/\s+/g, '-')}-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const json = generateJSONReport(report);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.projectName.replace(/\s+/g, '-')}-analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-strong mb-2">
            Modernization Report
          </h1>
          <p className="text-text-muted">
            Visual analysis and modernization summary for {report.projectName}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-text-subtle">Analysis Date</div>
          <div className="text-text-strong font-medium">{report.analysisDate}</div>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="card bg-accent-blue/5 border-accent-blue/30">
        <h2 className="text-lg font-semibold text-text-strong mb-4">
          Download Report
        </h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={downloadMarkdown} className="btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Markdown
          </button>
          <button onClick={downloadJSON} className="btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download JSON
          </button>
          <button onClick={downloadPDF} className="btn-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print PDF
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="card">
        <h2 className="text-2xl font-bold text-text-strong mb-6">
          Executive Summary
        </h2>
        <div className="space-y-4">
          <p className="text-text-muted leading-relaxed">
            This report summarizes the modernization analysis and changes made to the{' '}
            <span className="text-text-strong font-medium">{report.projectName}</span> legacy application.
            The analysis identified {report.summary.logicDomains} major logic domains containing{' '}
            {report.summary.rulesFound} business rules, of which {report.summary.editableRules} are
            editable through the visual editor.
          </p>
          <p className="text-text-muted leading-relaxed">
            <span className="text-warning-yellow font-semibold">{report.summary.rulesModified} rule</span> has
            been modified during this session, impacting multiple flows and requiring test validation.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-panel-bg-secondary rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-accent-blue">{report.summary.filesScanned}</div>
            <div className="text-sm text-text-subtle mt-1">Files Scanned</div>
          </div>
          <div className="bg-panel-bg-secondary rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-accent-blue">{report.summary.logicDomains}</div>
            <div className="text-sm text-text-subtle mt-1">Logic Domains</div>
          </div>
          <div className="bg-panel-bg-secondary rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-accent-blue">{report.summary.rulesFound}</div>
            <div className="text-sm text-text-subtle mt-1">Rules Found</div>
          </div>
          <div className="bg-panel-bg-secondary rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-warning-yellow">{report.summary.rulesModified}</div>
            <div className="text-sm text-text-subtle mt-1">Rules Modified</div>
          </div>
        </div>
      </div>

      {/* Visual Logic Map */}
      <div className="card">
        <h2 className="text-2xl font-bold text-text-strong mb-6">
          Visual Logic Map
        </h2>
        <div className="space-y-4">
          <div className="bg-panel-bg-secondary rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="inline-block px-4 py-2 bg-accent-blue/20 border-2 border-accent-blue rounded-lg">
                <div className="text-sm font-bold text-accent-blue">SYSTEM</div>
                <div className="text-lg font-semibold text-text-strong mt-1">
                  {report.logicHierarchy.name}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.logicHierarchy.domains.map((domain) => (
                <div
                  key={domain.name}
                  className="bg-panel-bg rounded-lg border border-border p-4 hover:border-accent-blue/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-sm font-bold text-text-strong">{domain.name}</div>
                    <div
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        domain.complexity === 'High'
                          ? 'bg-warning-yellow/20 text-warning-yellow'
                          : domain.complexity === 'Medium'
                          ? 'bg-accent-blue/20 text-accent-blue'
                          : 'bg-success-green/20 text-success-green'
                      }`}
                    >
                      {domain.complexity}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-text-muted">
                    <div className="flex justify-between">
                      <span>Rules Found:</span>
                      <span className="text-text-strong font-medium">{domain.rulesCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Editable:</span>
                      <span className="text-accent-blue font-medium">{domain.editableCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Changed Rules */}
      <div className="card">
        <h2 className="text-2xl font-bold text-text-strong mb-6">
          Changed Rules
        </h2>
        {report.changedRules.length > 0 ? (
          <div className="space-y-4">
            {report.changedRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-warning-yellow/5 border-2 border-warning-yellow/30 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-strong">{rule.name}</h3>
                    <div className="text-sm text-text-muted mt-1">Domain: {rule.domain}</div>
                  </div>
                  <div className="px-3 py-1 bg-warning-yellow/20 border border-warning-yellow rounded text-xs font-bold text-warning-yellow">
                    MODIFIED
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs font-semibold text-text-subtle mb-2">Original Expression</div>
                    <div className="bg-panel-bg rounded p-3 font-mono text-sm text-error-red border border-error-red/30">
                      {rule.originalValue}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-subtle mb-2">New Expression</div>
                    <div className="bg-panel-bg rounded p-3 font-mono text-sm text-success-green border border-success-green/30">
                      {rule.newValue}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-text-subtle mb-2">Impacted Flows</div>
                    <div className="space-y-1">
                      {rule.impactedFlows.map((flow) => (
                        <div key={flow} className="text-sm text-text-strong bg-panel-bg-secondary px-2 py-1 rounded">
                          {flow}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-subtle mb-2">Tests Need Rerun</div>
                    <div className="text-2xl font-bold text-warning-yellow">{rule.impactedTests}</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-subtle mb-2">Source Files</div>
                    <div className="space-y-1">
                      {rule.sourceFiles.map((file) => (
                        <div key={file} className="text-xs text-text-strong bg-panel-bg-secondary px-2 py-1 rounded font-mono">
                          {file}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text-muted">
            No rules have been modified yet.
          </div>
        )}
      </div>

      {/* Test Results Summary */}
      <div className="card">
        <h2 className="text-2xl font-bold text-text-strong mb-6">
          Test Results Summary
        </h2>
        
        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-panel-bg-secondary rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-text-strong">{report.testResults.total}</div>
            <div className="text-sm text-text-subtle mt-1">Total Tests</div>
          </div>
          <div className="bg-success-green/10 border border-success-green/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-success-green">{report.testResults.passed}</div>
            <div className="text-sm text-text-subtle mt-1">Passing</div>
          </div>
          <div className="bg-error-red/10 border border-error-red/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-error-red">{report.testResults.failed}</div>
            <div className="text-sm text-text-subtle mt-1">Failing</div>
          </div>
          <div className="bg-warning-yellow/10 border border-warning-yellow/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-warning-yellow">{report.testResults.warning}</div>
            <div className="text-sm text-text-subtle mt-1">Warning</div>
          </div>
        </div>

        {/* Test Details */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-text-subtle mb-3">Test Details</div>
          {report.testResults.details.map((test) => (
            <div
              key={test.name}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                test.status === 'PASS'
                  ? 'bg-success-green/5 border-success-green/30'
                  : test.status === 'FAIL'
                  ? 'bg-error-red/5 border-error-red/30'
                  : 'bg-warning-yellow/5 border-warning-yellow/30'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
                    test.status === 'PASS'
                      ? 'bg-success-green/20 text-success-green'
                      : test.status === 'FAIL'
                      ? 'bg-error-red/20 text-error-red'
                      : 'bg-warning-yellow/20 text-warning-yellow'
                  }`}
                >
                  {test.status === 'PASS' ? '✓' : test.status === 'FAIL' ? '✗' : '⚠'}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-strong">{test.name}</div>
                  <div className="text-xs text-text-muted">{test.domain}</div>
                </div>
              </div>
              <div className="text-xs text-text-subtle font-mono">{test.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Impact Analysis */}
      <div className="card">
        <h2 className="text-2xl font-bold text-text-strong mb-6">
          Source Impact Analysis
        </h2>
        <div className="space-y-3">
          {report.sourceImpact.map((impact) => (
            <div
              key={impact.file}
              className="bg-panel-bg-secondary rounded-lg p-4 border border-border hover:border-accent-blue/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-mono font-semibold text-text-strong mb-2">
                    {impact.file}
                  </div>
                  <div className="flex gap-6 text-xs text-text-muted">
                    <div>
                      <span className="text-text-subtle">Lines Changed:</span>{' '}
                      <span className="text-text-strong font-medium">{impact.linesChanged}</span>
                    </div>
                    <div>
                      <span className="text-text-subtle">Rules Affected:</span>{' '}
                      <span className="text-text-strong font-medium">{impact.rulesAffected}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    impact.complexity === 'High'
                      ? 'bg-warning-yellow/20 text-warning-yellow'
                      : impact.complexity === 'Medium'
                      ? 'bg-accent-blue/20 text-accent-blue'
                      : 'bg-success-green/20 text-success-green'
                  }`}
                >
                  {impact.complexity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card bg-accent-blue/5 border-accent-blue/30">
        <h2 className="text-2xl font-bold text-text-strong mb-6">
          Recommendations
        </h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-warning-yellow/20 text-warning-yellow flex items-center justify-center flex-shrink-0 font-bold text-sm">
              1
            </div>
            <div>
              <div className="text-sm font-semibold text-text-strong">Review Failed Tests</div>
              <div className="text-sm text-text-muted mt-1">
                Address the failing test case to ensure rule changes don't break existing functionality.
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center flex-shrink-0 font-bold text-sm">
              2
            </div>
            <div>
              <div className="text-sm font-semibold text-text-strong">Update Documentation</div>
              <div className="text-sm text-text-muted mt-1">
                Document the credit score threshold change and its business rationale.
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-success-green/20 text-success-green flex items-center justify-center flex-shrink-0 font-bold text-sm">
              3
            </div>
            <div>
              <div className="text-sm font-semibold text-text-strong">Regression Testing</div>
              <div className="text-sm text-text-muted mt-1">
                Run full regression suite before deploying to production.
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple flex items-center justify-center flex-shrink-0 font-bold text-sm">
              4
            </div>
            <div>
              <div className="text-sm font-semibold text-text-strong">Stakeholder Review</div>
              <div className="text-sm text-text-muted mt-1">
                Have business stakeholders review and approve the modified credit score threshold.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-border space-y-2">
        <p className="text-text-muted text-sm">
          Report generated by <span className="font-semibold text-text-strong">Legacy Logic Studio</span>
        </p>
        <p className="text-text-subtle text-xs">
          Built with <span className="text-ibm-blue font-medium">IBM Bob</span> — AI-powered development assistant
        </p>
      </div>
    </div>
  );
}

// Made with Bob
