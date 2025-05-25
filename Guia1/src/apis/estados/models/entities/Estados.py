from utils.DateFormat import DateFormat


class Estados:
    def __init__(self, id_estado, nombre_estado, descripcion):
        self.id_estado = id_estado
        self.nombre_estado = nombre_estado
        self.descripcion = descripcion

    def to_JSON(self):
        return {
            "id_estado": self.id_estado,
            "nombre_estado": self.nombre_estado,
            "descripcion": self.descripcion
        }
