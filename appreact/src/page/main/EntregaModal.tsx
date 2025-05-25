import { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import Swal from "sweetalert2";
import type { Entrega } from "../../interfaces/IEntregas";
import type { Pedido } from "../../interfaces/IPedidos";
import { fetchClient } from "../../services/fetchClient";

interface EntregaModalProps {
  isOpen: boolean;
  toggle: () => void;
  entrega?: Entrega;
  pedidos: Pedido[];
  onSuccess: () => void;
}

export function EntregaModal({
  isOpen,
  toggle,
  entrega,
  pedidos,
  onSuccess,
}: EntregaModalProps) {
  const [formData, setFormData] = useState<Entrega>({
  id_entrega: "", // si es UUID, debe ser string
  id_pedido: 0,
  fecha_entrega: new Date().toISOString().split("T")[0],
});


  useEffect(() => {
    if (entrega) {
      setFormData({ ...entrega });
    } else {
      setFormData({
  id_entrega: "",
  id_pedido: 0,
  fecha_entrega: new Date().toISOString().split("T")[0],
});

    }
  }, [entrega, isOpen]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  const parsedValue = value === "" && name === "id_pedido" ? null : value;

  setFormData((prev) => ({
    ...prev,
    [name]: parsedValue,
  }));
};


  const handleSubmit = async () => {
  if (!formData.id_pedido || !formData.fecha_entrega) {
    Swal.fire("Validación", "Todos los campos son obligatorios.", "warning");
    return;
  }

  try {
    const method = entrega ? "PUT" : "POST";

    if (entrega && !entrega.id_entrega) {
      throw new Error("ID de la entrega no definido para actualizar.");
    }

    const endpoint = entrega
      ? `/api/entregas/update/${entrega.id_entrega}`
      : "/api/entregas/add";

    await fetchClient(endpoint, {
      method,
      body: JSON.stringify(formData),
    });

    Swal.fire({
      title: entrega ? "Entrega actualizada" : "Entrega creada",
      icon: "success",
    });

    onSuccess();
    toggle();
  } catch (error: any) {
    Swal.fire("Error", error.message || "No se pudo guardar la entrega", "error");
  }
};


  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {entrega ? "Editar Entrega" : "Nueva Entrega"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="id_pedido">Pedido</Label>
            <Input
              type="select"
              id="id_pedido"
              name="id_pedido"
              value={formData.id_pedido}
              onChange={handleChange}
            >
              <option value="">Seleccione un pedido</option>
              {pedidos.map((pedido) => (
                <option key={pedido.id_pedido} value={pedido.id_pedido}>
                  #{pedido.id_pedido} - {pedido.direccion}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="fecha_entrega">Fecha de Entrega</Label>
            <Input
              type="date"
              id="fecha_entrega"
              name="fecha_entrega"
              value={formData.fecha_entrega}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          {entrega ? "Actualizar" : "Crear"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
