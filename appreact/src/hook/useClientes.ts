import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';

export async function obtenerClientes() {
  try {
    const response = await fetchClient<any[]>('/api/clientes/', { method: 'GET' });
    return response;
  } catch (err: unknown) {
    
    if (err instanceof Error) {
      throw new Error(err.message || 'Error al cargar clientes');
    } else {
      
      throw new Error('Error desconocido al cargar clientes');
    }
  }
}


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
