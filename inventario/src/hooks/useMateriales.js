import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

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

  return { materiales, loading, error, refetch: fetchMateriales };
}
