import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export function useEstados() {
  const [estados, setEstados] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<any[]>('/api/estados/', { method: 'GET' })
      .then(data => setEstados(data))
      .catch(err => setError(err.message || 'Error al cargar estados'))
      .finally(() => setLoading(false));
  }, []);

  return { estados, loading, error };
}
