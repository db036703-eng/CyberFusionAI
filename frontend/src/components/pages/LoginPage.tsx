import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, User, AlertCircle, ArrowRight, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const NetworkMapAnimation: React.FC = () => {
  // Coordinates representing threat intelligence hub points
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
      
      {/* Animated Glowing Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Connection 1 */}
        <motion.path
          d="M 100 145 C 150 120, 250 80, 310 105"
          stroke="rgba(0, 194, 255, 0.4)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Connection 2 */}
        <motion.path
          d="M 310 105 C 330 150, 450 200, 520 125"
          stroke="rgba(124, 58, 237, 0.4)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        {/* Connection 3 */}
        <motion.path
          d="M 245 250 C 350 280, 380 200, 520 125"
          stroke="rgba(239, 68, 68, 0.5)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        {/* Connection 4 */}
        <motion.path
          d="M 420 295 C 380 250, 300 280, 245 250"
          stroke="rgba(34, 197, 94, 0.4)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Connection 5 */}
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

      {/* Nodes */}
      {nodes.map((node, index) => (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
          style={{ left: node.x, top: node.y }}
        >
          {/* Glowing Ring */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center relative"
            style={{ backgroundColor: `${node.color}08` }}
          >
            <div
              className="w-6 h-6 rounded-full animate-ping absolute"
              style={{ backgroundColor: node.color, opacity: 0.2 }}
            />
            <div
              className="w-3 h-3 rounded-full relative z-10"
              style={{ 
                backgroundColor: node.color,
                boxShadow: `0 0 12px ${node.color}`
              }}
            />
          </div>
          <span className="text-[9px] font-mono text-slate-400 mt-1 bg-[#0A0F1F]/90 px-2 py-0.5 rounded border border-border-custom shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">
            {node.label}
          </span>
        </div>
      ))}

      {/* Real-time Log Stream Simulator overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-[#0A0F1F]/95 border border-border-custom p-3.5 rounded-xl font-mono text-[9px] text-slate-400 max-h-[90px] overflow-hidden leading-relaxed shadow-xl">
        <div className="flex items-center space-x-1.5 mb-1.5 text-slate-500 border-b border-border-custom/50 pb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-semibold uppercase tracking-wider text-[8px]">LOG STREAM TELEMETRY</span>
        </div>
        <motion.div
          animate={{ y: [0, -16, -32, -48] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="space-y-1"
        >
          <span>[SOC] ANALYZING LOG INGRESS IP 185.220.101.5...</span><br />
          <span className="text-danger">[WARN] ADVERSARY BRUTEFORCE ALERT: DB Ingress attempt blocked.</span><br />
          <span className="text-accent">[INFO] HEARTBEAT: Telemetry channel 99.8% operational.</span><br />
          <span className="text-success">[OK] INTEGRITY: Postgres Docker cluster nodes synchronized.</span>
        </motion.div>
      </div>
    </div>
  )
}

export const LoginPage: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usernameOrEmail || !password) return
    try {
      await login(usernameOrEmail, password)
      navigate('/')
    } catch (err) {
      // Error handles in auth store
    }
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

        {/* Small top header for mobile screens */}
        <div className="lg:hidden flex items-center space-x-3 select-none mb-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-accent to-blue-600 flex items-center justify-center shadow-md">
            <Shield className="h-4.5 w-4.5 text-[#0B1020] stroke-[2.5]" />
          </div>
          <span className="font-bold text-sm tracking-wider text-white uppercase">CyberFusion</span>
        </div>
        <div className="lg:hidden" /> {/* Spacer */}

        {/* Main Panel Form */}
        <div className="my-auto max-w-sm w-full mx-auto space-y-8 relative z-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-white m-0">Welcome back</h2>
            <p className="text-sm text-slate-400">Sign in to CyberFusion AI Enterprise</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-center space-x-2.5"
                >
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span className="leading-normal">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Username/Email Input with Peer Floating Label */}
            <div className="relative">
              <div className="absolute left-4 top-[17px] text-slate-400 pointer-events-none">
                <User className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                required
                id="usernameOrEmail"
                placeholder=" "
                value={usernameOrEmail}
                onChange={(e) => {
                  if (error) clearError()
                  setUsernameOrEmail(e.target.value)
                }}
                disabled={isLoading}
                className="peer w-full bg-[#12182A]/30 border border-border-custom rounded-xl pt-6 pb-2 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 focus:shadow-[0_0_15px_rgba(0,194,255,0.1)] transition-all duration-200"
              />
              <label
                htmlFor="usernameOrEmail"
                className="absolute left-11 top-4.5 text-xs text-slate-400 font-medium transition-all pointer-events-none
                peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-slate-400
                peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-accent
                peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-slate-400"
              >
                Username or Email
              </label>
            </div>

            {/* Password Input with Peer Floating Label & Toggle */}
            <div className="relative">
              <div className="absolute left-4 top-[17px] text-slate-400 pointer-events-none">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => {
                  if (error) clearError()
                  setPassword(e.target.value)
                }}
                disabled={isLoading}
                className="peer w-full bg-[#12182A]/30 border border-border-custom rounded-xl pt-6 pb-2 pl-11 pr-11 text-sm text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 focus:shadow-[0_0_15px_rgba(0,194,255,0.1)] transition-all duration-200"
              />
              <label
                htmlFor="password"
                className="absolute left-11 top-4.5 text-xs text-slate-400 font-medium transition-all pointer-events-none
                peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-slate-400
                peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-accent
                peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-slate-400"
              >
                Access Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-[17px] text-slate-400 hover:text-white transition focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
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
                  <span>Sign In</span>
                  <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Links panel */}
          <div className="flex flex-col items-center space-y-4 text-center mt-6">
            <Link
              to="/forgot-password"
              className="text-xs text-slate-400 hover:text-white transition font-medium"
            >
              Forgot Credentials?
            </Link>
            
            <div className="w-full flex items-center justify-center space-x-2">
              <span className="h-[1px] bg-border-custom flex-1" />
              <span className="text-[10px] text-slate-550 font-mono uppercase">Or</span>
              <span className="h-[1px] bg-border-custom flex-1" />
            </div>

            <Link
              to="/register"
              className="text-xs text-slate-400 hover:text-white font-semibold transition border border-border-custom hover:border-slate-700 bg-bg-secondary/40 hover:bg-[#1E293B]/20 py-2.5 rounded-xl w-full text-center"
            >
              Register Terminal Identity
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center lg:text-left mt-8">
          <span className="text-[10px] font-mono text-slate-500">
            CyberFusion AI Enterprise v1.0
          </span>
        </div>
      </div>
    </div>
  )
}
