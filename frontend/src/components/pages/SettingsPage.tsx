import React, { useState } from 'react'
import { PageShell } from '../ui/PageShell'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Check, Shield, Bell } from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <PageShell
      title="Platform Settings"
      description="Adjust log telemetry ingestion rates, configure slack alerts / alert webhooks, and map AD user groups."
      breadcrumbs={['Configuration', 'Settings']}
    >
      {saved && (
        <Card className="p-4 border-success-custom/35 bg-success-custom/5 text-success-custom flex items-center space-x-3">
          <Check className="h-5 w-5" />
          <span className="text-xs font-mono font-semibold">Settings saved and broadcasted to Docker registry.</span>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center space-x-2.5 mb-2">
            <Shield className="h-5 w-5 text-accent" />
            <h3 className="text-sm font-bold text-white">Ingestion Metrics Rates</h3>
          </div>
          
          <div className="space-y-4 text-xs font-mono">
            <div className="flex justify-between items-center py-2 border-b border-border-custom/50">
              <span className="text-slate-450">Ingestion Frequency</span>
              <select className="bg-bg-primary border border-border-custom text-slate-200 text-xs rounded-lg p-1.5 outline-none">
                <option>Real-Time Ingestion</option>
                <option>Poll Every 5 Seconds</option>
                <option>Poll Every 15 Seconds</option>
              </select>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-custom/50">
              <span className="text-slate-450">Active Threat Block Policy</span>
              <select className="bg-bg-primary border border-border-custom text-slate-200 text-xs rounded-lg p-1.5 outline-none">
                <option>Automated Quarantine</option>
                <option>Analyst Approval Required</option>
                <option>Log Telemetry Only</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center space-x-2.5 mb-2">
            <Bell className="h-5 w-5 text-warning-custom" />
            <h3 className="text-sm font-bold text-white">Webhook Integrations</h3>
          </div>
          
          <div className="space-y-4 text-xs font-mono">
            <div className="flex justify-between items-center py-2 border-b border-border-custom/50">
              <span className="text-slate-450">Slack Webhook URL</span>
              <input
                type="text"
                value="https://hooks.slack.com/services/T00..."
                readOnly
                className="bg-bg-primary border border-border-custom text-slate-400 text-xs rounded-lg p-1.5 outline-none text-right w-48"
              />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-custom/50">
              <span className="text-slate-450">Syslog Destination Port</span>
              <input
                type="text"
                value="UDP/514"
                readOnly
                className="bg-bg-primary border border-border-custom text-slate-400 text-xs rounded-lg p-1.5 outline-none text-right w-24 font-bold"
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-end">
        <Button variant="primary" onClick={handleSave} className="font-mono text-xs">
          Save Configuration Changes
        </Button>
      </div>
    </PageShell>
  )
}
