import { useAuthStore } from '../store/authStore'

const API_URL = 'http://localhost:8000'

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

export async function apiRequest(endpoint: string, options: RequestOptions = {}): Promise<any> {
  const authStore = useAuthStore.getState()
  const headers = { ...options.headers }

  if (authStore.accessToken) {
    headers['Authorization'] = `Bearer ${authStore.accessToken}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  // If unauthorized (access token expired), attempt refresh
  if (response.status === 401 && authStore.refreshToken) {
    try {
      // Trigger token refresh flow
      await authStore.refresh()
      
      // Retry the original request with the new access token
      const freshAuthStore = useAuthStore.getState()
      const newHeaders = { ...options.headers }
      if (freshAuthStore.accessToken) {
        newHeaders['Authorization'] = `Bearer ${freshAuthStore.accessToken}`
      }
      
      const retryResponse = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...newHeaders,
        },
      })
      
      if (!retryResponse.ok) {
        const retryErrData = await retryResponse.json().catch(() => ({}))
        throw new Error(retryErrData.detail || 'API Request failed after token refresh')
      }
      
      const retryText = await retryResponse.text()
      return retryText ? JSON.parse(retryText) : {}
    } catch (refreshErr) {
      // Refresh failed, user will be logged out by the store
      throw new Error('Session expired')
    }
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.detail || 'API request failed')
  }

  const text = await response.text()
  return text ? JSON.parse(text) : {}
}
