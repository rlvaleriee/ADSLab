import { useState, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { FaSignOutAlt, FaTruck, FaFileInvoice, FaBox } from "react-icons/fa";
import { useClientes } from '../../hook/useClientes';
import { useFacturas } from '../../hook/useFacturas';
import { usePedidos } from '../../hook/usePedidos';
import { useProductos } from '../../hook/useProductos';
import { useRepartidores } from '../../hook/useRepartidores';
import ReactPaginate from 'react-paginate';
import Sidebar from './Sidebar'; // Importa el Sidebar

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [view, setView] = useState<'dashboard' | 'clientes' | 'pedidos' | 'productos' | 'facturas' | 'repartidores'>('dashboard');

  // Hooks para los datos
  const { clientes, loading: loadingClientes } = useClientes();
  const { facturas, loading: loadingFacturas } = useFacturas();
  const { pedidos, loading: loadingPedidos } = usePedidos();
  const { productos, loading: loadingProductos } = useProductos();
  const { repartidores, loading: loadingRepartidores } = useRepartidores();

  // Paginación para los clientes
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const currentClients = clientes.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Función para truncar textos largos
  const truncateText = (text: string, length: number = 20) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-grow-1 p-4">
        {/* Encabezado */}
        <header className="d-flex justify-content-between align-items-center bg-white shadow-sm p-3 sticky-top">
          <h1 className="h4 fw-bold mb-0">Dashboard</h1>
          {user && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-secondary">{user.name}</span>
              <img
                src={user.picture}
                alt="Avatar"
                className="rounded-circle"
                width="40"
                height="40"
              />
              <button
                onClick={logout}
                className="btn btn-outline-danger btn-sm"
                title="Cerrar sesión"
              >
                <FaSignOutAlt />
              </button>
            </div>
          )}
        </header>

        {/* Contenido */}
        <main className="mt-4">
          {view === 'dashboard' && (
            <>
              {(loadingClientes || loadingFacturas || loadingPedidos || loadingProductos || loadingRepartidores) ? (
                <div className="text-center text-muted">Cargando datos ...</div>
              ) : (
                <div className="row g-4">
                  {/* Card: Total Repartidores */}
                  <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                      <div className="card-body d-flex align-items-center">
                        <FaTruck className="fs-2 text-success me-3" />
                        <div>
                          <p className="mb-1 text-muted">Total de Repartidores</p>
                          <h5 className="mb-0">{repartidores?.length ?? 0}</h5>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card: Total Facturas */}
                  <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                      <div className="card-body d-flex align-items-center">
                        <FaFileInvoice className="fs-2 text-warning me-3" />
                        <div>
                          <p className="mb-1 text-muted">Total de Facturas</p>
                          <h5 className="mb-0">{facturas?.length ?? 0}</h5>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card: Total Pedidos */}
                  <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                      <div className="card-body d-flex align-items-center">
                        <FaBox className="fs-2 text-primary me-3" />
                        <div>
                          <p className="mb-1 text-muted">Total de Pedidos</p>
                          <h5 className="mb-0">{pedidos?.length ?? 0}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Últimos registros */}
              <div className="row mt-4 g-4">
                {/* Últimos Pedidos */}
                <div className="col-md-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title">Últimos Pedidos</h5>
                      <ul className="list-group list-group-flush">
                        {pedidos?.slice(0, 5).map((p) => (
                          <li key={p.id_pedido ?? `pedido-${Math.random()}`} className="list-group-item">
                            {`Pedido #${truncateText(p.id_pedido)} - ${truncateText(p.direccion, 30)}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Últimos Productos */}
                <div className="col-md-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title">Últimos Productos</h5>
                      <ul className="list-group list-group-flush">
                        {productos?.slice(0, 5).map((pr) => (
                          <li key={pr.id_producto ?? `producto-${Math.random()}`} className="list-group-item">
                            {pr.nombre_producto}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Últimas Facturas */}
                <div className="col-md-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title">Últimas Facturas</h5>
                      <ul className="list-group list-group-flush">
                        {facturas?.slice(0, 5).map((f) => (
                          <li key={f.id_factura ?? `factura-${Math.random()}`} className="list-group-item">
                            {`Factura #${truncateText(f.id_factura)} - ${f.total} USD`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paginación para los clientes */}
              <div className="mt-4">
                <ReactPaginate
                  previousLabel={"← Anterior"}
                  nextLabel={"Siguiente →"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(clientes.length / itemsPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
