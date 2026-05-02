import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalMateriales: 0,
    materialesDisponibles: 0,
    solicitudesActivas: 0,
    itemsEnUso: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      setError(null);

      // Contar materiales
      const { data: materiales, error: matError } = await supabase
        .from('materiales')
        .select('*');

      if (matError) throw matError;

      // Contar solicitudes activas
      const { data: solicitudes, error: solError } = await supabase
        .from('solicitudes')
        .select('estado')
        .in('estado', ['solicitado', 'aprobado', 'en_uso']);

      if (solError) throw solError;

      setStats({
        totalMateriales: materiales?.length || 0,
        materialesDisponibles: materiales?.filter(m => m.cantidad_disponible > 0).length || 0,
        solicitudesActivas: solicitudes?.length || 0,
        itemsEnUso: solicitudes?.filter(s => s.estado === 'en_uso').length || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { stats, loading, error, refetch: fetchStats };
}
