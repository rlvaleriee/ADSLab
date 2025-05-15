import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

// Definir el tipo de datos para pedidos
interface Pedido {
  id_pedido: number;
  id_cliente: number;
  fecha_pedido: string;
  id_estado: number;
  id_repartidor: number;
  direccion: string;
}

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<Pedido[]>('/api/pedidos/', { method: 'GET' }) // Ajusta el endpoint según sea necesario
      .then(data => setPedidos(data))
      .catch(err => setError(err.message || 'Error al cargar pedidos'))
      .finally(() => setLoading(false));
  }, []);

  return { pedidos, loading, error };
}
