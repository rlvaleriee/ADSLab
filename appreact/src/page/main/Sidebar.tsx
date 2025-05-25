import React from 'react';
import {
  FaBox,
  FaTruck,
  FaUser,
  FaFileInvoice,
  FaClipboardList,
  FaTag,
  FaShoppingBag,
  FaTachometerAlt,
  FaComment,
  FaPhoneAlt,
  FaBell,
  FaCog,
} from 'react-icons/fa';

interface SidebarProps {
  setView: React.Dispatch<React.SetStateAction<'dashboard' | 'clientes' | 'pedidos' | 'productos' | 'facturas' | 'repartidores' | 'categorias' | 'entregas' | 'comentarios' | 'telefonos' | 'notificaciones' | 'estados'>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setView }) => {
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: '190px' }}>
      <h3 className="mb-4 text-nowrap overflow-hidden text-truncate">
        🚛 Menu
      </h3>
      <ul className="nav flex-column">
        {/* Sección de Dashboard */}
        <li className="nav-item mb-2">
          <button className="btn btn-link nav-link text-white text-start" onClick={() => setView('dashboard')}>
            <FaTachometerAlt className="me-2" />
            Dashboard
          </button>
        </li>

        {/* Sección de Clientes */}
        <li className="nav-item mb-2">
          <button className="btn btn-link nav-link text-white text-start" onClick={() => setView('clientes')}>
            <FaUser className="me-2" />
            Clientes
          </button>
        </li>

        {/* Sección de Pedidos */}
        <li className="nav-item mb-2">
          <button className="btn btn-link nav-link text-white text-start" onClick={() => setView('pedidos')}>
            <FaClipboardList className="me-2" />
            Pedidos
          </button>
        </li>

        {/* Sección de Productos */}
        <li className="nav-item mb-2">
          <button className="btn btn-link nav-link text-white text-start" onClick={() => setView('productos')}>
            <FaBox className="me-2" />
            Productos
          </button>
        </li>

        {/* Sección de Facturas */}
        <li className="nav-item mb-2">
          <button className="btn btn-link nav-link text-white text-start" onClick={() => setView('facturas')}>
            <FaFileInvoice className="me-2" />
            Facturas
          </button>
        </li>

        {/* Sección de Repartidores */}
        <li className="nav-item mb-2">
          <button className="btn btn-link nav-link text-white text-start" onClick={() => setView('repartidores')}>
            <FaTruck className="me-2" />
            Repartidores
          </button>
        </li>

        {/* Sección de Categorías */}
        <li className="nav-item mb-2">
          <button className="btn btn-link nav-link text-white text-start" onClick={() => setView('categorias')}>
            <FaTag className="me-2" />
            Categorías
          </button>
        </li>

        {/* Sección de Entregas */}
        <li className="nav-item mb-2">
          <button className="btn btn-link nav-link text-white text-start" onClick={() => setView('entregas')}>
            <FaShoppingBag className="me-2" />
            Entregas
          </button>
        </li>

        {/* Nueva sección para Comentarios */}
        <li className="nav-item mb-2">
          <button className="btn btn-link nav-link text-white text-start" onClick={() => setView('comentarios')}>
            <FaComment className="me-2" />
            Comentarios
          </button>
        </li>

        {/* Nueva sección para Teléfonos */}
        <li className="nav-item mb-2">
          <button className="btn btn-link nav-link text-white text-start" onClick={() => setView('telefonos')}>
            <FaPhoneAlt className="me-2" />
            Teléfonos
          </button>
        </li>

        {/* Nueva sección para Notificaciones */}
        <li className="nav-item mb-2">
          <button className="btn btn-link nav-link text-white text-start" onClick={() => setView('notificaciones')}>
            <FaBell className="me-2" />
            Notificaciones
          </button>
        </li>

        {/* Nueva sección para Estados */}
        <li className="nav-item mb-2">
          <button className="btn btn-link nav-link text-white text-start" onClick={() => setView('estados')}>
            <FaCog className="me-2" />
            Estados
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
