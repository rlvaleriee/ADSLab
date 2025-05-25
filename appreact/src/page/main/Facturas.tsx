import { useState, useEffect } from "react";
import { fetchClient } from "../../services/fetchClient";
import { Factura } from "../../interfaces/IFacturas";
import { Button } from "reactstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { DataTable } from "./DataTable";
import { FacturaModal } from "./FacturaModal";
import Swal from "sweetalert2";
import { Pedido } from "../../interfaces/IPedidos";

export function Facturas() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | undefined>(undefined);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setFacturaSeleccionada(undefined);
  };
  const obtenerPedidos = async () => {
  try {
    const data = await fetchClient<Pedido[]>("/api/pedidos"); // Ajusta el endpoint si es distinto
    setPedidos(data);
  } catch (error) {
    console.error("Error al obtener pedidos", error);
  }
};

  const obtenerFacturas = async () => {
    try {
      const data = await fetchClient<Factura[]>("/api/facturas");
      setFacturas(data);
    } catch (error) {
      console.error("Error al obtener facturas:", error);
    }
  };

  useEffect(() => {
    obtenerFacturas();
    obtenerPedidos();
  }, []);

  const handleNuevo = () => {
    setFacturaSeleccionada(undefined);
    setModalOpen(true);
  };

  const handleEditar = (factura: Factura) => {
    setFacturaSeleccionada(factura);
    setModalOpen(true);
  };

  const handleEliminar = async (factura: Factura) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar la factura #${factura.id_factura}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await fetchClient(`/api/facturas/delete/${factura.id_factura}`, {
          method: "DELETE",
        });

        setFacturas((prev) =>
          prev.filter((f) => f.id_factura !== factura.id_factura)
        );

        Swal.fire("Eliminado", "La factura fue eliminada correctamente", "success");
      } catch (error: any) {
        Swal.fire("Error", error.message || "No se pudo eliminar la factura", "error");
      }
    }
  };

  return (
    <div>
      <h2 className="mt-4">Lista de Facturas</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button color="primary" onClick={handleNuevo}>
          Nueva Factura
        </Button>
      </div>

      <DataTable<Factura>
        data={facturas}
        columns={[
          
          { key: "id_pedido", label: "ID Pedido" },
          { key: "fecha_emision", label: "Fecha de Emisión" },
          { key: "subtotal", label: "Subtotal" },
          { key: "impuestos", label: "Impuestos" },
          { key: "total", label: "Total" },
          { key: "metodo_pago", label: "Método de Pago" },
          {
            key: "acciones",
            label: "Acciones",
            render: (factura: Factura) => (
              <div className="d-flex justify-content-center gap-2">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => handleEditar(factura)}
                >
                  <FaEdit />
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleEliminar(factura)}
                >
                  <FaTrashAlt />
                </Button>
              </div>
            ),
          },
        ]}
        searchKeys={["id_factura", "id_pedido", "metodo_pago"]}
      />

      <FacturaModal
              isOpen={modalOpen}
              toggle={toggleModal}
              factura={facturaSeleccionada}
              onSuccess={obtenerFacturas}
              pedidos={pedidos}     />
    </div>
  );
}
