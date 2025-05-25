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
import { Repartidor } from "../../interfaces/IRepartidores";
import { fetchClient } from "../../services/fetchClient";

interface RepartidorModalProps {
  isOpen: boolean;
  toggle: () => void;
  repartidor?: Repartidor;
  onSuccess: () => void;
}

export function RepartidorModal({
  isOpen,
  toggle,
  repartidor,
  onSuccess,
}: RepartidorModalProps) {
  const [formData, setFormData] = useState<Repartidor>({
    id_repartidor: 0,
    nombre_repartidor: "",
    telefono: "",
    dui: "",
    activo: "true",
  });

  useEffect(() => {
    if (repartidor) {
      setFormData({ ...repartidor });
    } else {
      setFormData({
        id_repartidor: 0,
        nombre_repartidor: "",
        telefono: "",
        dui: "",
        activo: "true",
      });
    }
  }, [repartidor, isOpen]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  let parsedValue: any = value;

  // Si es campo booleano simulado (como string), asegúrate de mantener tipo string
  if (name === "activo" && (value === "true" || value === "false")) {
    parsedValue = value;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: parsedValue,
  }));
};


  const handleSubmit = async () => {
  if (
    !formData.nombre_repartidor.trim() ||
    !formData.telefono.trim() ||
    !formData.dui.trim()
  ) {
    Swal.fire("Validación", "Todos los campos son obligatorios.", "warning");
    return;
  }

  try {
    const method = repartidor ? "PUT" : "POST";

    // Si estás usando UUIDs, valida que sea un string no vacío
    if (repartidor && !repartidor.id_repartidor) {
      throw new Error("ID del repartidor no definido para actualizar.");
    }

    const endpoint = repartidor
      ? `/api/repartidores/update/${repartidor.id_repartidor}`
      : "/api/repartidores/add";

    await fetchClient(endpoint, {
      method,
      body: JSON.stringify(formData),
    });

    Swal.fire({
      title: repartidor ? "Repartidor actualizado" : "Repartidor creado",
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
        {repartidor ? "Editar Repartidor" : "Nuevo Repartidor"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="nombre_repartidor">Nombre</Label>
            <Input
              type="text"
              id="nombre_repartidor"
              name="nombre_repartidor"
              value={formData.nombre_repartidor}
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
            <Label for="dui">DUI</Label>
            <Input
              type="text"
              id="dui"
              name="dui"
              value={formData.dui}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="activo">Activo</Label>
            <Input
              type="select"
              id="activo"
              name="activo"
              value={formData.activo}
              onChange={handleChange}
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          {repartidor ? "Actualizar" : "Crear"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
