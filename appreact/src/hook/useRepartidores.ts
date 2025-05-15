// src/hooks/useRepartidores.ts
import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export interface Repartidor {
  id_repartidor: number;
  nombre_repartidor: string;
  telefono: string;
  dui: string;
  activo: boolean;
}

export function useRepartidores() {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<Repartidor[]>('/api/repartidores', { method: 'GET' })
      .then(data => setRepartidores(data))
      .catch(err => setError(err.message || 'Error al cargar repartidores'))
      .finally(() => setLoading(false));
  }, []);

  return { repartidores, loading, error };
}
