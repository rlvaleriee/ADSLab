// src/hooks/useClientes.ts
import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

// Función para obtener clientes
export async function obtenerClientes() {
  try {
    const response = await fetchClient<any[]>('/api/clientes/', { method: 'GET' });
    return response;
  } catch (err: unknown) {
    // Comprobamos que 'err' sea una instancia de Error antes de acceder a 'message'
    if (err instanceof Error) {
      throw new Error(err.message || 'Error al cargar clientes');
    } else {
      // En caso de que 'err' no sea una instancia de Error, lanzamos un error genérico
      throw new Error('Error desconocido al cargar clientes');
    }
  }
}

// Hook para obtener clientes
export function useClientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await obtenerClientes();
        setClientes(data);
      } catch (err: unknown) {
        // Nuevamente, comprobamos el tipo de error al usarlo
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { clientes, loading, error };
}
