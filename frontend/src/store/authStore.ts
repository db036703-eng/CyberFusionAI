import { create } from 'zustand'

export interface User {
  id: number
  username: string
  email: string
  role: 'Super Admin' | 'SOC Analyst' | 'Threat Hunter' | 'Viewer'
  is_active: boolean
  created_at: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  
  login: (usernameOrEmail: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, role: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  clearError: () => void
  initialize: () => Promise<void>
}

const API_URL = 'http://localhost:8000'

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  initialize: async () => {
    const { accessToken } = get()
    if (accessToken) {
      set({ isLoading: true })
      try {
        await get().fetchCurrentUser()
      } catch (err) {
        // Access token expired, try refreshing
        try {
          await get().refresh()
        } catch {
          // If refresh fails, log out
          get().logout()
        }
      } finally {
        set({ isLoading: false })
      }
    }
  },

  login: async (usernameOrEmail, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email: usernameOrEmail, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Login failed')
      }

      const data = await response.json()
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      
      set({ 
        accessToken: data.access_token, 
        refreshToken: data.refresh_token 
      })

      await get().fetchCurrentUser()
    } catch (err: any) {
      set({ error: err.message || 'Login failed' })
      throw err;
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (username, email, password, role) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Registration failed')
      }
    } catch (err: any) {
      set({ error: err.message || 'Registration failed' })
      throw err;
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    const { refreshToken } = get()
    if (refreshToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })
      } catch (err) {
        console.error('Logout error on backend:', err)
      }
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, accessToken: null, refreshToken: null, error: null })
  },

  refresh: async () => {
    const { refreshToken } = get()
    if (!refreshToken) throw new Error('No refresh token available')

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Session expired')
      }

      const data = await response.json()
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)

      set({ 
        accessToken: data.access_token, 
        refreshToken: data.refresh_token 
      })

      await get().fetchCurrentUser()
    } catch (err: any) {
      get().logout()
      throw err
    }
  },

  fetchCurrentUser: async () => {
    const { accessToken } = get()
    if (!accessToken) throw new Error('No access token available')

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 
        'Authorization': `Bearer ${accessToken}` 
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }

    const userData = await response.json()
    set({ user: userData })
  }
}))
