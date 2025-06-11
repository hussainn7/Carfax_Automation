import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReport(null);

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch report');
      }

      setReport(data.report);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Carfax Report Viewer</h1>
          <p>Enter a VIN to view the vehicle history report</p>
        </div>
      </header>

      <main className="App-main">
        <form onSubmit={handleSubmit} className="vin-form">
          <div className="input-group">
            <div className="input-wrapper">
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="Enter VIN number"
                pattern="[A-HJ-NPR-Z0-9]{17}"
                title="Please enter a valid 17-character VIN"
                required
                className="vin-input"
                disabled={loading}
              />
              <div className="input-hint">17 characters, no I, O, or Q</div>
            </div>
            <button 
              type="submit" 
              disabled={loading || vin.length !== 17}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Get Report'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <svg className="error-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {error}
          </div>
        )}

        {report && (
          <div className="report-fullscreen">
            <button 
              className="close-button"
              onClick={() => setReport(null)}
              title="Close Report"
            >
              ✕
            </button>
            <iframe
              srcDoc={report}
              title="Carfax Report"
              className="report-frame-full"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-modals allow-downloads allow-print"
              allow="fullscreen; geolocation; microphone; camera; payment; autoplay; clipboard-read; clipboard-write"
              referrerPolicy="no-referrer-when-downgrade"
              loading="eager"
              onLoad={() => console.log('📄 Carfax report iframe loaded')}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
