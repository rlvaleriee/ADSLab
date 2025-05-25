from database.database import get_connection

def get_notification_data(cliente_id):
    connection = get_connection()
    query = """
        SELECT nombre_cliente, telefono, fecha_registro
        FROM clientes WHERE id_cliente = %s
    """
    results = []

    try:
        with connection.cursor() as cursor:
            cursor.execute(query, (cliente_id,))
            rows = cursor.fetchall()
            for row in rows:
                results.append({
                    "nombre_cliente": row[0],
                    "telefono": row[1],
                    "fecha_registro": row[2]
                })
    except Exception as e:
        raise Exception(f"Error al ejecutar get_notification_data: {str(e)}")
    finally:
        connection.close()

    return results
