// src/hooks/useCategorias.ts
import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export function useCategorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<any[]>('/api/categorias/', { method: 'GET' }) // Asegúrate que el endpoint sea correcto
      .then(data => setCategorias(data))
      .catch(err => setError(err.message || 'Error al cargar categorías'))
      .finally(() => setLoading(false));
  }, []);

  return { categorias, loading, error };
}
