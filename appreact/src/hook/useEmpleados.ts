import { useState, useEffect } from 'react';
import { fetchClient } from '../services/fetchClient';
export function useEmpleados () {
    const [empleados, setEmpleados] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError]    = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchClient<any[]>('/api/empleados/', { method: 'GET' })
            .then(data => setEmpleados(data))
            .catch(err => setError(err.message || 'Error al cargar empleados' ))
            .finally(() => setLoading(false));
        }, []);
        return { empleados, loading, error };
    }
    