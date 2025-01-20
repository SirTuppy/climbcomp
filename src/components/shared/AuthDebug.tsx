'use client'

import { useAuth } from '../../components/providers/AuthProvider'

export function AuthDebug() {
  const { user, userDetails, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-4 bg-slate-100 rounded-lg">
      <h2 className="font-bold mb-2">Auth Debug</h2>
      <pre className="text-sm">
        {JSON.stringify({ 
          authenticated: !!user,
          email: user?.email,
          roles: userDetails?.roles,
          id: user?.id
        }, null, 2)}
      </pre>
    </div>
  )
}