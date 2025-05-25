from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime

from apis.productos.models.ProductosModels import ProductosModels
from apis.productos.models.entities.Productos import Productos

main = Blueprint('productos_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_productos():
    try:
        productos = ProductosModels.get_all_productos()
        if productos:
            return jsonify(productos), 200
        else:
            return jsonify({"message": "No se encontraron productos"}), 200
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/<id>', methods=['GET'])
def get_producto_by_id(id):
    try:
        producto = ProductosModels.get_producto_by_id(id)
        if producto:
            return jsonify(producto)
        else:
            return jsonify({"error": "Producto no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/add', methods=['POST'])
def add_producto():
    try:
        data = request.get_json()

        required_fields = ['id_categoria', 'nombre_producto', 'descripcion', 'precio']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        producto = Productos(
            id_productos=str(uuid.uuid4()),
            id_categoria=data['id_categoria'],
            nombre_producto=data['nombre_producto'],
            descripcion=data['descripcion'],
            precio=data['precio'],
            disponible=data.get('disponible', True)
        )

        rows_affected = ProductosModels.add_producto(producto)
        return jsonify({"mensaje": "Producto agregado", "filas_afectadas": rows_affected}), 201
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/update/<id>', methods=['PUT'])
def update_producto(id):
    try:
        data = request.get_json()
        existing_producto = ProductosModels.get_producto_by_id(id)
        if not existing_producto:
            return jsonify({"error": "Producto no encontrado"}), 404
        required_fields = ['id_categoria', 'nombre_producto', 'descripcion', 'precio']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        producto = Productos(
            id_productos=id,
            id_categoria=data.get('id_categoria'),
            nombre_producto=data.get('nombre_producto'),
            descripcion=data.get('descripcion'),
            precio=data.get('precio'),
            disponible=data.get('disponible', True)
        )
        affected_rows = ProductosModels.update_producto(producto)
        if affected_rows == 1:
            return jsonify({"message": "Producto actualizado correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar el producto"}), 400
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/delete/<id>', methods=['DELETE'])
def delete_producto(id):
    try:
        producto = Productos(id_productos=id, id_categoria=None, nombre_producto="", descripcion="", precio=0.0, disponible=True)
        affected_rows = ProductosModels.delete_producto(producto)
        if affected_rows == 1:
            return jsonify({"message": f"Producto {id} eliminado"}), 200
        else:
            return jsonify({"error": "Producto no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
