import { useState, useEffect } from "react";
import { Cliente } from "../../interfaces/ICliente";
import { Button, Form, FormGroup, Label, Input, Table } from "reactstrap";
import Swal from "sweetalert2";
import { fetchClient } from "../../services/fetchClient";

interface NotificacionFormProps {
  clientes: Cliente[];
  onSuccess: () => void;
}

interface Notificacion {
  id: string;
  id_Cliente: number;
  fecha_envio: string;
  estado: string;
}

export function NotificacionForm({ clientes, onSuccess }: NotificacionFormProps) {
  const [idCliente, setIdCliente] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [fechaEnvio, setFechaEnvio] = useState(new Date().toISOString().split("T")[0]);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const obtenerNotificaciones = async () => {
    try {
      const data = await fetchClient<Notificacion[]>("/api/notificaciones");
      setNotificaciones(data);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  useEffect(() => {
    obtenerNotificaciones();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!idCliente.trim() || !estado.trim()) {
    Swal.fire("Validación", "Todos los campos son obligatorios.", "warning");
    return;
  }

  try {
    const response = await fetchClient("/api/notificaciones/add", {
  method: "POST",
  body: JSON.stringify({
    id_Cliente: idCliente,
    fecha_envio: fechaEnvio,
    estado,
  }),
});

Swal.fire({
  title: "Notificación enviada",
  html: `
    <p>Mensajes enviados:</p>
    <pre style="text-align:left;">${JSON.stringify(response.send_results, null, 2)}</pre>
  `,
  icon: "success",
  width: 600,
});


    Swal.fire({
      title: "Notificación enviada",
      text: "Se intentó enviar a todos los números registrados.",
      icon: "success",
    });

    onSuccess();
    obtenerNotificaciones();
  } catch (error: any) {
    Swal.fire("Error", error.message || "Error al enviar la notificación", "error");
  }
};

  const getNombreCliente = (idCliente: number) => {
    const cliente = clientes.find((c) => c.id_cliente === idCliente);
    return cliente ? cliente.nombre_cliente : "Desconocido";
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="idCliente">Cliente</Label>
          <Input
            type="select"
            id="idCliente"
            value={idCliente}
            onChange={(e) => setIdCliente(e.target.value)}
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
          <Label for="estado">Estado</Label>
          <Input
            type="text"
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label for="fechaEnvio">Fecha de Envío</Label>
          <Input
            type="date"
            id="fechaEnvio"
            value={fechaEnvio}
            onChange={(e) => setFechaEnvio(e.target.value)}
          />
        </FormGroup>

        <Button color="primary" type="submit">
          Enviar Notificación
        </Button>
      </Form>

      <h4 className="mt-2">Historial de Notificaciones</h4>
<div style={{ maxHeight: "300px", overflowY: "auto" }}>
  <Table bordered hover responsive className="mt-3">
    <thead>
      <tr>
        <th>Cliente</th>
        <th>Fecha de Envío</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      {notificaciones.map((n) => (
        <tr key={n.id}>
          <td>{getNombreCliente(n.id_Cliente)}</td>
          <td>{new Date(n.fecha_envio).toLocaleDateString()}</td>
          <td>{n.estado}</td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>

    </div>
  );
}
