import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useMateriales } from '../hooks/useMateriales';
import { usePermission } from '../hooks/usePermission';
import ProtectedAction from '../components/ProtectedAction';
import MaterialForm from '../components/MaterialForm';

export default function InventarioPage() {
  const { profile } = useOutletContext();
  const { materiales, loading, error, createMaterial, updateMaterial, deleteMaterial } = useMateriales();
  const { can } = usePermission();

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const filteredMateriales = materiales.filter(material =>
    material.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (material = null) => {
    setEditingMaterial(material);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMaterial(null);
  };

  const handleSubmitForm = async (formData) => {
    setFormLoading(true);
    try {
      let result;
      if (editingMaterial) {
        result = await updateMaterial(editingMaterial.id, formData);
      } else {
        result = await createMaterial({
          ...formData,
          cantidad_disponible: formData.cantidad_total,
        });
      }

      if (result.success) {
        setSuccessMessage(
          editingMaterial 
            ? 'Material actualizado correctamente' 
            : 'Material creado correctamente'
        );
        handleCloseForm();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(`Error: ${result.error}`);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteMaterial(id);
    if (result.success) {
      setSuccessMessage('Material eliminado correctamente');
      setDeleteConfirm(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      alert(`Error: ${result.error}`);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventario de Materiales</h1>
          <p className="text-gray-600">Vista general de todos los materiales disponibles</p>
        </div>
        <ProtectedAction permission="canCreateMaterial">
          <button
            onClick={() => handleOpenForm()}
            className="px-6 py-2 bg-tangerinedream-300 text-midnightviolet-300 font-semibold rounded-lg hover:bg-tangerinedream-400 transition"
          >
            + Agregar Material
          </button>
        </ProtectedAction>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="mb-4 px-4 py-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          ✓ {successMessage}
        </div>
      )}

      {/* Búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pearlaqua-300 focus:border-transparent"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pearlaqua-300"></div>
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
            <thead className="bg-linear-to-r from-pearlaqua-300 to-teagreen-300 text-midnightviolet-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Descripción</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Cantidad Total</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Disponible</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Unidad</th>
                <ProtectedAction permission="canEditMaterial">
                  <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
                </ProtectedAction>
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
                    {material.unidad || '-'}
                  </td>
                  <ProtectedAction permission="canEditMaterial">
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleOpenForm(material)}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold hover:bg-blue-200 transition"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(material.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-semibold hover:bg-red-200 transition"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </ProtectedAction>
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
              {filteredMateriales.reduce((sum, m) => sum + (m.cantidad_disponible || 0), 0)}
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

      {/* Material Form Modal */}
      {showForm && (
        <MaterialForm
          material={editingMaterial}
          onSubmit={handleSubmitForm}
          onClose={handleCloseForm}
          loading={formLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Eliminar Material</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
