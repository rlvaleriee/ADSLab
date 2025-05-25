from database.database import get_connection
from apis.entregas.models.entities.Entregas import Entregas


class EntregasModels:

    @classmethod
    def get_all_entregas(cls):
        try:
            connection = get_connection()
            entregas_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_entrega, id_pedido, fecha_entrega
                    FROM entregas
                    ORDER BY fecha_entrega ASC
                """)
                resultset = cursor.fetchall()
                for row in resultset:
                    entrega = Entregas(
                        id_entrega=row[0],
                        id_pedido=row[1],
                        fecha_entrega=row[2]
                    )
                    entregas_list.append(entrega.to_JSON())
            connection.close()
            return entregas_list
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_entrega_by_id(cls, entrega_id):
        try:
            connection = get_connection()
            entrega_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_entrega, id_pedido, fecha_entrega
                    FROM entregas
                    WHERE id_entrega = %s
                """, (entrega_id,))
                row = cursor.fetchone()
                if row:
                    entrega = Entregas(
                        id_entrega=row[0],
                        id_pedido=row[1],
                        fecha_entrega=row[2]
                    )
                    entrega_json = entrega.to_JSON()
            connection.close()
            return entrega_json
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def add_entrega(cls, entrega: Entregas):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO entregas (id_entrega, id_pedido, fecha_entrega)
                    VALUES (%s, %s, %s)
                """, (
                    entrega.id_entrega,
                    entrega.id_pedido,
                    entrega.fecha_entrega
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def update_entrega(cls, entrega: Entregas):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE entregas
                    SET id_pedido = %s,
                        fecha_entrega = %s
                    WHERE id_entrega = %s
                """, (
                    entrega.id_pedido,
                    entrega.fecha_entrega,
                    entrega.id_entrega
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_entrega(cls, entrega: Entregas):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM entregas
                    WHERE id_entrega = %s
                """, (entrega.id_entrega,))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)