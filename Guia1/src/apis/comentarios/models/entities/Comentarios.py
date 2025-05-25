from utils.DateFormat import DateFormat


class Comentarios:
    def __init__(self, id_comentario, id_pedido, id_cliente, texto, fecha, calificacion):
        self.id_comentario = id_comentario
        self.id_pedido = id_pedido
        self.id_cliente = id_cliente
        self.texto = texto
        self.fecha = fecha
        self.calificacion = calificacion

    def to_JSON(self):
        return {
            "id_comentario": self.id_comentario,
            "id_pedido": self.id_pedido,
            "id_cliente": self.id_cliente,
            "texto": self.texto,
            "fecha": self.fecha,
            "calificacion": self.calificacion
        }