import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Lock, User, Mail, ShieldAlert, AlertCircle, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Viewer')
  const [success, setSuccess] = useState(false)
  const { register, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !email || !password || !role) return
    try {
      await register(username, email, password, role)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2500)
    } catch (err) {
      // Error is set in store
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background patterns */}
      <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute -left-40 -bottom-40 h-96 w-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-40 -top-40 h-96 w-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Branding header */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/20 mb-3">
            <Shield className="h-6 w-6 text-[#0B1020] stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider text-white uppercase m-0">
            CyberFusion
          </h1>
          <p className="text-[10px] text-accent font-mono tracking-widest uppercase mt-1">
            Enterprise Security Operations Center
          </p>
        </div>

        {/* Card Body */}
        <div className="glass-panel p-8 rounded-card border border-border-custom shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent to-blue-500" />
          
          <h2 className="text-xl font-bold text-white mb-6 font-sans">Register Operator Node</h2>

          {success ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8 text-center space-y-4"
            >
              <div className="h-16 w-16 bg-success-custom/10 border border-success-custom/30 text-success-custom rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Registration Complete</h3>
                <p className="text-xs text-slate-400">
                  Operator node enrolled successfully. Redirecting to auth gateway...
                </p>
              </div>
              <div className="h-1.5 w-24 bg-success-custom/20 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-success-custom w-1/2 rounded-full animate-bounce" />
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4.5">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-xl bg-critical-custom/10 border border-critical-custom/30 text-critical-custom text-xs flex items-center space-x-2.5"
                >
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span className="leading-normal">{error}</span>
                </motion.div>
              )}

              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. analyst_john"
                    value={username}
                    onChange={(e) => {
                      if (error) clearError()
                      setUsername(e.target.value)
                    }}
                    disabled={isLoading}
                    className="w-full bg-bg-primary/65 border border-border-custom rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition duration-200"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@cyberfusion.ai"
                    value={email}
                    onChange={(e) => {
                      if (error) clearError()
                      setEmail(e.target.value)
                    }}
                    disabled={isLoading}
                    className="w-full bg-bg-primary/65 border border-border-custom rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Access Key Passphrase
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => {
                      if (error) clearError()
                      setPassword(e.target.value)
                    }}
                    disabled={isLoading}
                    className="w-full bg-bg-primary/65 border border-border-custom rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition duration-200"
                  />
                </div>
              </div>

              {/* Role Selection Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Assigned Security Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-[#141A2E] border border-border-custom rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent transition duration-200 appearance-none cursor-pointer"
                  >
                    <option value="Viewer">Viewer (Read-Only Access)</option>
                    <option value="Threat Hunter">Threat Hunter (Ingestion & Search)</option>
                    <option value="SOC Analyst">SOC Analyst (Incident Remediation)</option>
                    <option value="Super Admin">Super Admin (System Controls)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden group py-3 mt-2 rounded-xl bg-gradient-to-r from-accent to-blue-500 hover:from-accent-hover hover:to-blue-600 font-semibold text-xs tracking-wider uppercase text-slate-900 cursor-pointer shadow-lg shadow-accent/10 transition-all duration-300 hover:shadow-accent/25 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-900" />
                ) : (
                  <>
                    <span>Submit Enrollment</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Login link */}
          <div className="mt-5 pt-5 border-t border-border-custom/50 text-center">
            <span className="text-xs text-slate-400 font-medium">Already enrolled? </span>
            <Link
              to="/login"
              className="text-xs text-accent hover:text-accent-hover font-semibold transition"
            >
              Sign In to Terminal
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
