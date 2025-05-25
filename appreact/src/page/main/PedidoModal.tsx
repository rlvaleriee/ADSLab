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
  Button
} from "reactstrap";
import Swal from "sweetalert2";
import { Pedido } from "../../interfaces/IPedidos";
import { Cliente } from "../../interfaces/ICliente";
import { Estado } from "../../interfaces/IEstados";
import { Repartidor } from "../../interfaces/IRepartidores";
import { fetchClient } from "../../services/fetchClient";

interface PedidoModalProps {
  isOpen: boolean;
  toggle: () => void;
  pedido?: Pedido;
  clientes: Cliente[];
  estados: Estado[];
  repartidores: Repartidor[];
  onSuccess: () => void;
}

export function PedidoModal({
  isOpen,
  toggle,
  pedido,
  clientes,
  estados,
  repartidores,
  onSuccess,
}: PedidoModalProps) {
  const [formData, setFormData] = useState<Pedido>({
    id_pedido: 0,
    id_cliente: 0,
    id_estado: 0,
    id_repartidor: 0,
    fecha_pedido: new Date().toISOString().split("T")[0],
    direccion: "",
  });

  useEffect(() => {
    if (pedido) {
      setFormData({ ...pedido });
    } else {
      setFormData({
        id_pedido: 0,
        id_cliente: 0,
        id_estado: 0,
        id_repartidor: 0,
        fecha_pedido: new Date().toISOString().split("T")[0],
        direccion: "",
      });
    }
  }, [pedido, isOpen]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  const uuidFields = ["id_cliente", "id_estado", "id_repartidor"];
const parsedValue =
  uuidFields.includes(name) && value === "" ? null : value;

setFormData((prev) => ({ ...prev, [name]: parsedValue }));

};


  const handleSubmit = async () => {
  if (!formData.id_cliente || !formData.id_estado || !formData.direccion.trim()) {
  Swal.fire("Validación", "Todos los campos obligatorios deben completarse.", "warning");
  return;
}


  try {
    const method = pedido ? "PUT" : "POST";

    // Validar que el id_pedido sea válido antes de hacer update
    if (pedido && (!pedido.id_pedido || pedido.id_pedido <= 0)) {
      throw new Error("ID del pedido no es válido para actualizar.");
    }

    const endpoint = pedido
      ? `/api/pedidos/update/${pedido.id_pedido}`
      : "/api/pedidos/add";

    await fetchClient(endpoint, {
      method,
      body: JSON.stringify(formData),
    });

    Swal.fire({
      title: pedido ? "Pedido actualizado" : "Pedido creado",
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
        {pedido ? "Editar Pedido" : "Nuevo Pedido"}
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
              {clientes.map((c) => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nombre_cliente}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="id_estado">Estado</Label>
            <Input
              type="select"
              id="id_estado"
              name="id_estado"
              value={formData.id_estado}
              onChange={handleChange}
            >
              <option value="">Seleccione un estado</option>
              {estados.map((e) => (
                <option key={e.id_estado} value={e.id_estado}>
                  {e.nombre_estado}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="id_repartidor">Repartidor</Label>
            <Input
              type="select"
              id="id_repartidor"
              name="id_repartidor"
              value={formData.id_repartidor}
              onChange={handleChange}
            >
              <option value="">Seleccione un repartidor</option>
              {repartidores.map((r) => (
                <option key={r.id_repartidor} value={r.id_repartidor}>
                  {r.nombre_repartidor}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="fecha_pedido">Fecha de Pedido</Label>
            <Input
              type="date"
              id="fecha_pedido"
              name="fecha_pedido"
              value={formData.fecha_pedido}
              onChange={handleChange}
              disabled={!!pedido}
            />
          </FormGroup>

          <FormGroup>
            <Label for="direccion">Dirección</Label>
            <Input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
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
          {pedido ? "Actualizar" : "Crear"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
