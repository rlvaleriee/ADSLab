import { useState, useEffect } from "react";
import { fetchClient } from "../../services/fetchClient";
import { Comentario } from "../../interfaces/IComentarios";
import { Cliente } from "../../interfaces/ICliente";
import { Pedido } from "../../interfaces/IPedidos";
import { DataTable } from "./DataTable";

export function Comentarios() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comentariosData, clientesData, pedidosData] = await Promise.all([
          fetchClient<Comentario[]>("/api/comentarios"),
          fetchClient<Cliente[]>("/api/clientes"),
          fetchClient<Pedido[]>("/api/pedidos"),
        ]);
        setComentarios(comentariosData);
        setClientes(clientesData);
        setPedidos(pedidosData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  const getClienteNombre = (id: number): string => {
    return clientes.find(c => c.id_cliente === id)?.nombre_cliente ?? "Cliente no encontrado";
  };

  const getPedidoDescripcion = (id: number): string => {
    return pedidos.find(p => p.id_pedido === id)?.direccion ?? "Pedido no encontrado";
  };

  return (
    <div>
      <h2 className="mt-4">Lista de Comentarios</h2>

      <DataTable<Comentario>
        data={comentarios}
        columns={[
          {
            key: "id_pedido",
            label: "Pedido",
            render: (comentario) => getPedidoDescripcion(comentario.id_pedido),
          },
          {
            key: "id_cliente",
            label: "Cliente",
            render: (comentario) => getClienteNombre(comentario.id_cliente),
          },
          { key: "texto", label: "Comentario" },
          { key: "fecha", label: "Fecha" },
          { key: "calificacion", label: "Calificación" },
        ]}
        searchKeys={["texto", "id_cliente", "id_pedido", "fecha", "calificacion"]}
      />
    </div>
  );
}
