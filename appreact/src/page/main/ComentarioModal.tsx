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
import type { Comentario } from "../../interfaces/IComentarios";
import type { Cliente } from "../../interfaces/ICliente";
import type { Pedido } from "../../interfaces/IPedidos";
import { fetchClient } from "../../services/fetchClient";

interface ComentarioModalProps {
  isOpen: boolean;
  toggle: () => void;
  comentario?: Comentario;
  clientes: Cliente[];
  pedidos: Pedido[];
  onSuccess: () => void;
}

export function ComentarioModal({
  isOpen,
  toggle,
  comentario,
  clientes,
  pedidos,
  onSuccess,
}: ComentarioModalProps) {
  const [formData, setFormData] = useState<Comentario>({
    id_comentario: 0,
    id_cliente: 0,
    id_pedido: 0,
    texto: "",
    fecha: new Date().toISOString().split("T")[0],
    calificacion: 0,
  });

  useEffect(() => {
    if (comentario) {
      setFormData({ ...comentario });
    } else {
      setFormData({
        id_comentario: 0,
        id_cliente: 0,
        id_pedido: 0,
        texto: "",
        fecha: new Date().toISOString().split("T")[0],
        calificacion: 0,
      });
    }
  }, [comentario, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "calificacion" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.texto.trim()) {
      Swal.fire("Validación", "El comentario no puede estar vacío.", "warning");
      return;
    }

    try {
      const method = comentario ? "PUT" : "POST";
      const endpoint = comentario
        ? `/api/comentarios/update/${comentario.id_comentario}`
        : "/api/comentarios/add";

      const response = await fetchClient(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      Swal.fire({
        title: comentario ? "Comentario actualizado" : "Comentario creado",
        icon: "success",
      });

      onSuccess();
      toggle();
    } catch (error: any) {
      Swal.fire("Error", error.message || "No se pudo guardar el comentario", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {comentario ? "Editar Comentario" : "Nuevo Comentario"}
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
                  {pedido.direccion}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="texto">Comentario</Label>
            <Input
              type="textarea"
              id="texto"
              name="texto"
              value={formData.texto}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="fecha">Fecha</Label>
            <Input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="calificacion">Calificación</Label>
            <Input
              type="number"
              id="calificacion"
              name="calificacion"
              value={formData.calificacion}
              onChange={handleChange}
              min={0}
              max={5}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          {comentario ? "Actualizar" : "Crear"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
