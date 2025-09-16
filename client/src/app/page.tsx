'use client';

import { useState } from 'react';

interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
  database?: {
    connected: boolean;
    message: string;
  };
}

export default function Home() {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    setHealthData(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/health`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: HealthResponse = await response.json();
      setHealthData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1
          style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          🏋️ GymArt App
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
          Fullstack application with Express API, Next.js client, and PostgreSQL
        </p>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            className="button"
            onClick={testApiConnection}
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fed7d7',
              color: '#c53030',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {healthData && (
          <div
            style={{
              background: healthData.status === 'ok' ? '#c6f6d5' : '#fed7d7',
              color: healthData.status === 'ok' ? '#2f855a' : '#c53030',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          >
            <h3>Health Check Result:</h3>
            <pre
              style={{
                background: 'rgba(0,0,0,0.1)',
                padding: '1rem',
                borderRadius: '4px',
                marginTop: '0.5rem',
                overflow: 'auto',
              }}
            >
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>
        )}

        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#f7fafc',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ marginBottom: '1rem' }}>🚀 Getting Started</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li>Make sure the API server is running on port 3001</li>
            <li>Ensure PostgreSQL database is connected</li>
            <li>Click "Test API Connection" to verify the health endpoint</li>
            <li>Check the JSON response for database connectivity status</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
