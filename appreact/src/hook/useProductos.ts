// src/hooks/useProductos.ts
import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export function useProductos() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<any[]>('/api/productos', { method: 'GET' })
      .then(data => setProductos(data))
      .catch(err => setError(err.message || 'Error al cargar productos'))
      .finally(() => setLoading(false));
  }, []);

  return { productos, loading, error };
}
