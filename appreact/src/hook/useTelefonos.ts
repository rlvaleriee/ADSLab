import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export function useTelefonos() {
  const [telefonos, setTelefonos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<any[]>('/api/telefonos/', { method: 'GET' })
      .then(data => setTelefonos(data))
      .catch(err => setError(err.message || 'Error al cargar teléfonos'))
      .finally(() => setLoading(false));
  }, []);

  return { telefonos, loading, error };
}
