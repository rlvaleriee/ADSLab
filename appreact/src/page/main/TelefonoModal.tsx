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
import { Telefono } from "../../interfaces/ITelefonos";
import { Cliente } from "../../interfaces/ICliente";
import { fetchClient } from "../../services/fetchClient";

interface TelefonoModalProps {
  isOpen: boolean;
  toggle: () => void;
  telefono?: Telefono;
  clientes: Cliente[];
  onSuccess: () => void;
}

export function TelefonoModal({
  isOpen,
  toggle,
  telefono,
  clientes,
  onSuccess,
}: TelefonoModalProps) {
  const [formData, setFormData] = useState<Telefono>({
    id_telefono: 0,
    id_cliente: 0,
    numero_telefono: "",
    fecha_creacion: "",
  });

  useEffect(() => {
    if (telefono) {
      setFormData({ ...telefono });
    } else {
      setFormData({
        id_telefono: 0,
        id_cliente: 0,
        numero_telefono: "",
        fecha_creacion: "",
      });
    }
  }, [telefono, isOpen]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};



  const handleSubmit = async () => {
    if (!formData.id_cliente || !formData.numero_telefono.trim()) {
      Swal.fire("Validación", "Todos los campos son obligatorios.", "warning");
      return;
    }

    try {
      const method = telefono ? "PUT" : "POST";

      if (telefono && !telefono.id_telefono) {
        throw new Error("ID del teléfono no definido para actualizar.");
      }

      const endpoint = telefono
        ? `/api/telefonos/update/${telefono.id_telefono}`
        : "/api/telefonos/add";

      await fetchClient(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      Swal.fire({
        title: telefono ? "Teléfono actualizado" : "Teléfono creado",
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
        {telefono ? "Editar Teléfono" : "Nuevo Teléfono"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="id_cliente">Cliente</Label>
            <Input
              type="select"
              id="id_cliente"
              name="id_cliente"
              value={formData.id_cliente}
              onChange={handleChange}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nombre_cliente}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="numero_telefono">Número de Teléfono</Label>
            <Input
              type="text"
              id="numero_telefono"
              name="numero_telefono"
              value={formData.numero_telefono}
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
          {telefono ? "Actualizar" : "Crear"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
