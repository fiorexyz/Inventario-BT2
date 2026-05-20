import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSolicitudes } from '../hooks/useSolicitudes';
import { usePermission } from '../hooks/usePermission';
import ProtectedAction from '../components/ProtectedAction';

export default function ConfirmacionesPage() {
  const { profile } = useOutletContext();
  const { solicitudes, loading, error } = useSolicitudes();
  const { can } = usePermission();
  const [verifyingId, setVerifyingId] = useState(null);
  const [checklist, setChecklist] = useState({});

  // Filtrar solo solicitudes en estado "devuelto" (pendientes de confirmación)
  const confirmacionesPendientes = solicitudes.filter(s => s.estado === 'devuelto');

  const handleChecklistChange = (itemId, field, value) => {
    setChecklist(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirmaciones de Devolución</h1>
        <p className="text-gray-600">
          {can('canConfirmEntrega')
            ? 'Verifica el estado de los materiales devueltos por los padres'
            : 'Estado de verificación de tus devoluciones'}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            <p className="mt-4 text-gray-600">Cargando confirmaciones pendientes...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error cargando confirmaciones</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && confirmacionesPendientes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {can('canConfirmEntrega')
              ? '✓ No hay devoluciones pendientes de verificar'
              : 'No tienes devoluciones en proceso de verificación'}
          </p>
        </div>
      )}

      {/* Confirmaciones */}
      {!loading && !error && confirmacionesPendientes.length > 0 && (
        <div className="space-y-4">
          {confirmacionesPendientes.map((solicitud) => (
            <div
              key={solicitud.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Solicitud #{solicitud.id}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Solicitante: <span className="font-semibold">{solicitud.padrino?.nombre}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Devuelto: {new Date(solicitud.updated_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
                  Pendiente de Confirmación
                </span>
              </div>

              {/* Items con Checklist */}
              {solicitud.solicitud_items && solicitud.solicitud_items.length > 0 ? (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Materiales Devueltos:</h4>
                  <div className="space-y-3">
                    {solicitud.solicitud_items.map((item, idx) => {
                      const itemKey = `${solicitud.id}-${idx}`;
                      return (
                        <div key={itemKey} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start gap-4">
                            {/* Info del Item */}
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">Artículo {idx + 1}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                Cantidad: <span className="font-semibold">{item.cantidad} {item.unidad}</span>
                              </p>
                            </div>

                            {/* Checklist si es bodeguero */}
                            <ProtectedAction permission="canConfirmEntrega">
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={checklist[itemKey]?.completo || false}
                                    onChange={(e) =>
                                      handleChecklistChange(itemKey, 'completo', e.target.checked)
                                    }
                                    className="w-4 h-4 accent-green-500"
                                  />
                                  <span className="text-sm text-gray-700">Cantidad completa</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={checklist[itemKey]?.intacto || false}
                                    onChange={(e) =>
                                      handleChecklistChange(itemKey, 'intacto', e.target.checked)
                                    }
                                    className="w-4 h-4 accent-green-500"
                                  />
                                  <span className="text-sm text-gray-700">En buen estado</span>
                                </label>
                              </div>
                            </ProtectedAction>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No hay items asociados</p>
              )}

              {/* Notas */}
              <ProtectedAction permission="canConfirmEntrega">
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notas de Verificación
                  </label>
                  <textarea
                    placeholder="Anota cualquier problema o detalle encontrado..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
                    rows="3"
                  />
                </div>
              </ProtectedAction>

              {/* Acciones */}
              <ProtectedAction permission="canConfirmEntrega">
                <div className="mt-6 flex gap-3 justify-end">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition">
                    Guardar Borrador
                  </button>
                  <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition">
                    ✓ Confirmar Devolución
                  </button>
                </div>
              </ProtectedAction>

              <ProtectedAction permission="canConfirmEntrega" fallback={null}>
                <div></div>
              </ProtectedAction>

              {!can('canConfirmEntrega') && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Esperando verificación del bodeguero...
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {!loading && !error && solicitudes.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 px-4 py-3 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-600 font-semibold">Pendientes de Verificar</p>
            <p className="text-2xl font-bold text-orange-900">{confirmacionesPendientes.length}</p>
          </div>
          <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-semibold">Confirmadas</p>
            <p className="text-2xl font-bold text-green-900">
              {solicitudes.filter(s => s.estado === 'confirmado').length}
            </p>
          </div>
          <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold">Total en Proceso</p>
            <p className="text-2xl font-bold text-blue-900">
              {solicitudes.filter(s => ['en_uso', 'devuelto'].includes(s.estado)).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

