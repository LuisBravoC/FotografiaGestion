import { createContext, useContext, useEffect, useState } from 'react'
import { getSession, onAuthChange } from './auth.js'

const AuthContext = createContext(null)

/**
 * Provee { session, user, loading } a toda la app.
 * - session: objeto de sesión de Supabase o null
 * - user:    datos del usuario autenticado o null
 * - loading: true mientras se verifica la sesión inicial
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carga la sesión existente al iniciar
    getSession().then(s => {
      setSession(s)
      setLoading(false)
    })

    // Escucha cambios (login, logout, refresco de token)
    const unsubscribe = onAuthChange(s => {
      setSession(s)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/** Hook para consumir el contexto de auth en cualquier componente. */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
