from utils.DateFormat import DateFormat


class Entregas:
    def __init__(self, id_entrega, id_pedido, fecha_entrega):
        self.id_entrega = id_entrega
        self.id_pedido = id_pedido
        self.fecha_entrega = fecha_entrega

    def to_JSON(self):
        return {
            "id_entrega": self.id_entrega,
            "id_pedido": self.id_pedido,
            "fecha_entrega": self.fecha_entrega
        }
