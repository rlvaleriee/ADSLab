import { useState, useEffect } from "react";
import { fetchClient } from "../../services/fetchClient";
import { Entrega } from "../../interfaces/IEntregas";
import { Pedido } from "../../interfaces/IPedidos";
import { Button } from "reactstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { DataTable } from "./DataTable";
import { EntregaModal } from "./EntregaModal";
import Swal from "sweetalert2";

export function Entregas() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [entregaSeleccionada, setEntregaSeleccionada] = useState<Entrega | undefined>(undefined);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setEntregaSeleccionada(undefined);
  };

  const obtenerEntregas = async () => {
    try {
      const data = await fetchClient<Entrega[]>("/api/entregas");
      setEntregas(data);
    } catch (error) {
      console.error("Error al obtener entregas:", error);
    }
  };

  const obtenerPedidos = async () => {
    try {
      const data = await fetchClient<Pedido[]>("/api/pedidos");
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  useEffect(() => {
    obtenerEntregas();
    obtenerPedidos();
  }, []);

  const handleNuevo = () => {
    setEntregaSeleccionada(undefined);
    setModalOpen(true);
  };

  const handleEditar = (entrega: Entrega) => {
    setEntregaSeleccionada(entrega);
    setModalOpen(true);
  };

  const handleEliminar = async (entrega: Entrega) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar la entrega del pedido #${entrega.id_pedido}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await fetchClient(`/api/entregas/delete/${entrega.id_entrega}`, {
          method: "DELETE",
        });

        setEntregas((prev) =>
          prev.filter((e) => e.id_entrega !== entrega.id_entrega)
        );

        Swal.fire("Eliminado", "La entrega fue eliminada correctamente", "success");
      } catch (error: any) {
        Swal.fire("Error", error.message || "No se pudo eliminar la entrega", "error");
      }
    }
  };

  const getDireccionPedido = (idPedido: number) => {
    return pedidos.find(p => p.id_pedido === idPedido)?.direccion ?? "Dirección no encontrada";
  };

  return (
    <div>
      <h2 className="mt-4">Lista de Entregas</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button color="primary" onClick={handleNuevo}>
          Nueva Entrega
        </Button>
      </div>

      <DataTable<Entrega>
        data={entregas}
        columns={[
  {
    key: "id_pedido",
    label: "Dirección del Pedido",
    render: (entrega) => getDireccionPedido(entrega.id_pedido), // ✅
  },
  {
    key: "fecha_entrega",
    label: "Fecha de Entrega",
  },
  {
    key: "acciones",
    label: "Acciones",
    render: (entrega: Entrega) => (
      <div className="d-flex justify-content-center gap-2">
        <Button
          color="primary"
          size="sm"
          onClick={() => handleEditar(entrega)}
        >
          <FaEdit />
        </Button>
        <Button
          color="danger"
          size="sm"
          onClick={() => handleEliminar(entrega)}
        >
          <FaTrashAlt />
        </Button>
      </div>
    ),
  },
]}

        searchKeys={["fecha_entrega"]}
      />

      <EntregaModal
        isOpen={modalOpen}
        toggle={toggleModal}
        entrega={entregaSeleccionada}
        pedidos={pedidos}
        onSuccess={obtenerEntregas}
      />
    </div>
  );
}
