import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSolicitudes } from '../hooks/useSolicitudes';
import { usePermission } from '../hooks/usePermission';
import ProtectedAction from '../components/ProtectedAction';

const ESTADO_COLORS = {
  solicitado: 'bg-yellow-100 text-yellow-800',
  aprobado: 'bg-blue-100 text-blue-800',
  en_uso: 'bg-purple-100 text-purple-800',
  devuelto: 'bg-orange-100 text-orange-800',
  confirmado: 'bg-green-100 text-green-800',
  rechazado: 'bg-red-100 text-red-800',
};

export default function MovimientosPage() {
  const { user, profile } = useOutletContext();
  const { solicitudes, loading, error } = useSolicitudes();
  const { can } = usePermission();
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const solicitudesFiltradas = filtroEstado === 'todos'
    ? solicitudes
    : solicitudes.filter(s => s.estado === filtroEstado);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Movimientos y Solicitudes</h1>
        <p className="text-gray-600">
          {can('canApproveSolicitud')
            ? 'Gestiona las solicitudes de materiales de los padres'
            : 'Visualiza el estado de tus solicitudes de materiales'}
        </p>
      </div>

      {/* Filtros de Estado */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { value: 'todos', label: 'Todos', color: 'gray' },
          { value: 'solicitado', label: 'Solicitado', color: 'yellow' },
          { value: 'aprobado', label: 'Aprobado', color: 'blue' },
          { value: 'en_uso', label: 'En Uso', color: 'purple' },
          { value: 'devuelto', label: 'Devuelto', color: 'orange' },
          { value: 'confirmado', label: 'Confirmado', color: 'green' },
          { value: 'rechazado', label: 'Rechazado', color: 'red' },
        ].map(({ value, label, color }) => (
          <button
            key={value}
            onClick={() => setFiltroEstado(value)}
            className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
              filtroEstado === value
                ? `bg-${color}-500 text-white`
                : `bg-${color}-100 text-${color}-800 hover:bg-${color}-200`
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pearlaqua-300"></div>
            <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error cargando solicitudes</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && solicitudesFiltradas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {filtroEstado === 'todos'
              ? 'No hay solicitudes registradas'
              : `No hay solicitudes con estado "${filtroEstado}"`}
          </p>
        </div>
      )}

      {/* Tabla */}
      {!loading && !error && solicitudesFiltradas.length > 0 && (
        <div className="space-y-4">
          {solicitudesFiltradas.map((solicitud) => (
            <div
              key={solicitud.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Info Básica */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${ESTADO_COLORS[solicitud.estado]}`}>
                      {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1).replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">ID: #{solicitud.id}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase">Padrino</p>
                      <p className="font-semibold text-gray-900">
                        {solicitud.padrino?.nombre || 'Usuario no especificado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase">Items</p>
                      <p className="font-semibold text-gray-900">
                        {solicitud.solicitud_items?.length || 0} artículos
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase">Creado</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(solicitud.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase">Notas</p>
                      <p className="font-semibold text-gray-900">
                        {solicitud.notas || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Items en la solicitud */}
                  {solicitud.solicitud_items && solicitud.solicitud_items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Materiales solicitados:</p>
                      <div className="flex flex-wrap gap-2">
                        {solicitud.solicitud_items.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {item.cantidad || '?'} {item.unidad || 'unid'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <ProtectedAction permission="canApproveSolicitud">
                    {solicitud.estado === 'solicitado' && (
                      <>
                        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition">
                          ✓ Aprobar
                        </button>
                        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition">
                          ✕ Rechazar
                        </button>
                      </>
                    )}
                  </ProtectedAction>
                  {solicitud.estado === 'en_uso' && (
                    <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition">
                      📦 Devolver
                    </button>
                  )}
                  {(solicitud.estado === 'aprobado' || solicitud.estado === 'en_uso' || solicitud.estado === 'devuelto') && (
                    <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-semibold transition">
                      👁️ Ver Detalles
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats footer */}
      {!loading && !error && solicitudes.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold">Total Solicitudes</p>
            <p className="text-2xl font-bold text-blue-900">{solicitudes.length}</p>
          </div>
          <div className="bg-yellow-50 px-4 py-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-600 font-semibold">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-900">
              {solicitudes.filter(s => s.estado === 'solicitado').length}
            </p>
          </div>
          <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-semibold">Aprobadas</p>
            <p className="text-2xl font-bold text-green-900">
              {solicitudes.filter(s => s.estado === 'aprobado').length}
            </p>
          </div>
          <div className="bg-purple-50 px-4 py-3 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-semibold">En Uso</p>
            <p className="text-2xl font-bold text-purple-900">
              {solicitudes.filter(s => s.estado === 'en_uso').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

