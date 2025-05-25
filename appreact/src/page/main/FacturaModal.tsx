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
import { Factura } from "../../interfaces/IFacturas";
import { Pedido } from "../../interfaces/IPedidos";
import { fetchClient } from "../../services/fetchClient";

interface FacturaModalProps {
  isOpen: boolean;
  toggle: () => void;
  factura?: Factura;
  pedidos: Pedido[];
  onSuccess: () => void;
}

export function FacturaModal({
  isOpen,
  toggle,
  factura,
  pedidos,
  onSuccess,
}: FacturaModalProps) {
  const [formData, setFormData] = useState<Factura>({
  id_factura: 0,
  id_pedido: 0, // UUID como string
  fecha_emision: new Date().toISOString().split("T")[0],
  subtotal: 0,
  impuestos: 0,
  total: 0,
  metodo_pago: "",
});


  useEffect(() => {
    if (factura) {
      setFormData({ ...factura });
    } else {
      setFormData({
        id_factura: 0,
        id_pedido: 0,
        fecha_emision: new Date().toISOString().split("T")[0],
        subtotal: 0,
        impuestos: 0,
        total: 0,
        metodo_pago: "",
      });
    }
  }, [factura, isOpen]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  const parsedValue =
    (name === "subtotal" || name === "impuestos")
      ? parseFloat(value)
      : value === "" && name === "id_pedido"
        ? null // o "" si tu backend acepta string vacío
        : value;

  setFormData((prev) => {
    const updated = { ...prev, [name]: parsedValue };

    if (name === "subtotal" || name === "impuestos") {
      updated.total = (updated.subtotal || 0) + (updated.impuestos || 0);
    }

    return updated;
  });
};


  const handleSubmit = async () => {
    if (!formData.id_pedido || !formData.metodo_pago || formData.total <= 0) {
  Swal.fire("Validación", "Por favor completa todos los campos obligatorios.", "warning");
  return;
}


    try {
  const method = factura ? "PUT" : "POST";
  const endpoint = factura
    ? `/api/facturas/update/${factura.id_factura}`
    : "/api/facturas/add";

  await fetchClient(endpoint, {
    method,
    body: JSON.stringify(formData),
  });

  Swal.fire({
    title: factura ? "Factura actualizada" : "Factura creada",
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
        {factura ? "Editar Factura" : "Nueva Factura"}
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
              {pedidos.map((p) => (
                <option key={p.id_pedido} value={p.id_pedido}>
                  #{p.id_pedido} - {p.direccion}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="fecha_emision">Fecha de Emisión</Label>
            <Input
              type="date"
              id="fecha_emision"
              name="fecha_emision"
              value={formData.fecha_emision}
              onChange={handleChange}
              disabled={!!factura}
            />
          </FormGroup>

          <FormGroup>
            <Label for="subtotal">Subtotal</Label>
            <Input
              type="number"
              id="subtotal"
              name="subtotal"
              step="0.01"
              value={formData.subtotal}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="impuestos">Impuestos</Label>
            <Input
              type="number"
              id="impuestos"
              name="impuestos"
              step="0.01"
              value={formData.impuestos}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="total">Total</Label>
            <Input
              type="number"
              id="total"
              name="total"
              value={formData.total}
              readOnly
            />
          </FormGroup>

          <FormGroup>
            <Label for="metodo_pago">Método de Pago</Label>
            <Input
              type="select"
              id="metodo_pago"
              name="metodo_pago"
              value={formData.metodo_pago}
              onChange={handleChange}
            >
              <option value="">Seleccione un método</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          {factura ? "Actualizar" : "Crear"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
