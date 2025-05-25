import { useState, useEffect } from "react";
import { fetchClient } from "../../services/fetchClient";
import { Pedido } from "../../interfaces/IPedidos";
import { Cliente } from "../../interfaces/ICliente";
import { Estado } from "../../interfaces/IEstados";
import { Repartidor } from "../../interfaces/IRepartidores";
import { Button } from "reactstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { DataTable } from "./DataTable";
import { PedidoModal } from "./PedidoModal";
import Swal from "sweetalert2";

export function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | undefined>(undefined);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setPedidoSeleccionado(undefined);
  };

  const obtenerPedidos = async () => {
    try {
      const data = await fetchClient<Pedido[]>("/api/pedidos");
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  const obtenerClientes = async () => {
    try {
      const data = await fetchClient<Cliente[]>("/api/clientes");
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const obtenerEstados = async () => {
    try {
      const data = await fetchClient<Estado[]>("/api/estados");
      setEstados(data);
    } catch (error) {
      console.error("Error al obtener estados:", error);
    }
  };

  const obtenerRepartidores = async () => {
    try {
      const data = await fetchClient<Repartidor[]>("/api/repartidores");
      setRepartidores(data);
    } catch (error) {
      console.error("Error al obtener repartidores:", error);
    }
  };

  useEffect(() => {
    obtenerPedidos();
    obtenerClientes();
    obtenerEstados();
    obtenerRepartidores();
  }, []);

  const handleNuevo = () => {
    setPedidoSeleccionado(undefined);
    setModalOpen(true);
  };

  const handleEditar = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setModalOpen(true);
  };

  const handleEliminar = async (pedido: Pedido) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar el pedido #${pedido.id_pedido}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await fetchClient(`/api/pedidos/delete/${pedido.id_pedido}`, {
          method: "DELETE",
        });

        setPedidos((prev) =>
          prev.filter((p) => p.id_pedido !== pedido.id_pedido)
        );

        Swal.fire("Eliminado", "El pedido fue eliminado correctamente", "success");
      } catch (error: any) {
        Swal.fire("Error", error.message || "No se pudo eliminar el pedido", "error");
      }
    }
  };

  const getClienteNombre = (id: number) =>
    clientes.find(c => c.id_cliente === id)?.nombre_cliente ?? "Cliente no encontrado";

  const getEstadoNombre = (id: number) =>
    estados.find(e => e.id_estado === id)?.nombre_estado ?? "Estado no encontrado";

  const getRepartidorNombre = (id: number) =>
    repartidores.find(r => r.id_repartidor === id)?.nombre_repartidor ?? "Repartidor no encontrado";

  return (
    <div>
      <h2 className="mt-4">Lista de Pedidos</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button color="primary" onClick={handleNuevo}>
          Nuevo Pedido
        </Button>
      </div>

      <DataTable<Pedido>
        data={pedidos}
        columns={[
          { key: "id_pedido", label: "ID Pedido" },
          {
            key: "id_cliente",
            label: "Cliente",
            render: (item) => getClienteNombre(item.id_cliente),
          },
          { key: "fecha_pedido", label: "Fecha de Pedido" },
          {
            key: "id_estado",
            label: "Estado",
            render: (item) => getEstadoNombre(item.id_estado),
          },
          {
            key: "id_repartidor",
            label: "Repartidor",
            render: (item) => getRepartidorNombre(item.id_repartidor),
          },
          { key: "direccion", label: "Dirección" },
          {
            key: "acciones",
            label: "Acciones",
            render: (pedido: Pedido) => (
              <div className="d-flex justify-content-center gap-2">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => handleEditar(pedido)}
                >
                  <FaEdit />
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleEliminar(pedido)}
                >
                  <FaTrashAlt />
                </Button>
              </div>
            ),
          },
        ]}
        searchKeys={["id_pedido", "id_cliente", "id_estado", "id_repartidor"]}
      />

      <PedidoModal
        isOpen={modalOpen}
        toggle={toggleModal}
        pedido={pedidoSeleccionado}
        clientes={clientes}
        estados={estados}
        repartidores={repartidores}
        onSuccess={obtenerPedidos}
      />
    </div>
  );
}
