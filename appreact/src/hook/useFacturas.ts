// src/hooks/useFacturas.ts
import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export interface Factura {
  id_factura: number;
  id_pedido: number;
  fecha_emision: string;
  subtotal: number;
  impuestos: number;
  total: number;
  metodo_pago: string;
}

export function useFacturas() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<Factura[]>('/api/facturas', { method: 'GET' })
      .then(data => setFacturas(data))
      .catch(err => setError(err.message || 'Error al cargar facturas'))
      .finally(() => setLoading(false));
  }, []);

  return { facturas, loading, error };
}
