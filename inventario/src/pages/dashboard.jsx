import { useOutletContext } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { usePermission } from '../hooks/usePermission';
import ProtectedAction from '../components/ProtectedAction';

const iconModules = import.meta.glob('../assets/*.{svg,png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

function getIconByFileName(fileName) {
  const entry = Object.entries(iconModules).find(([path]) => path.endsWith(`/${fileName}`));
  return entry ? entry[1] : null;
}

const dashboardIcons = {
  materiales: getIconByFileName('materiales.png'),
  disponibles: getIconByFileName('disponible.png'),
  solicitudes: getIconByFileName('solicitudes.png'),
  uso: getIconByFileName('en uso.png'),
};

function StatIcon({ src, label, fallback, bgClass }) {
  if (src) {
    return (
      <div className={`h-12 w-12 rounded-xl ${bgClass} p-2`}>
        <img src={src} alt={label} className="h-full w-full object-contain" />
      </div>
    );
  }

  return (
    <div
      className={`h-12 w-12 rounded-xl ${bgClass} flex items-center justify-center text-sm font-bold text-gray-700`}
      aria-label={label}
      title={label}
    >
      {fallback}
    </div>
  );
}

export default function DashboardPage() {
  const { user, profile, onSignOut } = useOutletContext();
  const { stats, loading } = useDashboardStats();
  const { can } = usePermission();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel Principal</h1>
          <p className="mt-1 text-gray-600">Estado general del inventario y solicitudes</p>
        </div>
        <button
          className="hidden lg:block rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-semibold text-white transition"
          onClick={onSignOut}
        >
          Cerrar sesión
        </button>
      </div>

      {/* User Info Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Perfil del Usuario */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Tu Perfil
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">Nombre</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {profile?.nombre || user?.email || 'Cargando...'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">Rol</p>
              <div className="mt-1">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    profile?.rol === 'bodeguero'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {profile?.rol ? profile.rol.charAt(0).toUpperCase() + profile.rol.slice(1) : 'Cargando...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen Rápido */}
        <div className="bg-linear-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 p-6">
          <h2 className="text-sm font-semibold text-cyan-900 uppercase tracking-wider mb-4">
            Resumen Rápido
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-cyan-700">Total de Materiales</span>
              <span className="font-bold text-xl text-cyan-900">
                {loading ? '-' : stats.totalMateriales}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-cyan-200 pt-3">
              <span className="text-cyan-700">Materiales Disponibles</span>
              <span className="font-bold text-xl text-green-600">
                {loading ? '-' : stats.materialesDisponibles}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-cyan-200 pt-3">
              <span className="text-cyan-700">Solicitudes Activas</span>
              <span className="font-bold text-xl text-orange-600">
                {loading ? '-' : stats.solicitudesActivas}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Materiales */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Materiales</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {loading ? '-' : stats.totalMateriales}
              </p>
            </div>
            <StatIcon
              src={dashboardIcons.materiales}
              label="Total materiales"
              fallback="MT"
              bgClass="bg-blue-100"
            />
          </div>
        </div>

        {/* Disponibles */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Disponibles</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {loading ? '-' : stats.materialesDisponibles}
              </p>
            </div>
            <StatIcon
              src={dashboardIcons.disponibles}
              label="Materiales disponibles"
              fallback="DP"
              bgClass="bg-green-100"
            />
          </div>
        </div>

        {/* Solicitudes Activas */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Solicitudes Activas</p>
              <p className="mt-2 text-3xl font-bold text-orange-600">
                {loading ? '-' : stats.solicitudesActivas}
              </p>
            </div>
            <StatIcon
              src={dashboardIcons.solicitudes}
              label="Solicitudes activas"
              fallback="SA"
              bgClass="bg-orange-100"
            />
          </div>
        </div>

        {/* En Uso */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Items en Uso</p>
              <p className="mt-2 text-3xl font-bold text-purple-600">
                {loading ? '-' : stats.itemsEnUso}
              </p>
            </div>
            <StatIcon
              src={dashboardIcons.uso}
              label="Items en uso"
              fallback="US"
              bgClass="bg-purple-100"
            />
          </div>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Próximos Pasos */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-4">Próximas Acciones</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Ver inventario de materiales</li>
            <li>✓ Revisar solicitudes pendientes</li>
            <ProtectedAction permission="canCreateSolicitud">
              <li>✓ Crear nueva solicitud</li>
            </ProtectedAction>
            <ProtectedAction permission="canCreateMaterial">
              <li>✓ Gestionar materiales</li>
            </ProtectedAction>
          </ul>
        </div>

        {/* Ayuda */}
        <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
          <h3 className="font-semibold text-purple-900 mb-4">¿Necesitas Ayuda?</h3>
          <p className="text-sm text-purple-800 mb-3">
            Navega usando la barra lateral para acceder a:
          </p>
          <ul className="space-y-1 text-sm text-purple-800">
            <li>• <strong>Inventario:</strong> Ver todos los materiales disponibles</li>
            <li>• <strong>Movimientos:</strong> Historial de solicitudes</li>
            <li>• <strong>Confirmaciones:</strong> Verificar devoluciones</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
