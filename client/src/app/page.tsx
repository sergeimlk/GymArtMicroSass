'use client';

import { useState } from 'react';

interface ApiResponse {
  status?: string;
  message?: string;
  timestamp?: string;
  error?: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testApiConnection = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/health`);

      const data = await res.json();

      if (!res.ok) {
        // Pour les erreurs 500, afficher la réponse JSON de l'API
        setResponse(data);
      } else {
        setResponse(data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de contacter l'API"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-glass-searchbar-in">
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              🏋️ GymArt
            </h1>
          </div>

          {/* Main Card */}
          <div className="bg-gradient-card backdrop-blur-sm border border-border rounded-lg shadow-card p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">
                Test de connexion API
              </h2>
              <p className="text-muted-foreground">
                Testez la connexion avec votre backend en un clic
              </p>
            </div>

            {/* Test Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={testApiConnection}
                disabled={isLoading}
                className={`
                  group relative px-8 py-4 rounded-lg font-medium text-primary-foreground
                  transition-all duration-300 transform
                  ${
                    isLoading
                      ? 'bg-muted cursor-not-allowed scale-95'
                      : 'bg-gradient-primary hover:shadow-soft hover:scale-105 active:scale-95'
                  }
                  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                `}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Test en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>🔗</span>
                    <span>Tester la connexion API</span>
                  </div>
                )}
              </button>
            </div>

            {/* Response Display */}
            {(response || error) && (
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium text-card-foreground">
                  Réponse API
                </h3>

                {error ? (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-destructive">❌</span>
                      <span className="text-destructive font-medium">
                        Erreur de connexion
                      </span>
                    </div>
                    <p className="text-destructive/80 text-sm">{error}</p>
                  </div>
                ) : response?.status === 'error' ? (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-destructive">❌</span>
                      <span className="text-destructive font-medium">
                        Erreur API (HTTP 500)
                      </span>
                    </div>
                    <div className="bg-muted rounded-md p-3">
                      <pre className="text-sm text-destructive overflow-x-auto">
                        <code>{JSON.stringify(response, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-success">✅</span>
                      <span className="text-success font-medium">
                        Connexion réussie
                      </span>
                    </div>
                    <div className="bg-muted rounded-md p-3">
                      <pre className="text-sm text-muted-foreground overflow-x-auto">
                        <code>{JSON.stringify(response, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Configuration Info */}
            <div className="mt-8 bg-secondary/50 border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-accent text-lg">⚙️</span>
                <div className="text-sm space-y-1">
                  <p className="font-medium text-secondary-foreground">
                    Configuration
                  </p>
                  <p className="text-muted-foreground">
                    API URL:{' '}
                    {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}
                  </p>
                  <p className="text-muted-foreground">Endpoint: /api/health</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
