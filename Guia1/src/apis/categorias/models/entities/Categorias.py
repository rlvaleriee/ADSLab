from utils.DateFormat import DateFormat


class Categorias:
    def __init__(self, id_categoria, nombre_categoria, descripcion):
        self.id_categoria = id_categoria
        self.nombre_categoria = nombre_categoria
        self.descripcion = descripcion

    def to_JSON(self):
        return {
            "id_categoria": self.id_categoria,
            "nombre_categoria": self.nombre_categoria,
            "descripcion": self.descripcion
        }