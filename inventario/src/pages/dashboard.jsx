import { useOutletContext } from 'react-router-dom'

export default function DashboardPage() {
  const { user, profile, loadingProfile, onSignOut } = useOutletContext()

  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Panel principal</h1>
            <p className="mt-1 text-sm text-slate-300">
              Estado general del inventario y solicitudes.
            </p>
          </div>
          <button
            className="hidden rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300 lg:block"
            onClick={onSignOut}
          >
            Cerrar sesion
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Usuario</p>
          <p className="mt-2 text-lg font-medium">{profile?.nombre || user?.email}</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Rol</p>
          <p className="mt-2 text-lg font-medium capitalize">
            {loadingProfile ? 'Cargando...' : profile?.rol || 'sin rol'}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Solicitudes activas</p>
          <p className="mt-2 text-3xl font-semibold">--</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Materiales en uso</p>
          <p className="mt-2 text-3xl font-semibold">--</p>
        </article>
      </section>
    </div>
  )
}
