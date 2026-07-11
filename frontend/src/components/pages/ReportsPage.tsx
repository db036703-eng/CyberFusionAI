import React from 'react'
import { PageShell } from '../ui/PageShell'
import { RecentReports } from '../ui/RecentReports'

export const ReportsPage: React.FC = () => {
  return (
    <PageShell
      title="Enterprise Reports"
      description="Ingest and review compliance checklists, risk trends, and regulatory briefings compiled dynamically."
      breadcrumbs={['Compliance', 'Reports']}
    >
      <RecentReports />
    </PageShell>
  )
}
