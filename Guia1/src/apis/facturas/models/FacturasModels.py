from database.database import get_connection
from apis.facturas.models.entities.Facturas import Facturas


class FacturasModels:

    @classmethod
    def get_all_facturas(cls):
        try:
            connection = get_connection()
            facturas_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_factura, id_pedido, fecha_emision, subtotal, impuestos, total, metodo_pago
                    FROM facturas
                    ORDER BY fecha_emision DESC
                """)
                resultset = cursor.fetchall()
                for row in resultset:
                    factura = Facturas(
                        id_factura=row[0],
                        id_pedido=row[1],
                        fecha_emision=row[2],
                        subtotal=row[3],
                        impuestos=row[4],
                        total=row[5],
                        metodo_pago=row[6]
                    )
                    facturas_list.append(factura.to_JSON())
            connection.close()
            return facturas_list
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_factura_by_id(cls, id_factura):
        try:
            connection = get_connection()
            factura_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_factura, id_pedido, fecha_emision, subtotal, impuestos, total, metodo_pago
                    FROM facturas
                    WHERE id_factura = %s
                """, (id_factura,))
                row = cursor.fetchone()
                if row:
                    factura = Facturas(
                        id_factura=row[0],
                        id_pedido=row[1],
                        fecha_emision=row[2],
                        subtotal=row[3],
                        impuestos=row[4],
                        total=row[5],
                        metodo_pago=row[6]
                    )
                    factura_json = factura.to_JSON()
            connection.close()
            return factura_json
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def add_factura(cls, factura: Facturas):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO facturas (id_factura, id_pedido, fecha_emision, subtotal, impuestos, total, metodo_pago)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    factura.id_factura,
                    factura.id_pedido,
                    factura.fecha_emision,
                    factura.subtotal,
                    factura.impuestos,
                    factura.total,
                    factura.metodo_pago
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def update_factura(cls, factura: Facturas):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE facturas
                    SET id_pedido = %s,
                        fecha_emision = %s,
                        subtotal = %s,
                        impuestos = %s,
                        total = %s,
                        metodo_pago = %s
                    WHERE id_factura = %s
                """, (
                    factura.id_pedido,
                    factura.fecha_emision,
                    factura.subtotal,
                    factura.impuestos,
                    factura.total,
                    factura.metodo_pago,
                    factura.id_factura
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_factura(cls, factura: Facturas):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM facturas
                    WHERE id_factura = %s
                """, (factura.id_factura,))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)