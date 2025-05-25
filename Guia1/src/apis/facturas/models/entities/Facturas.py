from utils.DateFormat import DateFormat


class Facturas:
    def __init__(self, id_factura, id_pedido, fecha_emision, subtotal, impuestos, total, metodo_pago):
        self.id_factura = id_factura
        self.id_pedido = id_pedido
        self.fecha_emision = fecha_emision
        self.subtotal = subtotal
        self.impuestos = impuestos
        self.total = total
        self.metodo_pago = metodo_pago

    def to_JSON(self):
        return {
            "id_factura": self.id_factura,
            "id_pedido": self.id_pedido,
            "fecha_emision": self.fecha_emision,
            "subtotal": self.subtotal,
            "impuestos": self.impuestos,
            "total": self.total,
            "metodo_pago": self.metodo_pago
        }