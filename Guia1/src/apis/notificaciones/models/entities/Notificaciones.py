from utils.DateFormat import DateFormat


class Notificaciones:
    def __init__(self, id, id_Cliente, fecha_envio, estado):
        self.id = id
        self.id_Cliente = id_Cliente
        self.fecha_envio = fecha_envio
        self.estado = estado

    def to_JSON(self):
        return {
            "id": self.id,
            "id_Cliente": self.id_Cliente,
            "fecha_envio": self.fecha_envio,
            "estado": self.estado
        }
