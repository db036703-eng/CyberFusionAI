import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Lock, User, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export const LoginPage: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usernameOrEmail || !password) return
    try {
      await login(usernameOrEmail, password)
      navigate('/')
    } catch (err) {
      // Error is set in the store
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
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/20 mb-3 animate-pulse">
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
          
          <h2 className="text-xl font-bold text-white mb-6 font-sans">Authenticate System Access</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Username/Email Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="admin / admin@cyberfusion.ai"
                  value={usernameOrEmail}
                  onChange={(e) => {
                    if (error) clearError()
                    setUsernameOrEmail(e.target.value)
                  }}
                  disabled={isLoading}
                  className="w-full bg-bg-primary/65 border border-border-custom rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Access Credentials
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-accent hover:text-accent-hover font-mono"
                >
                  Forgot Key?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    if (error) clearError()
                    setPassword(e.target.value)
                  }}
                  disabled={isLoading}
                  className="w-full bg-bg-primary/65 border border-border-custom rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden group py-3 rounded-xl bg-gradient-to-r from-accent to-blue-500 hover:from-accent-hover hover:to-blue-600 font-semibold text-xs tracking-wider uppercase text-slate-900 cursor-pointer shadow-lg shadow-accent/10 transition-all duration-300 hover:shadow-accent/25 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin text-slate-900" />
              ) : (
                <>
                  <span>Request Authorization</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 pt-6 border-t border-border-custom/50 text-center">
            <span className="text-xs text-slate-400">New asset operator? </span>
            <Link
              to="/register"
              className="text-xs text-accent hover:text-accent-hover font-semibold transition"
            >
              Register Terminal Identity
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
