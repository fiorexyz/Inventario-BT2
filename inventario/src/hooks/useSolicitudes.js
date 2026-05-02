import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

export function useSolicitudes(userId = null) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSolicitudes();
  }, [userId]);

  async function fetchSolicitudes() {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('solicitudes')
        .select(`
          *,
          padrino:padrino_id(nombre, email),
          bodeguero:bodeguero_id(nombre, email),
          solicitud_items(*)
        `)
        .order('created_at', { ascending: false });

      // Si se proporciona userId, filtrar por padrino_id
      if (userId) {
        query = query.eq('padrino_id', userId);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      setSolicitudes(data || []);
    } catch (err) {
      console.error('Error fetching solicitudes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { solicitudes, loading, error, refetch: fetchSolicitudes };
}
