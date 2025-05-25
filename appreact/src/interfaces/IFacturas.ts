export interface Factura {
  id_factura: number;
  id_pedido: number;
  fecha_emision: string;
  subtotal: number;
  impuestos: number;
  total: number;
  metodo_pago: string;
}