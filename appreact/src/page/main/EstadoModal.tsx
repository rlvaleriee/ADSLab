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
import { Estado } from "../../interfaces/IEstados";
import { fetchClient } from "../../services/fetchClient";

interface EstadoModalProps {
  isOpen: boolean;
  toggle: () => void;
  estado?: Estado;
  onSuccess: () => void;
}

export function EstadoModal({
  isOpen,
  toggle,
  estado,
  onSuccess,
}: EstadoModalProps) {
  const [formData, setFormData] = useState<Estado>({
    id_estado: 0,
    nombre_estado: "",
    descripcion: "",
  });

  useEffect(() => {
    if (estado) {
      setFormData({ ...estado });
    } else {
      setFormData({
        id_estado: 0,
        nombre_estado: "",
        descripcion: "",
      });
    }
  }, [estado, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nombre_estado.trim()) {
      Swal.fire("Validación", "El nombre del estado es obligatorio.", "warning");
      return;
    }

    try {
      const method = estado ? "PUT" : "POST";
      const endpoint = estado
        ? `/api/estados/update/${estado.id_estado}`
        : "/api/estados/add";

      const response = await fetchClient(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          title: estado ? "Estado actualizado" : "Estado creado",
          icon: "success",
        });
        onSuccess();
        toggle();
      } else {
        const errorText = await response.text();
        Swal.fire("Error", errorText, "error");
      }
    } catch (error: any) {
      Swal.fire("Error", error.message || "No se pudo guardar", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {estado ? "Editar Estado" : "Nuevo Estado"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="nombre_estado">Nombre del Estado</Label>
            <Input
              type="text"
              id="nombre_estado"
              name="nombre_estado"
              value={formData.nombre_estado}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="descripcion">Descripción</Label>
            <Input
              type="textarea"
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
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
          {estado ? "Actualizar" : "Crear"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
