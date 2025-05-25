from database.database import get_connection
from apis.notificaciones.models.entities.Notificaciones import Notificaciones


class NotificacionesModels:

    @classmethod
    def get_all_notificaciones(cls):
        try:
            connection = get_connection()
            notificaciones_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id, id_Cliente, fecha_envio, estado
                    FROM notificaciones
                    ORDER BY fecha_envio DESC
                """)
                resultset = cursor.fetchall()
                for row in resultset:
                    notificacion = Notificaciones(
                        id=row[0],
                        id_Cliente=row[1],
                        fecha_envio=row[2],
                        estado=row[3]
                    )
                    notificaciones_list.append(notificacion.to_JSON())
            connection.close()
            return notificaciones_list
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_notificacion_by_id(cls, id_notificacion):
        try:
            connection = get_connection()
            notificacion_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id, id_Cliente, fecha_envio, estado
                    FROM notificaciones
                    WHERE id = %s
                """, (id_notificacion,))
                row = cursor.fetchone()
                if row:
                    notificacion = Notificaciones(
                        id=row[0],
                        id_Cliente=row[1],
                        fecha_envio=row[2],
                        estado=row[3]
                    )
                    notificacion_json = notificacion.to_JSON()
            connection.close()
            return notificacion_json
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def add_notificacion(cls, notificacion: Notificaciones):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO notificaciones (id, id_Cliente, fecha_envio, estado)
                    VALUES (%s, %s, %s, %s)
                """, (
                    notificacion.id,
                    notificacion.id_Cliente,
                    notificacion.fecha_envio,
                    notificacion.estado
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def update_notificacion(cls, notificacion: Notificaciones):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE notificaciones
                    SET estado = %s,
                        fecha_envio = %s
                    WHERE id = %s
                """, (
                    notificacion.estado,
                    notificacion.fecha_envio,
                    notificacion.id
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_notificacion(cls, notificacion: Notificaciones):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM notificaciones
                    WHERE id = %s
                """, (notificacion.id,))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)