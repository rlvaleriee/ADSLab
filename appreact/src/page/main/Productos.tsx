// src/components/Productos.tsx
import { useState, useEffect } from 'react';
import { Producto } from '../../hook/useProductos';
interface ProductosProps {
  productos: Producto[];
  loading: boolean;
  error: string | null;
}

export default function Productos({ productos, loading, error }: ProductosProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
    p.descripcion.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  if (loading) return <p className="p-6 text-center">Cargando productos...</p>;
  if (error) return <p className="p-6 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o descripción..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID Producto</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Disponible</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map(producto => (
            <tr key={producto.id_producto}>
              <td className="border p-2">{producto.id_producto}</td>
              <td className="border p-2">{producto.nombre_producto}</td>
              <td className="border p-2">{producto.descripcion}</td>
              <td className="border p-2">{producto.precio}</td>
              <td className="border p-2">{producto.disponible ? 'Sí' : 'No'}</td>
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
