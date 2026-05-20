import React, { useState } from 'react';

export default function MaterialForm({ material, onSubmit, onClose, loading = false }) {
  const [formData, setFormData] = useState({
    nombre: material?.nombre || '',
    descripcion: material?.descripcion || '',
    cantidad_total: material?.cantidad_total || '',
    unidad: material?.unidad || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad_total' ? Number(value) : value,
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.unidad || !formData.unidad.trim()) {
      newErrors.unidad = 'La unidad es requerida';
    }
    if (!formData.cantidad_total || formData.cantidad_total < 0) {
      newErrors.cantidad_total = 'Cantidad válida requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {material ? 'Editar Material' : 'Agregar Material'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre del Material *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Laptop, Monitor, Cable HDMI"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.nombre
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-pearlaqua-300'
              }`}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Detalles adicionales del material..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pearlaqua-300"
            />
          </div>

          {/* Cantidad Total */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Cantidad Total *
            </label>
            <input
              type="number"
              name="cantidad_total"
              value={formData.cantidad_total}
              onChange={handleChange}
              placeholder="Ej: 10"
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.cantidad_total
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-pearlaqua-300'
              }`}
            />
            {errors.cantidad_total && (
              <p className="mt-1 text-sm text-red-600">{errors.cantidad_total}</p>
            )}
          </div>

          {/* Unidad */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Unidad *
            </label>
            <input
              type="text"
              name="unidad"
              value={formData.unidad}
              onChange={handleChange}
              placeholder="Ej: unidad, pieza, caja"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.unidad
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-pearlaqua-300'
              }`}
            />
            {errors.unidad && (
              <p className="mt-1 text-sm text-red-600">{errors.unidad}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-tangerinedream-300 text-midnightviolet-300 font-semibold rounded-lg hover:bg-tangerinedream-400 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
