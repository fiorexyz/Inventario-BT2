import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ConfirmacionesPage from './pages/confirmaciones'
import DashboardPage from './pages/dashboard'
import InventarioPage from './pages/inventario'
import AppShell from './layouts/AppShell'
import LoginPage from './pages/login'
import MovimientosPage from './pages/movimientos'
import { supabase } from './lib/supabaseClient'

function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    let mounted = true

    async function getSession() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setUser(data.session?.user ?? null)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadProfile() {
      if (!user?.id) {
        setProfile(null)
        return
      }

      setLoadingProfile(true)
      const { data } = await supabase
        .from('perfiles')
        .select('nombre, rol')
        .eq('id', user.id)
        .single()

      if (!active) return
      setProfile(data ?? null)
      setLoadingProfile(false)
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [user])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage user={user} onLogin={(u) => setUser(u)} />} />
      <Route
        path="/"
        element={
          user ? (
            <AppShell
              user={user}
              profile={profile}
              loadingProfile={loadingProfile}
              onSignOut={async () => {
                await supabase.auth.signOut()
                setUser(null)
              }}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="inventario" element={<InventarioPage />} />
        <Route path="movimientos" element={<MovimientosPage />} />
        <Route path="confirmaciones" element={<ConfirmacionesPage />} />
        <Route path="inventory" element={<Navigate to="/inventario" replace />} />
        <Route path="requests" element={<Navigate to="/movimientos" replace />} />
        <Route path="requests/new" element={<Navigate to="/movimientos" replace />} />
        <Route path="history" element={<Navigate to="/confirmaciones" replace />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default App
