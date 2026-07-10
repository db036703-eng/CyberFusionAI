import { create } from 'zustand'

export interface Incident {
  id: string
  title: string
  severity: 'critical' | 'warning' | 'info' | 'success'
  status: 'active' | 'investigating' | 'mitigated' | 'resolved'
  source: string
  category: string
  timestamp: string
  description: string
  remediation?: string
}

interface UIState {
  sidebarOpen: boolean
  activeTab: string
  searchQuery: string
  selectedIncident: Incident | null
  isDetailDrawerOpen: boolean
  isNotificationOpen: boolean
  incidents: Incident[]
  
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setActiveTab: (tab: string) => void
  setSearchQuery: (query: string) => void
  selectIncident: (incident: Incident | null) => void
  setDetailDrawerOpen: (open: boolean) => void
  toggleNotificationPanel: () => void
  closeNotificationPanel: () => void
  mitigateIncident: (id: string) => void
}

const mockIncidents: Incident[] = [
  {
    id: 'INC-2026-001',
    title: 'Adversary Bruteforce on DB Node',
    severity: 'critical',
    status: 'active',
    source: '10.0.4.82',
    category: 'Authentication',
    timestamp: '19:42:15',
    description: 'Multiple failed ssh attempts detected on core postgres server from external IP block 198.51.100.12. Critical database credentials at risk.',
    remediation: 'Apply firewall drop rule for CIDR block 198.51.100.0/24 and force credentials cycle for the postgres root user.'
  },
  {
    id: 'INC-2026-002',
    title: 'Anomalous Data Exfiltration DNS Queries',
    severity: 'warning',
    status: 'investigating',
    source: '10.0.12.14',
    category: 'Data Exfiltration',
    timestamp: '19:35:48',
    description: 'High frequency of custom sub-domain queries matching encryption formats pointing to an unverified external DNS server.',
    remediation: 'Quarantine server 10.0.12.14 and route DNS inquiries through standard internal server validators.'
  },
  {
    id: 'INC-2026-003',
    title: 'Phishing Campaign Link Executed',
    severity: 'critical',
    status: 'active',
    source: 'Workstation-HR-04',
    category: 'Enduser Infiltration',
    timestamp: '19:12:03',
    description: 'HR Workstation user opened custom email hyperlink download executing powershell runner script with active memory injection.',
    remediation: 'Revoke active AD sessions for employee ID HR-04, disconnect workstation HR-04 from company VPN.'
  },
  {
    id: 'INC-2026-004',
    title: 'AWS Security Group Wildcard Ingress',
    severity: 'info',
    status: 'mitigated',
    source: 'Cloud-Prod-01',
    category: 'Compliance',
    timestamp: '18:55:00',
    description: 'AWS security group changed dynamically from console exposing database ingress socket to wildcard 0.0.0.0/0.',
    remediation: 'Reverted security group ingress properties using AWS Config automated terraform mitigation script.'
  },
  {
    id: 'INC-2026-005',
    title: 'Kubernetes Container Root Drift Detected',
    severity: 'warning',
    status: 'resolved',
    source: 'K8s-Cluster-Node-02',
    category: 'Container Security',
    timestamp: '18:40:12',
    description: 'Container binary hashes mismatched against docker repository manifest indicating file write inside read-only layers.',
    remediation: 'Restructured Kubernetes deployment setting ReadOnlyRootFilesystem=true. Redeployed deployment pods.'
  }
]

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeTab: 'overview',
  searchQuery: '',
  selectedIncident: null,
  isDetailDrawerOpen: false,
  isNotificationOpen: false,
  incidents: mockIncidents,
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectIncident: (incident) => set({ selectedIncident: incident, isDetailDrawerOpen: !!incident }),
  setDetailDrawerOpen: (open) => set((state) => ({ isDetailDrawerOpen: open, selectedIncident: open ? state.selectedIncident : null })),
  toggleNotificationPanel: () => set((state) => ({ isNotificationOpen: !state.isNotificationOpen })),
  closeNotificationPanel: () => set({ isNotificationOpen: false }),
  mitigateIncident: (id) => set((state) => ({
    incidents: state.incidents.map((inc) =>
      inc.id === id ? { ...inc, status: 'mitigated', severity: 'success' } : inc
    ),
    // Update active details drawer view if open
    selectedIncident: state.selectedIncident && state.selectedIncident.id === id
      ? { ...state.selectedIncident, status: 'mitigated', severity: 'success' }
      : state.selectedIncident
  }))
}))
