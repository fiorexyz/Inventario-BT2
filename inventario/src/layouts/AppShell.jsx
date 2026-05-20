import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/inventario', label: 'Inventario' },
  { to: '/movimientos', label: 'Movimientos' },
  { to: '/confirmaciones', label: 'Confirmaciones' },
]

export default function AppShell({ user, profile, loadingProfile, onSignOut }) {
  return (
    <main className="min-h-screen bg-midnightviolet-300 text-pearlaqua-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-2xl border border-vintageberry-400 bg-midnightviolet-400 p-4 lg:block">
          <div className="mb-6 border-b border-vintageberry-400 pb-4">
            <p className="text-xs uppercase tracking-[0.25em] text-pearlaqua-300">Inventario Staff</p>
            <p className="mt-3 text-sm text-pearlaqua-100">{profile?.nombre || user?.email}</p>
            <p className="text-xs uppercase tracking-wide text-pearlaqua-200">
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
                      ? 'bg-tangerinedream-300 font-semibold text-midnightviolet-300'
                      : 'text-pearlaqua-100 hover:bg-vintageberry-400 hover:text-pearlaqua-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="mt-6 w-full rounded-lg border border-vintageberry-300 px-3 py-2 text-sm text-pearlaqua-100 transition hover:bg-vintageberry-400 hover:text-pearlaqua-50"
            onClick={onSignOut}
          >
            Cerrar sesion
          </button>
        </aside>

        <div className="flex-1">
          <header className="mb-4 rounded-2xl border border-vintageberry-400 bg-midnightviolet-400 px-4 py-3 lg:hidden">
            <p className="text-xs uppercase tracking-[0.25em] text-pearlaqua-300">Inventario Staff</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-1.5 text-xs transition ${
                      isActive
                        ? 'bg-tangerinedream-300 font-semibold text-midnightviolet-300'
                        : 'bg-vintageberry-400 text-pearlaqua-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-4">
              <button
                className="w-full rounded-lg border border-vintageberry-300 px-3 py-2 text-sm text-pearlaqua-100 transition hover:bg-vintageberry-400 hover:text-pearlaqua-50"
                onClick={onSignOut}
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          <Outlet context={{ user, profile, loadingProfile, onSignOut }} />
        </div>
      </div>
    </main>
  )
}
