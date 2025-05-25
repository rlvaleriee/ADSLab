from database.database import get_connection
from apis.productos.models.entities.Productos import Productos


class ProductosModels:

    @classmethod
    def get_all_productos(cls):
        try:
            connection = get_connection()
            productos_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_productos, id_categoria, nombre_producto, descripcion, precio, disponible
                    FROM productos
                    ORDER BY nombre_producto ASC
                """)
                resultset = cursor.fetchall()
                for row in resultset:
                    producto = Productos(
                        id_productos=row[0],
                        id_categoria=row[1],
                        nombre_producto=row[2],
                        descripcion=row[3],
                        precio=row[4],
                        disponible=row[5]
                    )
                    productos_list.append(producto.to_JSON())
            connection.close()
            return productos_list
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_producto_by_id(cls, id_productos):
        try:
            connection = get_connection()
            producto_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_productos, id_categoria, nombre_producto, descripcion, precio, disponible
                    FROM productos
                    WHERE id_productos = %s
                """, (id_productos,))
                row = cursor.fetchone()
                if row:
                    producto = Productos(
                        id_productos=row[0],
                        id_categoria=row[1],
                        nombre_producto=row[2],
                        descripcion=row[3],
                        precio=row[4],
                        disponible=row[5]
                    )
                    producto_json = producto.to_JSON()
            connection.close()
            return producto_json
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def add_producto(cls, producto: Productos):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO productos (id_productos, id_categoria, nombre_producto, descripcion, precio, disponible)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    producto.id_productos,
                    producto.id_categoria,
                    producto.nombre_producto,
                    producto.descripcion,
                    producto.precio,
                    producto.disponible
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def update_producto(cls, producto: Productos):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE productos
                    SET id_categoria = %s,
                        nombre_producto = %s,
                        descripcion = %s,
                        precio = %s,
                        disponible = %s
                    WHERE id_productos = %s
                """, (
                    producto.id_categoria,
                    producto.nombre_producto,
                    producto.descripcion,
                    producto.precio,
                    producto.disponible,
                    producto.id_productos
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_producto(cls, producto: Productos):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM productos
                    WHERE id_productos = %s
                """, (producto.id_productos,))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
