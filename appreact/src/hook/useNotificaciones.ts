import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<any[]>('/api/notificaciones/', { method: 'GET' })
      .then(data => setNotificaciones(data))
      .catch(err => setError(err.message || 'Error al cargar notificaciones'))
      .finally(() => setLoading(false));
  }, []);

  return { notificaciones, loading, error };
}
