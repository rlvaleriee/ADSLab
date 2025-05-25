from database.database import get_connection
from apis.pedidos.models.entities.Pedidos import Pedidos


class PedidosModels:

    @classmethod
    def get_all_pedidos(cls):
        try:
            connection = get_connection()
            pedidos_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_pedido, id_cliente, fecha_pedido, id_estado, id_repartidor, direccion
                    FROM pedidos
                    ORDER BY fecha_pedido DESC
                """)
                resultset = cursor.fetchall()
                for row in resultset:
                    pedido = Pedidos(
                        id_pedido=row[0],
                        id_cliente=row[1],
                        fecha_pedido=row[2],
                        id_estado=row[3],
                        id_repartidor=row[4],
                        direccion=row[5]
                    )
                    pedidos_list.append(pedido.to_JSON())
            connection.close()
            return pedidos_list
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_pedido_by_id(cls, id_pedido):
        try:
            connection = get_connection()
            pedido_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_pedido, id_cliente, fecha_pedido, id_estado, id_repartidor, direccion
                    FROM pedidos
                    WHERE id_pedido = %s
                """, (id_pedido,))
                row = cursor.fetchone()
                if row:
                    pedido = Pedidos(
                        id_pedido=row[0],
                        id_cliente=row[1],
                        fecha_pedido=row[2],
                        id_estado=row[3],
                        id_repartidor=row[4],
                        direccion=row[5]
                    )
                    pedido_json = pedido.to_JSON()
            connection.close()
            return pedido_json
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def add_pedido(cls, pedido: Pedidos):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO pedidos (id_pedido, id_cliente, fecha_pedido, id_estado, id_repartidor, direccion)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    pedido.id_pedido,
                    pedido.id_cliente,
                    pedido.fecha_pedido,
                    pedido.id_estado,
                    pedido.id_repartidor,
                    pedido.direccion
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def update_pedido(cls, pedido: Pedidos):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE pedidos
                    SET id_cliente = %s,
                        fecha_pedido = %s,
                        id_estado = %s,
                        id_repartidor = %s,
                        direccion = %s
                    WHERE id_pedido = %s
                """, (
                    pedido.id_cliente,
                    pedido.fecha_pedido,
                    pedido.id_estado,
                    pedido.id_repartidor,
                    pedido.direccion,
                    pedido.id_pedido
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_pedido(cls, pedido: Pedidos):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM pedidos
                    WHERE id_pedido = %s
                """, (pedido.id_pedido,))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
