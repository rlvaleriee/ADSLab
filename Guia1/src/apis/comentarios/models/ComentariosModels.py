from database.database import get_connection
from apis.comentarios.models.entities.Comentarios import Comentarios


class ComentariosModels:

    @classmethod
    def get_all_comentarios(cls):
        try:
            connection = get_connection()
            comentarios_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_comentario, id_pedido, id_cliente, texto, fecha, calificacion
                    FROM comentarios
                    ORDER BY fecha DESC
                """)
                resultset = cursor.fetchall()
                for row in resultset:
                    comentario = Comentarios(
                        id_comentario=row[0],
                        id_pedido=row[1],
                        id_cliente=row[2],
                        texto=row[3],
                        fecha=row[4],
                        calificacion=row[5]
                    )
                    comentarios_list.append(comentario.to_JSON())
            connection.close()
            return comentarios_list
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_comentario_by_id(cls, id_comentario):
        try:
            connection = get_connection()
            comentario_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_comentario, id_pedido, id_cliente, texto, fecha, calificacion
                    FROM comentarios
                    WHERE id_comentario = %s
                """, (id_comentario,))
                row = cursor.fetchone()
                if row:
                    comentario = Comentarios(
                        id_comentario=row[0],
                        id_pedido=row[1],
                        id_cliente=row[2],
                        texto=row[3],
                        fecha=row[4],
                        calificacion=row[5]
                    )
                    comentario_json = comentario.to_JSON()
            connection.close()
            return comentario_json
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def add_comentario(cls, comentario: Comentarios):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO comentarios (id_comentario, id_pedido, id_cliente, texto, fecha, calificacion)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    comentario.id_comentario,
                    comentario.id_pedido,
                    comentario.id_cliente,
                    comentario.texto,
                    comentario.fecha,
                    comentario.calificacion
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def update_comentario(cls, comentario: Comentarios):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE comentarios
                    SET texto = %s,
                        calificacion = %s
                    WHERE id_comentario = %s
                """, (
                    comentario.texto,
                    comentario.calificacion,
                    comentario.id_comentario
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_comentario(cls, comentario: Comentarios):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM comentarios
                    WHERE id_comentario = %s
                """, (comentario.id_comentario,))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
