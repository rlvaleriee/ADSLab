// src/hooks/useProductos.ts
import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export interface Producto {
  id_producto: number;
  id_categoria: number;
  nombre_producto: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
}

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClient<Producto[]>('/api/productos', { method: 'GET' })
      .then(data => setProductos(data))
      .catch(err => setError(err.message || 'Error al cargar productos'))
      .finally(() => setLoading(false));
  }, []);

  return { productos, loading, error };
}
