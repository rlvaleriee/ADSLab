from database.database import get_connection
from apis.categorias.models.entities.Categorias import Categorias


class CategoriasModels:

    @classmethod
    def get_all_categorias(cls):
        try:
            connection = get_connection()
            categorias_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_categoria, nombre_categoria, descripcion
                    FROM categorias
                    ORDER BY nombre_categoria ASC
                """)
                resultset = cursor.fetchall()
                
                # Verificamos si el resultset está vacío
                if not resultset:
                    return []  # Si no hay categorías, devolvemos una lista vacía

                # Procesamos las filas si hay resultados
                for row in resultset:
                    # Aseguramos que cada fila tenga el número esperado de elementos
                    if len(row) >= 3:
                        categoria = Categorias(
                            id_categoria=row[0],
                            nombre_categoria=row[1],
                            descripcion=row[2]
                        )
                        categorias_list.append(categoria.to_JSON())
                    else:
                        raise ValueError("La respuesta de la base de datos no tiene los campos esperados.")
            
            connection.close()
            return categorias_list
        except Exception as ex:
            raise Exception(f"Error al obtener las categorías: {str(ex)}")


    @classmethod
    def get_categoria_by_id(cls, categoria_id):
        try:
            connection = get_connection()
            categorias_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_categoria, nombre_categoria, descripcion
                    FROM categorias
                    WHERE id_categoria = %s
                """, (categoria_id,))
                row = cursor.fetchone()
                if row is not None:
                    categoria = Categorias(
                        id_categoria=row[0],
                        nombre_categoria=row[1],
                        descripcion=row[2]
                    )
                    categorias_json = categoria.to_JSON()
            connection.close()
            return categorias_json
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def add_categoria(cls, categoria: Categorias):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO categorias (id_categoria, nombre_categoria, descripcion)
                    VALUES (%s, %s, %s)
                """, (
                    categoria.id_categoria,
                    categoria.nombre_categoria,
                    categoria.descripcion
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def update_categoria(cls, categoria: Categorias):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE categorias
                    SET nombre_categoria = %s, descripcion = %s
                    WHERE id_categoria = %s
                """, (
                    categoria.nombre_categoria,
                    categoria.descripcion,
                    categoria.id_categoria
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_categoria(cls, categoria: Categorias):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM categorias
                    WHERE id_categoria = %s
                """, (categoria.id_categoria,))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
