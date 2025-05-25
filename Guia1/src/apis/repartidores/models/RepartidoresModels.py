from database.database import get_connection
from apis.repartidores.models.entities.Repartidores import Repartidores


class RepartidoresModels:

    @classmethod
    def get_all_repartidores(cls):
        try:
            connection = get_connection()
            repartidores_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_repartidor, nombre_repartidor, telefono, dui, activo
                    FROM repartidores
                    ORDER BY nombre_repartidor ASC
                """)
                resultset = cursor.fetchall()
                for row in resultset:
                    repartidor = Repartidores(
                        id_repartidor=row[0],
                        nombre_repartidor=row[1],
                        telefono=row[2],
                        dui=row[3],
                        activo=row[4]
                    )
                    repartidores_list.append(repartidor.to_JSON())
            connection.close()
            return repartidores_list
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_repartidor_by_id(cls, id_repartidor):
        try:
            connection = get_connection()
            repartidor_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_repartidor, nombre_repartidor, telefono, dui, activo
                    FROM repartidores
                    WHERE id_repartidor = %s
                """, (id_repartidor,))
                row = cursor.fetchone()
                if row:
                    repartidor = Repartidores(
                        id_repartidor=row[0],
                        nombre_repartidor=row[1],
                        telefono=row[2],
                        dui=row[3],
                        activo=row[4]
                    )
                    repartidor_json = repartidor.to_JSON()
            connection.close()
            return repartidor_json
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def add_repartidor(cls, repartidor: Repartidores):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO repartidores (id_repartidor, nombre_repartidor, telefono, dui, activo)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    repartidor.id_repartidor,
                    repartidor.nombre_repartidor,
                    repartidor.telefono,
                    repartidor.dui,
                    repartidor.activo
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def update_repartidor(cls, repartidor: Repartidores):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE repartidores
                    SET nombre_repartidor = %s,
                        telefono = %s,
                        dui = %s,
                        activo = %s
                    WHERE id_repartidor = %s
                """, (
                    repartidor.nombre_repartidor,
                    repartidor.telefono,
                    repartidor.dui,
                    repartidor.activo,
                    repartidor.id_repartidor
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_repartidor(cls, repartidor: Repartidores):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM repartidores
                    WHERE id_repartidor = %s
                """, (repartidor.id_repartidor,))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
