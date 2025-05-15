import { useState, useEffect } from 'react';

interface Empleado {
  id_empleado: number;
  dui: string;
  isss: string;
  Nombres: string;
  Apellidos: string;
  fechaNacimiento: string; // antes: 'Fecha de Nacimiento'
  Telefono: string;
  Correo: string;
  id_cargo: number;
}

interface EmpleadosProps {
  empleados: Empleado[];
  loading: boolean;
  error: string | null;
}

export default function Empleados({ empleados, loading, error }: EmpleadosProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = empleados.filter(e =>
    `${e.Nombres} ${e.Apellidos}`.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reinicia a la primera página si cambia la búsqueda o el tamaño de página
  }, [searchTerm, itemsPerPage]);

  if (loading) return <p className="p-6 text-center">Cargando empleados...</p>;
  if (error) return <p className="p-6 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Lista de Empleados</h2>

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
            <th className="border p-2">DUI</th>
            <th className="border p-2">Correo</th>
            <th className="border p-2">Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map(emp => (
            <tr key={emp.id_empleado}>
              <td className="border p-2">{emp.id_empleado}</td>
              <td className="border p-2">{emp.Nombres} {emp.Apellidos}</td>
              <td className="border p-2">{emp.dui}</td>
              <td className="border p-2">{emp.Correo}</td>
              <td className="border p-2">{emp.Telefono}</td>
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
