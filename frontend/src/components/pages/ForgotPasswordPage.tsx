import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Mail, Key, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react'

const NetworkMapAnimation: React.FC = () => {
  const nodes = [
    { x: '15%', y: '35%', label: 'NA-EDGE-01', color: '#00C2FF' },
    { x: '45%', y: '25%', label: 'EU-CORE-02', color: '#7C3AED' },
    { x: '35%', y: '60%', label: 'LATAM-GW', color: '#F59E0B' },
    { x: '75%', y: '30%', label: 'APAC-DB-01', color: '#EF4444' },
    { x: '60%', y: '70%', label: 'AFRICA-NODE', color: '#22C55E' }
  ]

  return (
    <div className="relative w-full h-[420px] bg-[#12182A]/30 border border-border-custom rounded-2xl overflow-hidden shadow-2xl glass-panel-light">
      <div className="absolute inset-0 cyber-grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 world-grid-dots opacity-30 pointer-events-none" />
      <div className="absolute inset-0 cyber-scanner" />
      
      <svg className="absolute inset-0 w-full h-full">
        <motion.path
          d="M 100 145 C 150 120, 250 80, 310 105"
          stroke="rgba(0, 194, 255, 0.4)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 310 105 C 330 150, 450 200, 520 125"
          stroke="rgba(124, 58, 237, 0.4)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.path
          d="M 245 250 C 350 280, 380 200, 520 125"
          stroke="rgba(239, 68, 68, 0.5)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.path
          d="M 420 295 C 380 250, 300 280, 245 250"
          stroke="rgba(34, 197, 94, 0.4)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 100 145 C 130 200, 200 230, 245 250"
          stroke="rgba(245, 158, 11, 0.4)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </svg>

      {nodes.map((node, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
          style={{ left: node.x, top: node.y }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ backgroundColor: `${node.color}08` }}>
            <div className="w-6 h-6 rounded-full animate-ping absolute" style={{ backgroundColor: node.color, opacity: 0.2 }} />
            <div className="w-3 h-3 rounded-full relative z-10" style={{ backgroundColor: node.color, boxShadow: `0 0 12px ${node.color}` }} />
          </div>
          <span className="text-[9px] font-mono text-slate-400 mt-1 bg-[#0A0F1F]/90 px-2 py-0.5 rounded border border-border-custom shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">
            {node.label}
          </span>
        </div>
      ))}

      <div className="absolute bottom-4 left-4 right-4 bg-[#0A0F1F]/95 border border-border-custom p-3.5 rounded-xl font-mono text-[9px] text-slate-400 max-h-[90px] overflow-hidden leading-relaxed shadow-xl">
        <div className="flex items-center space-x-1.5 mb-1.5 text-slate-500 border-b border-border-custom/50 pb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-semibold uppercase tracking-wider text-[8px]">LOG STREAM TELEMETRY</span>
        </div>
        <motion.div animate={{ y: [0, -16, -32, -48] }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }} className="space-y-1">
          <span>[SOC] ANALYZING LOG INGRESS IP 185.220.101.5...</span><br />
          <span className="text-danger">[WARN] ADVERSARY BRUTEFORCE ALERT: DB Ingress attempt blocked.</span><br />
          <span className="text-accent">[INFO] HEARTBEAT: Telemetry channel 99.8% operational.</span><br />
          <span className="text-success">[OK] INTEGRITY: Postgres Docker cluster nodes synchronized.</span>
        </motion.div>
      </div>
    </div>
  )
}

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true)
    }, 1500)
  }

  const features = [
    'AI Threat Detection',
    'Real-time Attack Simulation',
    'MITRE ATT&CK Intelligence',
    'SOC Automation'
  ]

  return (
    <div className="min-h-screen bg-bg-primary text-slate-100 flex overflow-hidden font-sans">
      
      {/* LEFT SIDE: Brand & Graphic (45%) */}
      <div className="hidden lg:flex w-[45%] bg-[#080D1A] border-r border-border-custom flex-col justify-between p-12 relative overflow-hidden">
        {/* Background grids */}
        <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
        <div className="absolute -left-20 -top-20 h-96 w-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center space-x-3.5 select-none">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/15">
            <Shield className="h-5.5 w-5.5 text-[#0B1020] stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-wider text-white uppercase leading-none">CyberFusion</span>
            <span className="text-[9px] text-accent font-mono tracking-widest uppercase block mt-1">AI PLATFORM</span>
          </div>
        </div>

        {/* Animated Visual Area */}
        <div className="relative z-10 my-auto py-8">
          <h2 className="text-xl font-bold text-white mb-2 leading-tight">Threat Analysis Vector Map</h2>
          <p className="text-xs text-slate-400 mb-6 font-medium">Ingesting, isolating, and validating real-time logs across global nodes.</p>
          <NetworkMapAnimation />
        </div>

        {/* Bottom Feature List */}
        <div className="relative z-10 border-t border-border-custom/50 pt-8">
          <div className="grid grid-cols-2 gap-4">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-slate-300">
                <span className="text-accent font-bold text-xs select-none">✓</span>
                <span className="text-xs font-medium tracking-wide">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Gate (55%) */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-20 relative overflow-hidden bg-bg-primary">
        <div className="absolute -right-40 -top-40 h-96 w-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="lg:hidden flex items-center space-x-3 select-none mb-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-accent to-blue-600 flex items-center justify-center shadow-md">
            <Shield className="h-4.5 w-4.5 text-[#0B1020] stroke-[2.5]" />
          </div>
          <span className="font-bold text-sm tracking-wider text-white uppercase">CyberFusion</span>
        </div>
        <div className="lg:hidden" />

        <div className="my-auto max-w-sm w-full mx-auto space-y-8 relative z-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-white m-0 flex items-center gap-2">
              <Key className="h-7 w-7 text-accent" />
              <span>Reset Key</span>
            </h2>
            <p className="text-sm text-slate-400">
              Recover enrolled operator credential keychain
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center space-y-4 bg-[#12182A]/30 border border-border-custom p-6 rounded-2xl animate-in"
              >
                <div className="h-14 w-14 bg-success/10 border border-success/30 text-success rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-7 w-7 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white">Reset Dispatch Sent</h3>
                  <p className="text-xs text-slate-450 leading-relaxed max-w-xs mx-auto">
                    A cryptographically signed key recovery verification has been routed to your inbox.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input with Peer Floating Label */}
                <div className="relative">
                  <div className="absolute left-4 top-[17px] text-slate-400 pointer-events-none">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="email"
                    required
                    id="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="peer w-full bg-[#12182A]/30 border border-border-custom rounded-xl pt-6 pb-2 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 focus:shadow-[0_0_15px_rgba(0,194,255,0.1)] transition-all duration-200"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-11 top-4.5 text-xs text-slate-400 font-medium transition-all pointer-events-none
                    peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-slate-400
                    peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-accent
                    peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-slate-400"
                  >
                    Operator Email Address
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative overflow-hidden group py-3.5 rounded-xl gradient-btn-premium font-bold text-xs tracking-wider uppercase text-[#0A0F1F] cursor-pointer shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4.5 w-4.5 animate-spin text-[#0A0F1F]" />
                  ) : (
                    <>
                      <span>Dispatch Key Reset</span>
                      <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </AnimatePresence>

          {/* Login link */}
          <div className="mt-6 pt-6 border-t border-border-custom/50 text-center">
            <Link
              to="/login"
              className="text-xs text-accent hover:text-accent-hover font-semibold transition"
            >
              Back to Authorization Gateway
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center lg:text-left">
          <span className="text-[10px] font-mono text-slate-500">
            CyberFusion AI Enterprise v1.0
          </span>
        </div>
      </div>
    </div>
  )
}
