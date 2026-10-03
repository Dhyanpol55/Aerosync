/**
 * AirSync C2 Operational API Client
 * Seamlessly connects to Railway backend or same-origin /api
 */

// Base URL configured via Vercel / environment variable VITE_API_URL
const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!BASE_URL) {
    return cleanEndpoint;
  }
  return `${BASE_URL}${cleanEndpoint}`;
};

export async function fetchFromApi<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = getApiUrl(endpoint);
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[AirSync API] Request to ${url} failed:`, error);
    throw error;
  }
}

// Typed API helper methods
export const api = {
  checkHealth: () => fetchFromApi<{ status: string; uptimeSeconds: number; timestamp: string }>('/health'),
  getDashboard: () => fetchFromApi('/api/dashboard'),
  getDataSources: () => fetchFromApi('/api/data-sources'),
  getAircraft: () => fetchFromApi('/api/aircraft'),
  getCrew: () => fetchFromApi('/api/crew'),
  getResources: () => fetchFromApi('/api/resources'),
  getAirspace: () => fetchFromApi('/api/airspace'),
  getWeather: () => fetchFromApi('/api/weather'),
  getAlerts: () => fetchFromApi('/api/alerts'),
  getHistory: () => fetchFromApi('/api/history'),
  getSystemStatus: () => fetchFromApi('/api/system-status'),
  
  triggerAnalyse: (stateSnapshot?: any) => 
    fetchFromApi('/api/analyse', {
      method: 'POST',
      body: JSON.stringify(stateSnapshot || {})
    }),

  triggerReoptimise: () => 
    fetchFromApi('/api/reoptimise', {
      method: 'POST'
    }),

  approveDemoPlan: (optionId: string, decision: string, notes?: string) =>
    fetchFromApi('/api/approve-demo', {
      method: 'POST',
      body: JSON.stringify({ optionId, decision, notes })
    })
};
