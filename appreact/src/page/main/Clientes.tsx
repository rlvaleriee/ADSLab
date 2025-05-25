import { useState, useEffect } from "react";
import { fetchClient } from "../../services/fetchClient";
import { Cliente } from "../../interfaces/ICliente";
import { Button } from "reactstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { DataTable } from "./DataTable";
import { ClienteModal } from "./ClienteModal";
import Swal from "sweetalert2";

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | undefined>(undefined);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setClienteSeleccionado(undefined);
  };

  const obtenerClientes = async () => {
    try {
      const data = await fetchClient<Cliente[]>("/api/clientes");
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const handleNuevo = () => {
    setClienteSeleccionado(undefined);
    setModalOpen(true);
  };

  const handleEditar = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setModalOpen(true);
  };

  const handleEliminar = async (cliente: Cliente) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: `¿Deseas eliminar al cliente "${cliente.nombre_cliente}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await fetchClient(`/api/clientes/delete/${cliente.id_cliente}`, {
        method: "DELETE",
      });

      // Actualizar la lista sin necesidad de hacer un nuevo fetch si deseas
      setClientes((prev) =>
        prev.filter((c) => c.id_cliente !== cliente.id_cliente)
      );

      Swal.fire("Eliminado", "El cliente fue eliminado correctamente", "success");
    } catch (error: any) {
      Swal.fire("Error", error.message || "No se pudo eliminar el cliente", "error");
    }
  }
};


  return (
    <div>
      <h2 className="mt-4">Lista de Clientes</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button color="primary" onClick={handleNuevo}>
          Nuevo Cliente
        </Button>
      </div>

      <DataTable<Cliente>
        data={clientes}
        columns={[
          { key: "nombre_cliente", label: "Nombre Cliente" },
          { key: "telefono", label: "Teléfono" },
          { key: "fecha_registro", label: "Fecha de Registro" },
          {
            key: "acciones",
            label: "Acciones",
            render: (cliente: Cliente) => (
              <div className="d-flex justify-content-center gap-2">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => handleEditar(cliente)}
                >
                  <FaEdit />
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleEliminar(cliente)}
                >
                  <FaTrashAlt />
                </Button>
              </div>
            ),
          },
        ]}
        searchKeys={["nombre_cliente", "telefono"]}
      />

      <ClienteModal
        isOpen={modalOpen}
        toggle={toggleModal}
        cliente={clienteSeleccionado}
        onSuccess={obtenerClientes}
      />
    </div>
  );
}
