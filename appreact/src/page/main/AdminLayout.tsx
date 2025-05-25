import { useContext, useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import { Clientes } from './Clientes';
import { Categorias } from './Categorias';
import { Entregas } from './Entregas';
import { Estados } from './Estados';
import { Facturas } from './Facturas';
import { Repartidores } from './Repartidores';
import { Pedidos } from './Pedidos';
import { Comentarios } from './Comentarios';
import { Telefonos } from './Telefonos';
import { Productos } from './Productos';
import { Notificaciones } from './Notificaciones';
import { AuthContext } from '../../context/AuthContext';
import { FaSignOutAlt } from "react-icons/fa";

type View =
  | "dashboard"
  | "clientes"
  | "pedidos"
  | "productos"
  | "facturas"
  | "repartidores"
  | "categorias"
  | "entregas"
  | "comentarios"
  | "telefonos"
  | "notificaciones"
  | "estados";

const AdminLayout = () => {
  const [view, setView] = useState<View>('dashboard');
  const { user, logout } = useContext(AuthContext);


  return (
    <div className="d-flex">
      <Sidebar setView={setView} />

      <div className="flex-grow-1 p-4">
        {/* Header */}
        {view !== 'dashboard' && (
          <header className="d-flex justify-content-between align-items-center bg-white shadow-sm p-3 sticky-top">
            <h1 className="h4 fw-bold mb-0">Panel de Administración</h1>
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
        )}

        {/* Contenido dinámico */}
        {view === 'dashboard' && (<Dashboard/>)}
        {view === 'clientes' && (<Clientes/>)}
        {view === 'pedidos' && (<Pedidos/>)}
        {view === 'productos' && (<Productos/>)}
        {view === 'facturas' && (<Facturas/>)}
        {view === 'repartidores' && (<Repartidores/>)}
        {view === 'categorias' && (<Categorias/>)}
        {view === 'entregas' && (<Entregas/>)}
        {view === 'comentarios' && (<Comentarios/>)}
        {view === 'telefonos' && (<Telefonos/>)}
        {view === 'notificaciones' && (<Notificaciones/>)}
        {view === 'estados' && (<Estados/>)}
      </div>
    </div>
  );
};

export default AdminLayout;
