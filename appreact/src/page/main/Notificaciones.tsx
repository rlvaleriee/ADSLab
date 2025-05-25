import { useState, useEffect } from "react";
import { Cliente } from "../../interfaces/ICliente";
import { fetchClient } from "../../services/fetchClient";
import { NotificacionForm } from "./NotificacionForm";

export function Notificaciones() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const obtenerClientes = async () => {
    try {
      const data = await fetchClient<Cliente[]>("/api/clientes");
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Enviar Notificación por WhatsApp</h2>
      <NotificacionForm clientes={clientes} onSuccess={() => obtenerClientes()} />
    </div>
  );
}
