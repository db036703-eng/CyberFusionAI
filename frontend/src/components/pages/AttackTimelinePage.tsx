import React from 'react'
import { PageShell } from '../ui/PageShell'
import { AttackTimeline } from '../ui/AttackTimeline'

export const AttackTimelinePage: React.FC = () => {
  return (
    <PageShell
      title="Attack Timeline"
      description="Verify host-to-host lateral migrations and trace intrusion steps correlated across network segments."
      breadcrumbs={['Incidents', 'Attack Timeline']}
    >
      <AttackTimeline />
    </PageShell>
  )
}
