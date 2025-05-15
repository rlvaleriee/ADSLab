import React from 'react';
import { FaBox, FaTruck, FaUser, FaFileInvoice, FaClipboardList, FaTag } from 'react-icons/fa';

export default function Sidebar({ setView }: { setView: React.Dispatch<React.SetStateAction<'dashboard' | 'clientes' | 'pedidos' | 'productos' | 'facturas' | 'repartidores' | 'entregas' | 'categorias'>> }) {
  return (
    <div className="bg-light p-4" style={{ width: '250px' }}>
      <h3 className="mb-4">Menú</h3>
      <ul className="list-unstyled">
        <li>
          <button className="btn btn-link w-100 text-start" onClick={() => setView('categorias')}>
            <FaTag className="me-2" />
            Categorías
          </button>
        </li>
        <li>
          <button className="btn btn-link w-100 text-start" onClick={() => setView('repartidores')}>
            <FaTruck className="me-2" />
            Repartidores
          </button>
        </li>
        <li>
          <button className="btn btn-link w-100 text-start" onClick={() => setView('entregas')}>
            <FaClipboardList className="me-2" />
            Entregas
          </button>
        </li>
        <li>
          <button className="btn btn-link w-100 text-start" onClick={() => setView('clientes')}>
            <FaUser className="me-2" />
            Clientes
          </button>
        </li>
        <li>
          <button className="btn btn-link w-100 text-start" onClick={() => setView('productos')}>
            <FaBox className="me-2" />
            Productos
          </button>
        </li>
        <li>
          <button className="btn btn-link w-100 text-start" onClick={() => setView('facturas')}>
            <FaFileInvoice className="me-2" />
            Facturas
          </button>
        </li>
        <li>
          <button className="btn btn-link w-100 text-start" onClick={() => setView('pedidos')}>
            <FaClipboardList className="me-2" />
            Pedidos
          </button>
        </li>
      </ul>
    </div>
  );
}
