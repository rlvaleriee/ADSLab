import React, { useState } from 'react';
import Sidebar from './page/main/Sidebar';// Asegúrate de que la ruta sea la correcta
import Facturas from './page/main/Facturas';// Ajusta según el nombre de tus componentes
import Clientes from './page/main/Clientes';
import Pedidos from './page/main/Pedidos';
import Productos from './page/main/Productos';
import Repartidores from './page/main/Repartidores';
import Categorias from './page/main/Categorias';
import { useFacturas } from './hook/useFacturas';// Si es necesario usar hook para obtener las facturas

const App: React.FC = () => {
  // Estado para manejar la vista activa
  const [view, setView] = useState<'dashboard' | 'clientes' | 'pedidos' | 'productos' | 'facturas' | 'repartidores' | 'entregas' | 'categorias'>('dashboard');

  // Puedes traer las facturas u otros datos necesarios
  const { facturas, loading, error } = useFacturas(); // Solo si estás usando un hook para obtener facturas

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar setView={setView} />
      
      {/* Contenido principal */}
      <div className="flex-grow-1 p-4">
        {view === 'facturas' && <Facturas facturas={facturas} loading={loading} error={error} />}
        {view === 'clientes' && <Clientes clientes={[]} loading={false} error={null} />}
        {view === 'pedidos' && <Pedidos pedidos={[]} loading={false} error={null} />}
        {view === 'productos' && <Productos productos={[]} loading={false} error={null} />}
        {view === 'repartidores' && <Repartidores repartidores={[]} loading={false} error={null} />}
        {view === 'categorias' && <Categorias categorias={[]} loading={false} error={null} />}
        {/* Agrega aquí más vistas según sea necesario */}
      </div>
    </div>
  );
};

export default App;
