export interface Entrega {
  id_pedido(id_pedido: any): import("react").ReactNode;
  id_entrega: string;
  direccion: string;
  fecha_entrega: string;
}