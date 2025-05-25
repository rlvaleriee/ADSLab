// ClienteModal.tsx
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
import type { Cliente } from "../../interfaces/ICliente";
import { fetchClient } from "../../services/fetchClient";

interface ClienteModalProps {
  isOpen: boolean;
  toggle: () => void;
  cliente?: Cliente;
  onSuccess: () => void;
}

export function ClienteModal({
  isOpen,
  toggle,
  cliente,
  onSuccess,
}: ClienteModalProps) {
  const [formData, setFormData] = useState<Cliente>({
    id_cliente: cliente?.id_cliente ?? 0,
    nombre_cliente: cliente?.nombre_cliente ?? "",
    telefono: cliente?.telefono ?? "",
    fecha_registro:
      cliente?.fecha_registro ?? new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (cliente) {
      setFormData({ ...cliente });
    } else {
      setFormData({
        id_cliente: 0,
        nombre_cliente: "",
        telefono: "",
        fecha_registro: new Date().toISOString().split("T")[0],
      });
    }
  }, [cliente, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const method = cliente ? "PUT" : "POST";
      const endpoint = cliente
        ? `/api/clientes/update/${cliente.id_cliente}`
        : "/api/clientes/add";

      const response = await fetchClient(endpoint, {
  method,
  body: JSON.stringify(formData),
});

// Ejemplo de validación (solo si tu fetchClient devuelve algo útil)
if (response && response.success === false) {
  Swal.fire("Error", "La operación falló", "error");
  return;
}


      Swal.fire({
        title: cliente ? "Cliente actualizado" : "Cliente creado",
        icon: "success",
      });

      onSuccess();
      toggle();
    } catch (error: any) {
      Swal.fire("Error", error.message || "No se pudo guardar", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {cliente ? "Editar Cliente" : "Nuevo Cliente"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="nombre_cliente">Nombre</Label>
            <Input
              type="text"
              id="nombre_cliente"
              name="nombre_cliente"
              value={formData.nombre_cliente}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="telefono">Teléfono</Label>
            <Input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="fecha_registro">Fecha de Registro</Label>
            <Input
              type="date"
              id="fecha_registro"
              name="fecha_registro"
              value={formData.fecha_registro}
              onChange={handleChange}
              disabled={!!cliente}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          {cliente ? "Actualizar" : "Crear"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
