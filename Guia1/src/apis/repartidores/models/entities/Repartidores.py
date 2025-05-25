from utils.DateFormat import DateFormat


class Repartidores:
    def __init__(self, id_repartidor, nombre_repartidor, telefono, dui, activo):
        self.id_repartidor = id_repartidor
        self.nombre_repartidor = nombre_repartidor
        self.telefono = telefono
        self.dui = dui
        self.activo = activo

    def to_JSON(self):
        return {
            "id_repartidor": self.id_repartidor,
            "nombre_repartidor": self.nombre_repartidor,
            "telefono": self.telefono,
            "dui": self.dui,
            "activo": self.activo
        }
