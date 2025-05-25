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
import type { Categoria } from "../../interfaces/ICategorias";
import { fetchClient } from "../../services/fetchClient";

interface CategoriaModalProps {
  isOpen: boolean;
  toggle: () => void;
  categoria?: Categoria;
  onSuccess: () => void;
}

export function CategoriaModal({
  isOpen,
  toggle,
  categoria,
  onSuccess,
}: CategoriaModalProps) {
  const [formData, setFormData] = useState<Categoria>({
    id_categoria: categoria?.id_categoria ?? 0,
    nombre_categoria: categoria?.nombre_categoria ?? "",
    descripcion: categoria?.descripcion ?? "",
  });

  useEffect(() => {
    if (categoria) {
      setFormData({ ...categoria });
    } else {
      setFormData({
        id_categoria: 0,
        nombre_categoria: "",
        descripcion: "",
      });
    }
  }, [categoria, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const method = categoria ? "PUT" : "POST";
      const endpoint = categoria
        ? `/api/categorias/update/${categoria.id_categoria}`
        : "/api/categorias/add";

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
        title: categoria ? "Categoría actualizada" : "Categoría creada",
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
        {categoria ? "Editar Categoría" : "Nueva Categoría"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="nombre_categoria">Nombre</Label>
            <Input
              type="text"
              id="nombre_categoria"
              name="nombre_categoria"
              value={formData.nombre_categoria}
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
          {categoria ? "Actualizar" : "Crear"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
