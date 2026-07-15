import { create } from 'zustand'
import { apiRequest } from '../utils/api'

export interface Incident {
  id: string
  title: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'critical' | 'warning' | 'info' | 'success'
  status: 'New' | 'Investigating' | 'Mitigated' | 'Resolved' | 'active' | 'investigating' | 'mitigated' | 'resolved'
  source_ip?: string
  destination_ip?: string
  mitre_technique?: string
  assigned_user_id?: number
  assigned_user?: {
    id: number
    username: string
    email: string
    role: string
  }
  category?: string
  description: string
  remediation?: string
  created_at?: string
  updated_at?: string
  // Support legacy UI accessors
  source?: string
  timestamp?: string
}

export interface DashboardSummary {
  organization_risk: number
  critical_incidents: number
  open_incidents: number
  ioc_matches: number
  threat_feed_health: string
  ai_confidence: string
}

export interface SystemHealth {
  status: 'healthy' | 'unhealthy' | 'loading'
  db_connected: boolean
  uptime_seconds: number
}

export interface ThreatFeedItem {
  id: string
  source: string
  indicator: string
  severity: 'critical' | 'warning' | 'info'
  timestamp: string
  status: string
}

interface UIState {
  sidebarOpen: boolean
  activeTab: string
  searchQuery: string
  selectedIncident: Incident | null
  isDetailDrawerOpen: boolean
  isNotificationOpen: boolean
  incidents: Incident[]
  dashboardSummary: DashboardSummary | null
  recentIncidents: Incident[]
  threatFeed: ThreatFeedItem[]
  systemHealth: SystemHealth | null
  isLoading: boolean
  error: string | null
  
  // Pagination State
  totalIncidents: number
  totalPages: number
  currentPage: number
  incidentsPerPage: number
  
  // Analysts list
  analysts: any[]
  
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setActiveTab: (tab: string) => void
  setSearchQuery: (query: string) => void
  selectIncident: (incident: Incident | null) => void
  setDetailDrawerOpen: (open: boolean) => void
  toggleNotificationPanel: () => void
  closeNotificationPanel: () => void
  fetchDashboardSummary: () => Promise<void>
  fetchRecentIncidents: () => Promise<void>
  fetchThreatFeed: () => Promise<void>
  fetchSystemHealth: () => Promise<void>
  fetchIncidents: (page?: number, limit?: number, filters?: { severity?: string, status?: string, category?: string, search?: string }) => Promise<void>
  fetchAnalysts: () => Promise<void>
  createIncident: (incident: any) => Promise<void>
  updateIncident: (id: string, incident: any) => Promise<void>
  deleteIncident: (id: string) => Promise<void>
  mitigateIncident: (id: string) => Promise<void>
  clearError: () => void
}

const mapIncident = (inc: any): Incident => ({
  ...inc,
  source: inc.source_ip || inc.source || 'Internal',
  timestamp: inc.created_at ? new Date(inc.created_at).toLocaleString() : 'Unknown'
})

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  activeTab: 'overview',
  searchQuery: '',
  selectedIncident: null,
  isDetailDrawerOpen: false,
  isNotificationOpen: false,
  incidents: [],
  dashboardSummary: null,
  recentIncidents: [],
  threatFeed: [],
  systemHealth: null,
  isLoading: false,
  error: null,
  
  // Pagination Defaults
  totalIncidents: 0,
  totalPages: 1,
  currentPage: 1,
  incidentsPerPage: 10,
  
  // Analysts default
  analysts: [],
  
  clearError: () => set({ error: null }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectIncident: (incident) => set({ selectedIncident: incident, isDetailDrawerOpen: !!incident }),
  setDetailDrawerOpen: (open) => set((state) => ({ isDetailDrawerOpen: open, selectedIncident: open ? state.selectedIncident : null })),
  toggleNotificationPanel: () => set((state) => ({ isNotificationOpen: !state.isNotificationOpen })),
  closeNotificationPanel: () => set({ isNotificationOpen: false }),

  fetchDashboardSummary: async () => {
    set({ isLoading: true, error: null })
    try {
      const summary = await apiRequest('/dashboard/summary')
      set({ dashboardSummary: summary })
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch dashboard summary' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchRecentIncidents: async () => {
    set({ isLoading: true, error: null })
    try {
      const list = await apiRequest('/dashboard/recent-incidents')
      set({ recentIncidents: list.map(mapIncident) })
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch recent incidents' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchThreatFeed: async () => {
    set({ isLoading: true, error: null })
    try {
      const feed = await apiRequest('/dashboard/threat-feed')
      set({ threatFeed: feed })
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch threat feed' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchSystemHealth: async () => {
    try {
      const health = await apiRequest('/dashboard/system-health')
      set({ systemHealth: health })
    } catch (err: any) {
      set({ systemHealth: { status: 'unhealthy', db_connected: false, uptime_seconds: 0 } })
    }
  },

  fetchIncidents: async (page = 1, limit = 10, filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      
      if (filters.severity && filters.severity !== 'all') {
        params.append('severity', filters.severity)
      }
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status)
      }
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category)
      }
      if (filters.search) {
        params.append('search', filters.search)
      }
      
      const res = await apiRequest(`/incidents?${params.toString()}`)
      set({
        incidents: res.items.map(mapIncident),
        totalIncidents: res.total,
        totalPages: res.pages,
        currentPage: res.page,
        incidentsPerPage: res.limit
      })
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch incidents list' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchAnalysts: async () => {
    try {
      const list = await apiRequest('/incidents/analysts')
      set({ analysts: list })
    } catch (err: any) {
      console.error('Failed to fetch analysts:', err)
    }
  },

  createIncident: async (incident) => {
    set({ isLoading: true, error: null })
    try {
      await apiRequest('/incidents', {
        method: 'POST',
        body: JSON.stringify(incident)
      })
      await get().fetchIncidents(get().currentPage, get().incidentsPerPage)
      await get().fetchRecentIncidents()
      await get().fetchDashboardSummary()
    } catch (err: any) {
      set({ error: err.message || 'Failed to create incident' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  updateIncident: async (id, incident) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await apiRequest(`/incidents/${id}`, {
        method: 'PUT',
        body: JSON.stringify(incident)
      })
      
      await get().fetchIncidents(get().currentPage, get().incidentsPerPage)
      await get().fetchRecentIncidents()
      await get().fetchDashboardSummary()
      
      const { selectedIncident } = get()
      if (selectedIncident && selectedIncident.id === id) {
        set({ selectedIncident: mapIncident(updated) })
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to update incident' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  deleteIncident: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await apiRequest(`/incidents/${id}`, {
        method: 'DELETE'
      })
      
      // If we deleted the last item on the page, go to the previous page
      const newPage = get().incidents.length === 1 && get().currentPage > 1
        ? get().currentPage - 1 
        : get().currentPage;
        
      await get().fetchIncidents(newPage, get().incidentsPerPage)
      await get().fetchRecentIncidents()
      await get().fetchDashboardSummary()
      
      const { selectedIncident } = get()
      if (selectedIncident && selectedIncident.id === id) {
        set({ selectedIncident: null, isDetailDrawerOpen: false })
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete incident' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  mitigateIncident: async (id) => {
    set({ error: null })
    try {
      const updated = await apiRequest(`/incidents/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: 'Mitigated'
        })
      })
      
      await get().fetchIncidents(get().currentPage, get().incidentsPerPage)
      await get().fetchRecentIncidents()
      await get().fetchDashboardSummary()
      
      const { selectedIncident } = get()
      if (selectedIncident && selectedIncident.id === id) {
        set({ selectedIncident: mapIncident(updated) })
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to mitigate incident' })
    }
  }
}))
