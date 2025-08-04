'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface AuthStatus {
  authenticated: boolean;
  message: string;
  needsAuth?: boolean;
  expired?: boolean;
  tokenInfo?: {
    scope: string;
    expiresAt: string;
    tokenType: string;
  };
  error?: string;
}

export default function AuthStatusFloat() {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      setAuthStatus(data);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus({
        authenticated: false,
        message: 'Failed to check authentication status',
        error: 'Network error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    // Check auth status every 30 seconds
    const interval = setInterval(checkAuthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 z-50"
        title="Show Auth Status"
      >
        <CheckCircle className="w-5 h-5" />
      </button>
    );
  }

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="w-5 h-5 animate-spin" />;
    if (authStatus?.authenticated) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (authStatus?.expired) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = () => {
    if (isLoading) return 'bg-blue-50 border-blue-200';
    if (authStatus?.authenticated) return 'bg-green-50 border-green-200';
    if (authStatus?.expired) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getStatusTitle = () => {
    if (isLoading) return 'Checking Authentication...';
    if (authStatus?.authenticated) return 'Authenticated ✅';
    if (authStatus?.expired) return 'Token Expired ⚠️';
    return 'Not Authenticated ❌';
  };

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-lg border-2 shadow-lg transition-all duration-200 z-50 ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h3 className="font-semibold text-sm">{getStatusTitle()}</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Hide"
        >
          ×
        </button>
      </div>
      
      <p className="text-xs text-gray-600 mb-3">
        {authStatus?.message || 'Checking authentication status...'}
      </p>
      
      {authStatus?.tokenInfo && (
        <div className="text-xs text-gray-500 space-y-1 mb-3">
          <div><strong>Expires:</strong> {new Date(authStatus.tokenInfo.expiresAt).toLocaleString()}</div>
          <div><strong>Scope:</strong> {authStatus.tokenInfo.scope.split(' ').length} permissions</div>
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={checkAuthStatus}
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs py-1 px-2 rounded transition-colors"
        >
          {isLoading ? 'Checking...' : 'Refresh'}
        </button>
        
        {authStatus?.needsAuth && (
          <button
            onClick={() => window.location.href = '/auth'}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded transition-colors"
          >
            Authenticate
          </button>
        )}
      </div>
      
      {authStatus?.error && (
        <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
          Error: {authStatus.error}
        </div>
      )}
    </div>
  );
}