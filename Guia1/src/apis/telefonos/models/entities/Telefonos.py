from utils.DateFormat import DateFormat


class Telefonos:
    def __init__(self, id_telefono, id_cliente, numero_telefono, fecha_creacion):
        self.id_telefono = id_telefono
        self.id_cliente = id_cliente
        self.numero_telefono = numero_telefono
        self.fecha_creacion = fecha_creacion

    def to_JSON(self):
        return {
            "id_telefono": self.id_telefono,
            "id_cliente": self.id_cliente,
            "numero_telefono": self.numero_telefono,
            "fecha_creacion": self.fecha_creacion.strftime("%Y-%m-%d %H:%M:%S") if self.fecha_creacion else None
        }

