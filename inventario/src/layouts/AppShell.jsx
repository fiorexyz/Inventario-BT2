import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/inventario', label: 'Inventario' },
  { to: '/movimientos', label: 'Movimientos' },
  { to: '/confirmaciones', label: 'Confirmaciones' },
]

export default function AppShell({ user, profile, loadingProfile, onSignOut }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:block">
          <div className="mb-6 border-b border-slate-800 pb-4">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Inventario Staff</p>
            <p className="mt-3 text-sm text-slate-300">{profile?.nombre || user?.email}</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {loadingProfile ? 'cargando...' : profile?.rol || 'sin rol'}
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-cyan-400 font-semibold text-slate-900'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="mt-6 w-full rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
            onClick={onSignOut}
          >
            Cerrar sesion
          </button>
        </aside>

        <div className="flex-1">
          <header className="mb-4 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 lg:hidden">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Inventario Staff</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-1.5 text-xs transition ${
                      isActive
                        ? 'bg-cyan-400 font-semibold text-slate-900'
                        : 'bg-slate-800 text-slate-200'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </header>

          <Outlet context={{ user, profile, loadingProfile, onSignOut }} />
        </div>
      </div>
    </main>
  )
}
