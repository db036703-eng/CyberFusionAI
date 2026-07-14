import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './Card'
import { Button } from './Button'
import { FileText, Download, CheckCircle, RefreshCw } from 'lucide-react'

interface ReportItem {
  name: string
  date: string
  size: string
  type: string
  category: string
}

export const RecentReports: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloaded, setDownloaded] = useState<string | null>(null)

  const reports: ReportItem[] = [
    {
      name: 'CyberFusion AI Executive Risk Assessment - Q2 2026',
      date: '2026-07-11',
      size: '2.4 MB',
      type: 'PDF',
      category: 'Executive'
    },
    {
      name: 'MITRE ATT&CK Compliance Mapping & Audit Trail',
      date: '2026-07-10',
      size: '4.8 MB',
      type: 'PDF',
      category: 'Compliance'
    },
    {
      name: 'Daily Anomaly Ingestion & Mitigation Log Report',
      date: '2026-07-11',
      size: '950 KB',
      type: 'CSV',
      category: 'Operations'
    }
  ]

  const handleDownload = (reportName: string) => {
    setDownloading(reportName)
    setTimeout(() => {
      setDownloading(null)
      setDownloaded(reportName)
      
      // Simulate file download
      const element = document.createElement('a')
      const file = new Blob([`Report: ${reportName}\nGenerated at ${new Date().toISOString()}`], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = `${reportName.replace(/\s+/g, '_')}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      setTimeout(() => setDownloaded(null), 3000)
    }, 1500)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } }
  }

  return (
    <Card hoverEffect className="relative overflow-hidden bg-[#12182A]/90 border border-border-custom/80 shadow-[0_8px_30px_rgb(0,0,0,0.25)] rounded-2xl p-6 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-white leading-none">Recent Reports</h3>
        <p className="text-slate-500 text-xs mt-1">Generated compliance documentation and threat brief logs.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-6 space-y-4"
      >
        {reports.map((report, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0A0F1F]/40 border border-border-custom/60 hover:bg-[#0A0F1F]/70 hover:border-slate-700/80 transition duration-200 gap-4"
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="p-2.5 rounded-xl bg-[#12182A] border border-border-custom text-slate-400 shrink-0">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-200 truncate">{report.name}</h4>
                <div className="flex items-center space-x-3 mt-1.5 text-[10px] text-slate-500 font-mono">
                  <span>{report.date}</span>
                  <span>•</span>
                  <span>{report.size}</span>
                  <span>•</span>
                  <span className="text-accent font-semibold">{report.type}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-end select-none">
              <AnimatePresence mode="wait">
                {downloaded === report.name ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-success/10 text-success border border-success/20 text-xs font-mono font-semibold"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Downloaded</span>
                  </motion.div>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={downloading !== null}
                    onClick={() => handleDownload(report.name)}
                    className="w-full sm:w-auto font-mono text-xs flex items-center justify-center space-x-2 border border-border-custom/80 hover:border-accent/40 bg-[#0A0F1F]/20 hover:bg-[#1E293B]/25 py-2 px-4 rounded-xl"
                  >
                    {downloading === report.name ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-accent" />
                    ) : (
                      <Download className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                    )}
                    <span>{downloading === report.name ? 'Generating...' : 'Download'}</span>
                  </Button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  )
}
