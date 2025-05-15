// src/hooks/useClientes.ts
import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export function useClientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<any[]>('/api/clientes/', { method: 'GET' }) // Asegúrate que el endpoint sea correcto
      .then(data => setClientes(data))
      .catch(err => setError(err.message || 'Error al cargar clientes'))
      .finally(() => setLoading(false));
  }, []);

  return { clientes, loading, error };
}
