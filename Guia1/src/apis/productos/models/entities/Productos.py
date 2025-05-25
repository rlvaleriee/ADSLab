from utils.DateFormat import DateFormat


class Productos:
    def __init__(self, id_productos, id_categoria, nombre_producto, descripcion, precio, disponible):
        self.id_productos = id_productos
        self.id_categoria = id_categoria
        self.nombre_producto = nombre_producto
        self.descripcion = descripcion
        self.precio = precio
        self.disponible = disponible

    def to_JSON(self):
        return {
            "id_productos": self.id_productos,
            "id_categoria": self.id_categoria,
            "nombre_producto": self.nombre_producto,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "disponible": self.disponible
        }