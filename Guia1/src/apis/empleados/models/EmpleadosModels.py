from database.database import get_connection
from apis.empleados.models.entities.Empleados import Empleados


class EmpleadosModels:

    @classmethod
    def get_all_empleados(cls):
        try:
            connection = get_connection()
            empleados_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_empleado, nombres, apellidos, correo, telefono, dui
                    FROM empleados
                    ORDER BY apellidos DESC
                """)
                resultset = cursor.fetchall()
                for row in resultset:
                    empleado = Empleados(
                        id_empleado=row[0],
                        nombres=row[1],
                        apellidos=row[2],
                        correo=row[3],
                        telefono=row[4],
                        dui=row[5],
                    )
                    empleados_list.append(empleado.to_JSON())  # Convertimos el objeto Empleados a JSON
            connection.close()
            return empleados_list
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_empleado_by_id(cls, id_empleado):
        try:
            connection = get_connection()
            empleado_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_empleado, nombres, apellidos, correo, telefono, dui
                    FROM empleados
                    WHERE id_empleado = %s
                """, (id_empleado,))
                row = cursor.fetchone()
                if row:
                    empleado = Empleados(
                        id_empleado=row[0],
                        nombres=row[1],
                        apellidos=row[2],
                        correo=row[3],
                        telefono=row[4],
                        dui=row[5],
                       ) 
                    empleado_json = empleado.to_JSON()
            connection.close()
            return empleado_json
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def add_empleado(cls, empleado: Empleados):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO empleados (id_empleado, nombres, apellidos, correo, telefono, dui)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    empleado.id_empleado,
                    empleado.nombres,
                    empleado.apellidos,
                    empleado.correo,
                    empleado.telefono,
                    empleado.dui
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def update_empleado(cls, empleado: Empleados):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE empleados
                    SET nombres = %s,
                        apellidos = %s,
                        correo = %s,
                        telefono = %s,
                        dui = %s
                    WHERE id_empleado = %s
                """, (
                    empleado.nombres,
                    empleado.apellidos,
                    empleado.correo,
                    empleado.telefono,
                    empleado.dui,
                    empleado.id_empleado
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_empleado(cls, empleado: Empleados):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM empleados
                    WHERE id_empleado = %s
                """, (empleado.id_empleado,))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
