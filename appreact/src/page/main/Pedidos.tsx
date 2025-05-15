import { useState, useEffect } from 'react';

interface Pedido {
  id_pedido: number;
  id_cliente: number;
  fecha_pedido: string;
  id_estado: number;
  id_repartidor: number;
  direccion: string;
}

interface PedidosProps {
  pedidos: Pedido[];
  loading: boolean;
  error: string | null;
}

export default function Pedidos({ pedidos, loading, error }: PedidosProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = pedidos.filter(p =>
    p.direccion.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
    p.id_pedido.toString().includes(searchTerm.trim())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  if (loading) return <p className="p-6 text-center">Cargando pedidos...</p>;
  if (error) return <p className="p-6 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Lista de Pedidos</h2>

      <input
        type="text"
        placeholder="Buscar por ID o dirección..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID Pedido</th>
            <th className="border p-2">ID Cliente</th>
            <th className="border p-2">Fecha de Pedido</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Repartidor</th>
            <th className="border p-2">Dirección</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map(pedido => (
            <tr key={pedido.id_pedido}>
              <td className="border p-2">{pedido.id_pedido}</td>
              <td className="border p-2">{pedido.id_cliente}</td>
              <td className="border p-2">{pedido.fecha_pedido}</td>
              <td className="border p-2">{pedido.id_estado}</td>
              <td className="border p-2">{pedido.id_repartidor}</td>
              <td className="border p-2">{pedido.direccion}</td>
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
