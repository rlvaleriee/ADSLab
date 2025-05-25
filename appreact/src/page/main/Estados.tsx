import { useState, useEffect } from "react";
import { fetchClient } from "../../services/fetchClient";
import { Estado } from "../../interfaces/IEstados";
import { Button } from "reactstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { DataTable } from "./DataTable";
import { EstadoModal } from "./EstadoModal";
import Swal from "sweetalert2";

export function Estados() {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<Estado | undefined>(undefined);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setEstadoSeleccionado(undefined);
  };

  const obtenerEstados = async () => {
    try {
      const data = await fetchClient<Estado[]>("/api/estados");
      setEstados(data);
    } catch (error) {
      console.error("Error al obtener estados:", error);
    }
  };

  useEffect(() => {
    obtenerEstados();
  }, []);

  const handleNuevo = () => {
    setEstadoSeleccionado(undefined);
    setModalOpen(true);
  };

  const handleEditar = (estado: Estado) => {
    setEstadoSeleccionado(estado);
    setModalOpen(true);
  };

  const handleEliminar = async (estado: Estado) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar el estado "${estado.nombre_estado}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await fetchClient(`/api/estados/delete/${estado.id_estado}`, {
          method: "DELETE",
        });

        setEstados((prev) =>
          prev.filter((e) => e.id_estado !== estado.id_estado)
        );

        Swal.fire("Eliminado", "El estado fue eliminado correctamente", "success");
      } catch (error: any) {
        Swal.fire("Error", error.message || "No se pudo eliminar el estado", "error");
      }
    }
  };

  return (
    <div>
      <h2 className="mt-4">Lista de Estados</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button color="primary" onClick={handleNuevo}>
          Nuevo Estado
        </Button>
      </div>

      <DataTable<Estado>
        data={estados}
        columns={[
          { key: "nombre_estado", label: "Nombre Estado" },
          { key: "descripcion", label: "Descripción" },
          {
            key: "acciones",
            label: "Acciones",
            render: (estado: Estado) => (
              <div className="d-flex justify-content-center gap-2">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => handleEditar(estado)}
                >
                  <FaEdit />
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleEliminar(estado)}
                >
                  <FaTrashAlt />
                </Button>
              </div>
            ),
          },
        ]}
        searchKeys={["nombre_estado", "descripcion"]}
      />

      <EstadoModal
        isOpen={modalOpen}
        toggle={toggleModal}
        estado={estadoSeleccionado}
        onSuccess={obtenerEstados}
      />
    </div>
  );
}
