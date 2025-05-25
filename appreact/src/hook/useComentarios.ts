import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export function useComentarios() {
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<any[]>('/api/comentarios/', { method: 'GET' })
      .then(data => setComentarios(data))
      .catch(err => setError(err.message || 'Error al cargar comentarios'))
      .finally(() => setLoading(false));
  }, []);

  return { comentarios, loading, error };
}
