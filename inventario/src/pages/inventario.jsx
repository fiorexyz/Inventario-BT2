import { useState } from 'react';
import { useMateriales } from '../hooks/useMateriales';

export default function Inventario() {
  const { materiales, loading, error } = useMateriales();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMateriales = materiales.filter(material =>
    material.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventario de Materiales</h1>
        <p className="text-gray-600">Vista general de todos los materiales disponibles</p>
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            <p className="mt-4 text-gray-600">Cargando materiales...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error cargando materiales</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredMateriales.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No se encontraron materiales con ese término' : 'No hay materiales registrados'}
          </p>
        </div>
      )}

      {/* Tabla de materiales */}
      {!loading && !error && filteredMateriales.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full bg-white">
            <thead className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Descripción</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Cantidad Total</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Disponible</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Unidad</th>
              </tr>
            </thead>
            <tbody>
              {filteredMateriales.map((material, index) => (
                <tr
                  key={material.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">{material.nombre}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm max-w-xs truncate">
                    {material.descripcion || '-'}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    <span className="font-semibold">{material.cantidad_total}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        material.cantidad_disponible > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {material.cantidad_disponible}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700 text-sm">
                    {material.unidad_medida || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats footer */}
      {!loading && !error && filteredMateriales.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold">Total Materiales</p>
            <p className="text-2xl font-bold text-blue-900">{filteredMateriales.length}</p>
          </div>
          <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-semibold">Items Disponibles</p>
            <p className="text-2xl font-bold text-green-900">
              {filteredMateriales.reduce((sum, m) => sum + m.cantidad_disponible, 0)}
            </p>
          </div>
          <div className="bg-purple-50 px-4 py-3 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-semibold">Total en Bodega</p>
            <p className="text-2xl font-bold text-purple-900">
              {filteredMateriales.reduce((sum, m) => sum + m.cantidad_total, 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

