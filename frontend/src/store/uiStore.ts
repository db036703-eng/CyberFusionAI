import { create } from 'zustand'
import { apiRequest } from '../utils/api'

export interface Incident {
  id: string
  title: string
  severity: 'critical' | 'warning' | 'info' | 'success'
  status: 'active' | 'investigating' | 'mitigated' | 'resolved'
  source_ip?: string
  destination_ip?: string
  mitre_technique?: string
  assigned_user_id?: number
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
  fetchIncidents: () => Promise<void>
  mitigateIncident: (id: string) => Promise<void>
  clearError: () => void
}

const mapIncident = (inc: any): Incident => ({
  ...inc,
  source: inc.source_ip || inc.source || 'Internal',
  timestamp: inc.created_at ? new Date(inc.created_at).toLocaleTimeString('en-US', { hour12: false }) : 'Unknown'
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

  fetchIncidents: async () => {
    set({ isLoading: true, error: null })
    try {
      const list = await apiRequest('/incidents')
      set({ incidents: list.map(mapIncident) })
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch incidents list' })
    } finally {
      set({ isLoading: false })
    }
  },

  mitigateIncident: async (id) => {
    set({ error: null })
    try {
      await apiRequest(`/incidents/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: 'mitigated',
          severity: 'success'
        })
      })
      
      await get().fetchIncidents()
      await get().fetchRecentIncidents()
      await get().fetchDashboardSummary()
      
      const { selectedIncident } = get()
      if (selectedIncident && selectedIncident.id === id) {
        set({
          selectedIncident: {
            ...selectedIncident,
            status: 'mitigated',
            severity: 'success'
          }
        })
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to mitigate incident' })
    }
  }
}))

