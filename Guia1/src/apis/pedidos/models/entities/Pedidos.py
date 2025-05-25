from utils.DateFormat import DateFormat


class Pedidos:
    def __init__(self, id_pedido, id_cliente, fecha_pedido, id_estado, id_repartidor, direccion):
        self.id_pedido = id_pedido
        self.id_cliente = id_cliente
        self.fecha_pedido = fecha_pedido
        self.id_estado = id_estado
        self.id_repartidor = id_repartidor
        self.direccion = direccion

    def to_JSON(self):
        return {
            "id_pedido": self.id_pedido,
            "id_cliente": self.id_cliente,
            "fecha_pedido": DateFormat.convert_date(self.fecha_pedido),
            "id_estado": self.id_estado,
            "id_repartidor": self.id_repartidor,
            "direccion": self.direccion
        }

