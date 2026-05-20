import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useMateriales() {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMateriales();
  }, []);

  async function fetchMateriales() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('materiales')
        .select('*')
        .order('nombre');

      if (supabaseError) {
        throw supabaseError;
      }

      setMateriales(data || []);
    } catch (err) {
      console.error('Error fetching materiales:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createMaterial(materialData) {
    try {
      const { data, error: supabaseError } = await supabase
        .from('materiales')
        .insert([materialData])
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      // Actualizar estado local
      setMateriales([...materiales, ...data]);
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error creating material:', err);
      return { success: false, error: err.message };
    }
  }

  async function updateMaterial(id, materialData) {
    try {
      const { data, error: supabaseError } = await supabase
        .from('materiales')
        .update(materialData)
        .eq('id', id)
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      // Actualizar estado local
      setMateriales(
        materiales.map(m => m.id === id ? data[0] : m)
      );
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error updating material:', err);
      return { success: false, error: err.message };
    }
  }

  async function deleteMaterial(id) {
    try {
      // Verificar si tiene movimientos activos
      const { data: movimientos, error: checkError } = await supabase
        .from('solicitud_items')
        .select('id')
        .eq('material_id', id)
        .limit(1);

      if (checkError) {
        throw checkError;
      }

      if (movimientos && movimientos.length > 0) {
        return { 
          success: false, 
          error: 'No se puede eliminar este material. Tiene movimientos activos pendientes.' 
        };
      }

      const { error: supabaseError } = await supabase
        .from('materiales')
        .delete()
        .eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }

      // Actualizar estado local
      setMateriales(materiales.filter(m => m.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting material:', err);
      return { success: false, error: err.message };
    }
  }

  return { 
    materiales, 
    loading, 
    error, 
    refetch: fetchMateriales,
    createMaterial,
    updateMaterial,
    deleteMaterial,
  };
}
