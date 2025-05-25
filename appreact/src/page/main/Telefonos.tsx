import { useState, useEffect } from "react";
import { fetchClient } from "../../services/fetchClient";
import { Telefono } from "../../interfaces/ITelefonos";
import { Cliente } from "../../interfaces/ICliente";
import { Button } from "reactstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { DataTable } from "./DataTable";
import { TelefonoModal } from "./TelefonoModal";
import Swal from "sweetalert2";

export function Telefonos() {
  const [telefonos, setTelefonos] = useState<Telefono[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [telefonoSeleccionado, setTelefonoSeleccionado] = useState<Telefono | undefined>(undefined);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setTelefonoSeleccionado(undefined);
  };

  const obtenerTelefonos = async () => {
  try {
    const data = await fetchClient<Telefono[]>("/api/telefonos");
    setTelefonos(data); 
  } catch (error) {
    console.error("Error al obtener teléfonos:", error);
    setTelefonos([]); 
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

  useEffect(() => {
    obtenerTelefonos();
    obtenerClientes();
  }, []);

  const handleNuevo = () => {
    setTelefonoSeleccionado(undefined);
    setModalOpen(true);
  };

  const handleEditar = (telefono: Telefono) => {
    setTelefonoSeleccionado(telefono);
    setModalOpen(true);
  };

  const handleEliminar = async (telefono: Telefono) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar el número "${telefono.numero_telefono}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await fetchClient(`/api/telefonos/delete/${telefono.id_telefono}`, {
          method: "DELETE",
        });

        setTelefonos((prev) =>
          prev.filter((t) => t.id_telefono !== telefono.id_telefono)
        );

        Swal.fire("Eliminado", "El teléfono fue eliminado correctamente", "success");
      } catch (error: any) {
        Swal.fire("Error", error.message || "No se pudo eliminar", "error");
      }
    }
  };

  const getNombreCliente = (idCliente: number) => {
    return clientes.find(c => c.id_cliente === idCliente)?.nombre_cliente ?? "Cliente no encontrado";
  };

  return (
    <div>
      <h2 className="mt-4">Lista de Teléfonos</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button color="primary" onClick={handleNuevo}>
          Nuevo Teléfono
        </Button>
      </div>

      <DataTable<Telefono>
        data={telefonos}
        columns={[
          {
            key: "id_cliente",
            label: "Cliente",
            render: (telefono) => getNombreCliente(telefono.id_cliente),
          },
          { key: "numero_telefono", label: "Número" },
          { key: "fecha_creacion", label: "Fecha de Registro" },
          {
            key: "acciones",
            label: "Acciones",
            render: (telefono: Telefono) => (
              <div className="d-flex justify-content-center gap-2">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => handleEditar(telefono)}
                >
                  <FaEdit />
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleEliminar(telefono)}
                >
                  <FaTrashAlt />
                </Button>
              </div>
            ),
          },
        ]}
        searchKeys={["numero_telefono"]}
      />

      <TelefonoModal
        isOpen={modalOpen}
        toggle={toggleModal}
        telefono={telefonoSeleccionado}
        clientes={clientes}
        onSuccess={obtenerTelefonos}
      />
    </div>
  );
}
