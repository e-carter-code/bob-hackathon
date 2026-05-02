import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const navigate = useNavigate();
  const [selectedSample, setSelectedSample] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState('');

  const handleSampleSelect = () => {
    setSelectedSample(true);
    setShowSummary(true);
  };

  const handleRunScan = async () => {
    setScanning(true);
    const steps = [
      'Scanning project structure...',
      'Detecting service classes...',
      'Finding business-logic hotspots...',
      'Building nested rule hierarchy...',
      'Preparing visual flow model...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setScanProgress(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Navigate to analysis page
    navigate('/analysis');
  };

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
          <div className="w-16 h-16 bg-panel-bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-text-muted mb-2 font-medium">
            Drag and drop your project ZIP file here
          </p>
          <p className="text-text-subtle text-sm">
            or click to browse (supports .zip, .tar.gz)
          </p>
        </div>
      </div>

      <div className="text-center text-text-muted font-medium">
        <span>or</span>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-text-strong mb-4">
          Sample Projects
        </h2>
        <div className="space-y-3">
          <button 
            onClick={handleSampleSelect}
            className={`w-full text-left p-4 bg-panel-bg-secondary rounded-lg border transition-all ${
              selectedSample 
                ? 'border-ibm-blue bg-ibm-blue/5' 
                : 'border-border hover:border-ibm-blue/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-text-strong flex items-center gap-2">
                  Credit Decision Engine (Java)
                  {selectedSample && (
                    <svg className="w-5 h-5 text-ibm-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="text-sm text-text-muted mt-1">
                  Complex nested business logic with risk assessment and pricing rules
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {showSummary && (
        <div className="card border-ibm-blue/30 bg-ibm-blue/5">
          <h3 className="text-lg font-semibold text-text-strong mb-4">
            Detected Project Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-panel-bg rounded-lg">
              <div className="text-2xl font-bold text-ibm-blue">143</div>
              <div className="text-xs text-text-muted mt-1">Total Files</div>
            </div>
            <div className="text-center p-3 bg-panel-bg rounded-lg">
              <div className="text-2xl font-bold text-ibm-blue">37</div>
              <div className="text-xs text-text-muted mt-1">Java Files</div>
            </div>
            <div className="text-center p-3 bg-panel-bg rounded-lg">
              <div className="text-2xl font-bold text-ibm-blue">8</div>
              <div className="text-xs text-text-muted mt-1">XML Configs</div>
            </div>
            <div className="text-center p-3 bg-panel-bg rounded-lg">
              <div className="text-2xl font-bold text-ibm-blue">11</div>
              <div className="text-xs text-text-muted mt-1">Test Files</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-text-muted">Maven project detected</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-text-muted">6 service classes identified</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-text-muted">4 controllers found</span>
            </div>
          </div>
        </div>
      )}

      {scanning && (
        <div className="card border-ibm-blue bg-ibm-blue/5">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ibm-blue"></div>
            <div className="flex-1">
              <div className="text-text-strong font-medium mb-1">
                Running Modernization Scan
              </div>
              <div className="text-sm text-text-muted">
                {scanProgress}
              </div>
            </div>
          </div>
          <div className="mt-4 bg-panel-bg-secondary rounded-full h-2 overflow-hidden">
            <div className="bg-ibm-blue h-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      <div className="text-center">
        <button 
          className="btn-primary"
          disabled={!selectedSample || scanning}
          onClick={handleRunScan}
        >
          {scanning ? 'Scanning...' : 'Run Modernization Scan'}
        </button>
        {!selectedSample && (
          <p className="text-text-subtle text-sm mt-2">
            Select a project to continue
          </p>
        )}
      </div>
    </div>
  );
}

// Made with Bob
