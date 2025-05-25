import { JSX, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { FaSignOutAlt, FaTruck, FaFileInvoice, FaBox } from "react-icons/fa";

// Hooks de datos
import { useProductos } from '../../hook/useProductos';
import { useFacturas } from '../../hook/useFacturas';
import { usePedidos } from '../../hook/usePedidos';
import { useRepartidores } from '../../hook/useRepartidores';

// Función auxiliar
const truncateText = (text: string, length: number = 20) =>
  text.length > length ? text.substring(0, length) + '...' : text;

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const { productos, loading: loadingProductos } = useProductos();
  const { facturas, loading: loadingFacturas } = useFacturas();
  const { pedidos, loading: loadingPedidos } = usePedidos();
  const { repartidores, loading: loadingRepartidores } = useRepartidores();

  const isLoading = loadingProductos || loadingFacturas || loadingPedidos || loadingRepartidores;

  return (
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

      <main className="mt-4">
        {isLoading ? (
          <div className="text-center text-muted">Cargando datos...</div>
        ) : (
          <>
            {/* Resumen de totales */}
            <div className="row g-4">
              <DashboardCard
                icon={<FaTruck className="fs-2 text-success me-3" />}
                title="Total de Repartidores"
                count={repartidores.length}
              />
              <DashboardCard
                icon={<FaFileInvoice className="fs-2 text-warning me-3" />}
                title="Total de Facturas"
                count={facturas.length}
              />
              <DashboardCard
                icon={<FaBox className="fs-2 text-primary me-3" />}
                title="Total de Pedidos"
                count={pedidos.length}
              />
            </div>

            {/* Listas recientes */}
            <div className="row mt-4 g-4">
              <RecentList
                title="Últimos Pedidos"
                items={pedidos.slice(0, 5).map(p => ({
                  key: p.id_pedido,
                  label: `Pedido #${truncateText(p.id_pedido.toString())} - ${truncateText(p.direccion, 30)}`
                }))}
              />
              <RecentList
                title="Últimos Productos"
                items={productos.slice(0, 5).map(p => ({
                  key: p.id_producto,
                  label: p.nombre_producto
                }))}
              />
              <RecentList
                title="Últimas Facturas"
                items={facturas.slice(0, 5).map(f => ({
                  key: f.id_factura,
                  label: `Factura #${truncateText(f.id_factura.toString())} - ${f.total} USD`
                }))}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// Subcomponente: Tarjeta de resumen
function DashboardCard({ icon, title, count }: { icon: JSX.Element, title: string, count: number }) {
  return (
    <div className="col-md-4">
      <div className="card shadow-sm h-100">
        <div className="card-body d-flex align-items-center">
          {icon}
          <div>
            <p className="mb-1 text-muted">{title}</p>
            <h5 className="mb-0">{count}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponente: Lista de elementos recientes
function RecentList({
  title,
  items,
}: {
  title: string;
  items: { key: number | string; label: string }[];
}) {
  return (
    <div className="col-md-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <ul className="list-group list-group-flush">
            {items.length === 0 ? (
              <li className="list-group-item text-muted">No hay registros</li>
            ) : (
              items.map(item => (
                <li key={item.key} className="list-group-item">
                  {item.label}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
