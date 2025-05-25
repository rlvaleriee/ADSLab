import React, { useState } from 'react';
import Sidebar from './page/main/Sidebar';// Asegúrate de que la ruta sea la correcta
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App: React.FC = () => {
  // Estado para manejar la vista activa
 const [, setView] = useState<'dashboard' | 'clientes' | 'pedidos' | 'productos' | 'facturas' | 'repartidores' | 'categorias' | 'entregas' |'comentarios' |'telefonos' |'notificaciones' |'estados'>('dashboard');

  

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar setView={setView} />
      
      {/* Contenido principal */}
      <div className="flex-grow-1 p-4">
        
        {/* Agrega aquí más vistas según sea necesario */}
      </div>
    </div>
  );
};

export default App;
