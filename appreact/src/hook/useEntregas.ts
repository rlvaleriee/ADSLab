// src/hooks/useEntregas.ts
import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export function useEntregas() {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<any[]>('/api/entregas/', { method: 'GET' }) // Asegúrate que el endpoint sea correcto
      .then(data => setEntregas(data))
      .catch(err => setError(err.message || 'Error al cargar entregas'))
      .finally(() => setLoading(false));
  }, []);

  return { entregas, loading, error };
}
