// API Configuration
// This file handles API URL configuration for different environments

const API_CONFIG = {
  // Use environment variable if available, otherwise fallback to localhost
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
};

// Helper function to construct API endpoints
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.baseURL}/${cleanEndpoint}`;
};

// Export the base URL for direct usage if needed
export const API_BASE_URL = API_CONFIG.baseURL;

// API Endpoints
export const API_ENDPOINTS = {
  analyze: (symbol: string, timeframe: string = '1d') => 
    getApiUrl(`analyze?symbol=${encodeURIComponent(symbol)}&tf=${timeframe}`),
  fundamentals: (symbol: string) => 
    getApiUrl(`fundamentals?symbol=${encodeURIComponent(symbol)}`),
  chat: () => getApiUrl('chat'),
  health: () => getApiUrl(''),
};

export default API_CONFIG;
