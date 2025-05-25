from utils.DateFormat import DateFormat


class Clientes:
    def __init__(self, id_cliente, nombre_cliente, telefono, fecha_registro):
        self.id_cliente = id_cliente
        self.nombre_cliente = nombre_cliente
        self.telefono = telefono
        self.fecha_registro = fecha_registro

    def to_JSON(self):
        return {
            "id_cliente": self.id_cliente,
            "nombre_cliente": self.nombre_cliente,
            "telefono": self.telefono,
            "fecha_registro": self.fecha_registro
        }
