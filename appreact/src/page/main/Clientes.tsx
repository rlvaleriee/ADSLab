import { useState, useEffect } from 'react';

interface Cliente {
  id_cliente: number;
  nombre_cliente: string;
  telefono: string;
  fecha_registro: string;
}

interface ClientesProps {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
}

export default function Clientes({ clientes, loading, error }: ClientesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = clientes.filter(c =>
    c.nombre_cliente.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  if (loading) return <p className="p-6 text-center">Cargando clientes...</p>;
  if (error) return <p className="p-6 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Lista de Clientes</h2>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map(cliente => (
            <tr key={cliente.id_cliente}>
              <td className="border p-2">{cliente.id_cliente}</td>
              <td className="border p-2">{cliente.nombre_cliente}</td>
              <td className="border p-2">{cliente.telefono}</td>
              <td className="border p-2">{cliente.fecha_registro}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
        <div>
          <label className="mr-2">Items por página:</label>
          <select
            value={itemsPerPage}
            onChange={e => setItemsPerPage(Number(e.target.value))}
            className="p-1 border rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
