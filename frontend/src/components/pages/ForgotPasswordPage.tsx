import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Mail, Key, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react'

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
          
          <h2 className="text-xl font-bold text-white mb-4 font-sans flex items-center gap-2">
            <Key className="h-5 w-5 text-accent" />
            <span>Reset Encryption Key</span>
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Enter your enrolled operator email below. The CyberFusion gateway will dispatch a cryptographically signed link to reset your credential keychain.
          </p>

          {success ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-6 text-center space-y-4"
            >
              <div className="h-16 w-16 bg-success-custom/10 border border-success-custom/30 text-success-custom rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Reset Dispatch Sent</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  A verification token has been routed to <strong className="text-slate-200">{email}</strong>. Please check your inbox or spam folders.
                </p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Operator Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="operator@cyberfusion.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    <span>Dispatch Key Reset</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}

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
      </motion.div>
    </div>
  )
}
