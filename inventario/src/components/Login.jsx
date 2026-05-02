import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      onLogin(data.user || null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.17),_transparent_45%),radial-gradient(circle_at_80%_80%,_rgba(56,189,248,0.12),_transparent_40%)]"></div>

      <section className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur">
        <div className="grid lg:grid-cols-2">
          <aside className="hidden bg-gradient-to-br from-cyan-500 to-teal-500 p-10 text-slate-900 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.25em]">
              Sistema de Bodega
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight">
              Inventario Staff
            </h1>
            <p className="mt-4 text-sm text-slate-700">
              Bienvenidos Staff!!
            </p>
          </aside>

          <div className="p-6 sm:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
              Acceso
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Iniciar sesion</h2>
            <p className="mt-2 text-sm text-slate-300">
              Ingresa con tu usuario autorizado en Supabase.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-200">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                  placeholder="nombre@correo.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-200">Contrasena</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Ingresando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
