import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export function usePedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<any[]>('/api/pedidos/', { method: 'GET' }) // Ajusta el endpoint según sea necesario
      .then(data => setPedidos(data))
      .catch(err => setError(err.message || 'Error al cargar pedidos'))
      .finally(() => setLoading(false));
  }, []);

  return { pedidos, loading, error };
}
