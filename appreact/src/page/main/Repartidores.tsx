import { useState, useEffect } from "react";
import { fetchClient } from "../../services/fetchClient";
import { Repartidor } from "../../interfaces/IRepartidores";
import { Button } from "reactstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { DataTable } from "./DataTable";
import { RepartidorModal } from "./RepartidorModal";
import Swal from "sweetalert2";

export function Repartidores() {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [repartidorSeleccionado, setRepartidorSeleccionado] = useState<Repartidor | undefined>(undefined);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setRepartidorSeleccionado(undefined);
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
    obtenerRepartidores();
  }, []);

  const handleNuevo = () => {
    setRepartidorSeleccionado(undefined);
    setModalOpen(true);
  };

  const handleEditar = (repartidor: Repartidor) => {
    setRepartidorSeleccionado(repartidor);
    setModalOpen(true);
  };

  const handleEliminar = async (repartidor: Repartidor) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar a "${repartidor.nombre_repartidor}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await fetchClient(`/api/repartidores/delete/${repartidor.id_repartidor}`, {
          method: "DELETE",
        });

        setRepartidores((prev) =>
          prev.filter((r) => r.id_repartidor !== repartidor.id_repartidor)
        );

        Swal.fire("Eliminado", "El repartidor fue eliminado correctamente", "success");
      } catch (error: any) {
        Swal.fire("Error", error.message || "No se pudo eliminar", "error");
      }
    }
  };

  const renderActivo = (activo: string) => {
    return activo === "true" ? "Sí" : "No";
  };

  return (
    <div>
      <h2 className="mt-4">Lista de Repartidores</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button color="primary" onClick={handleNuevo}>
          Nuevo Repartidor
        </Button>
      </div>

      <DataTable<Repartidor>
        data={repartidores}
        columns={[
          { key: "nombre_repartidor", label: "Nombre Repartidor" },
          { key: "telefono", label: "Teléfono" },
          { key: "dui", label: "DUI" },
          {
            key: "activo",
            label: "Activo",
            render: (item) => renderActivo(item.activo),
          },
          {
            key: "acciones",
            label: "Acciones",
            render: (repartidor: Repartidor) => (
              <div className="d-flex justify-content-center gap-2">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => handleEditar(repartidor)}
                >
                  <FaEdit />
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleEliminar(repartidor)}
                >
                  <FaTrashAlt />
                </Button>
              </div>
            ),
          },
        ]}
        searchKeys={["nombre_repartidor", "telefono", "dui"]}
      />

      <RepartidorModal
        isOpen={modalOpen}
        toggle={toggleModal}
        repartidor={repartidorSeleccionado}
        onSuccess={obtenerRepartidores}
      />
    </div>
  );
}
