from database.database import get_connection
from apis.estados.models.entities.Estados import Estados


class EstadosModels:

    @classmethod
    def get_all_estados(cls):
        try:
            connection = get_connection()
            estados_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_estado, nombre_estado, descripcion
                    FROM estados
                    ORDER BY nombre_estado ASC
                """)
                resultset = cursor.fetchall()
                for row in resultset:
                    estado = Estados(
                        id_estado=row[0],
                        nombre_estado=row[1],
                        descripcion=row[2]
                    )
                    estados_list.append(estado.to_JSON())
            connection.close()
            return estados_list
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_estado_by_id(cls, id_estado):
        try:
            connection = get_connection()
            estado_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_estado, nombre_estado, descripcion
                    FROM estados
                    WHERE id_estado = %s
                """, (id_estado,))
                row = cursor.fetchone()
                if row:
                    estado = Estados(
                        id_estado=row[0],
                        nombre_estado=row[1],
                        descripcion=row[2]
                    )
                    estado_json = estado.to_JSON()
            connection.close()
            return estado_json
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def add_estado(cls, estado: Estados):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO estados (id_estado, nombre_estado, descripcion)
                    VALUES (%s, %s, %s)
                """, (
                    estado.id_estado,
                    estado.nombre_estado,
                    estado.descripcion
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def update_estado(cls, estado: Estados):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE estados
                    SET nombre_estado = %s,
                        descripcion = %s
                    WHERE id_estado = %s
                """, (
                    estado.nombre_estado,
                    estado.descripcion,
                    estado.id_estado
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_estado(cls, estado: Estados):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM estados
                    WHERE id_estado = %s
                """, (estado.id_estado,))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)