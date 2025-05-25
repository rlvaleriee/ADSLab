import { useState, useEffect, ChangeEvent } from "react";
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
import { Producto } from "../../interfaces/IProductos";
import { Categoria } from "../../interfaces/ICategorias";
import { fetchClient } from "../../services/fetchClient";

interface ProductoModalProps {
  isOpen: boolean;
  toggle: () => void;
  producto?: Producto;
  categorias: Categoria[];
  onSuccess: () => void;
}

export function ProductoModal({
  isOpen,
  toggle,
  producto,
  categorias,
  onSuccess,
}: ProductoModalProps) {
  const [formData, setFormData] = useState<Producto>({
    id_productos: 0,
    id_categoria: 0,
    nombre_producto: "",
    descripcion: "",
    precio: 0,
    disponible: "true",
  });

  useEffect(() => {
    if (producto) {
      setFormData({ ...producto });
    } else {
      setFormData({
        id_productos: 0,
        id_categoria: 0,
        nombre_producto: "",
        descripcion: "",
        precio: 0,
        disponible: "true",
      });
    }
  }, [producto, isOpen]);

  const handleSubmit = async () => {
  if (
  !formData.nombre_producto.trim() ||
  !formData.descripcion.trim() ||
  !formData.precio ||
  !formData.id_categoria
) {
  Swal.fire("Validación", "Todos los campos son obligatorios.", "warning");
  return;
}


  try {
    const method = producto ? "PUT" : "POST";

    if (producto && !producto.id_productos) {
      throw new Error("ID del producto no definido para actualizar.");
    }

    const endpoint = producto
      ? `/api/productos/update/${producto.id_productos}`
      : "/api/productos/add";

    await fetchClient(endpoint, {
      method,
      body: JSON.stringify(formData),
    });

    Swal.fire({
      title: producto ? "Producto actualizado" : "Producto creado",
      icon: "success",
    });
    onSuccess();
    toggle();
  } catch (error: any) {
    Swal.fire("Error", error.message || "No se pudo guardar", "error");
  }
};


  const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  let parsedValue: any = value;

  if (name === "precio") {
    parsedValue = parseFloat(value);
  } else if (name === "id_categoria" && value === "") {
    parsedValue = null; // o "" si tu backend lo acepta así
  }

  setFormData((prev) => ({
    ...prev,
    [name]: parsedValue,
  }));
};



  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {producto ? "Editar Producto" : "Nuevo Producto"}
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="id_categoria">Categoría</Label>
            <Input
              type="select"
              id="id_categoria"
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nombre_categoria}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="nombre_producto">Nombre</Label>
            <Input
              type="text"
              id="nombre_producto"
              name="nombre_producto"
              value={formData.nombre_producto}
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

          <FormGroup>
            <Label for="precio">Precio</Label>
            <Input
              type="number"
              id="precio"
              name="precio"
              step="0.01"
              value={formData.precio}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="disponible">Disponible</Label>
            <Input
              type="select"
              id="disponible"
              name="disponible"
              value={formData.disponible}
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
          {producto ? "Actualizar" : "Crear"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
