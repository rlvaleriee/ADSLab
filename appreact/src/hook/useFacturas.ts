// src/hooks/useFacturas.ts
import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export function useFacturas() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<any[]>('/api/facturas', { method: 'GET' })
      .then(data => setFacturas(data))
      .catch(err => setError(err.message || 'Error al cargar facturas'))
      .finally(() => setLoading(false));
  }, []);

  return { facturas, loading, error };
}
