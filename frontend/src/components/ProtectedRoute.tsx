import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ShieldAlert, RefreshCw } from 'lucide-react'
import { Card } from './ui/Card'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('Super Admin' | 'SOC Analyst' | 'Threat Hunter' | 'Viewer')[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, accessToken, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary text-slate-100 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-accent" />
        <span className="text-xs font-mono text-slate-400">Verifying security parameters...</span>
      </div>
    )
  }

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[60vh] w-full">
        <Card className="max-w-md w-full border border-critical-custom/30 bg-bg-secondary p-8 text-center space-y-6">
          <div className="h-14 w-14 rounded-full bg-critical-custom/10 border border-critical-custom/30 text-critical-custom flex items-center justify-center mx-auto">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Access Denied</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your security role (<strong className="text-slate-200">{user.role}</strong>) does not have authorization to view this asset. Please contact your Super Administrator.
            </p>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Error Code: 403_ACCESS_RESTRICTED_ROLE
          </div>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
