from database.database import get_connection
from apis.clientes.models.entities.Clientes import Clientes


class ClientesModels:

    @classmethod
    def get_all_clientes(cls):
        try:
            connection = get_connection()
            clientes_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_cliente, nombre_cliente, telefono, fecha_registro
                    FROM clientes
                    ORDER BY fecha_registro DESC
                """)
                resultset = cursor.fetchall()
                for row in resultset:
                    cliente = Clientes(
                        id_cliente=row[0],
                        nombre_cliente=row[1],
                        telefono=row[2],
                        fecha_registro=row[3]
                    )
                    clientes_list.append(cliente.to_JSON())
            connection.close()
            return clientes_list
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_cliente_by_id(cls, id_cliente):
        try:
            connection = get_connection()
            cliente_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_cliente, nombre_cliente, telefono, fecha_registro
                    FROM clientes
                    WHERE id_cliente = %s
                """, (id_cliente,))
                row = cursor.fetchone()
                if row:
                    cliente = Clientes(
                        id_cliente=row[0],
                        nombre_cliente=row[1],
                        telefono=row[2],
                        fecha_registro=row[3]
                    )
                    cliente_json = cliente.to_JSON()
            connection.close()
            return cliente_json
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def add_cliente(cls, cliente: Clientes):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO clientes (id_cliente, nombre_cliente, telefono, fecha_registro)
                    VALUES (%s, %s, %s, %s)
                """, (
                    cliente.id_cliente,
                    cliente.nombre_cliente,
                    cliente.telefono,
                    cliente.fecha_registro
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def update_cliente(cls, cliente: Clientes):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE clientes
                    SET nombre_cliente = %s,
                        telefono = %s,
                        fecha_registro = %s
                    WHERE id_cliente = %s
                """, (
                    cliente.nombre_cliente,
                    cliente.telefono,
                    cliente.fecha_registro,
                    cliente.id_cliente
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_cliente(cls, cliente: Clientes):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM clientes
                    WHERE id_cliente = %s
                """, (cliente.id_cliente,))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)