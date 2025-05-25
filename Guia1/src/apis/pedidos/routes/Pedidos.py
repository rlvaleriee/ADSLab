from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime

from apis.pedidos.models.PedidosModels import PedidosModels
from apis.pedidos.models.entities.Pedidos import Pedidos

main = Blueprint('pedidos_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_pedidos():
    try:
        pedidos = PedidosModels.get_all_pedidos()
        if pedidos:
            return jsonify(pedidos), 200
        else:
            return jsonify({"message": "No se encontraron pedidos"}), 200
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/<id>', methods=['GET'])
def get_pedido_by_id(id):
    try:
        pedido = PedidosModels.get_pedido_by_id(id)
        if pedido:
            return jsonify(pedido)
        else:
            return jsonify({"error": "Pedido no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/add', methods=['POST'])
def add_pedido():
    try:
        data = request.get_json()

        required_fields = ['id_cliente', 'id_estado', 'id_repartidor', 'direccion']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        pedido = Pedidos(
            id_pedido=str(uuid.uuid4()),
            id_cliente=data['id_cliente'],
            fecha_pedido=datetime.now(),
            id_estado=data['id_estado'],
            id_repartidor=data['id_repartidor'],
            direccion=data['direccion']
        )

        rows_affected = PedidosModels.add_pedido(pedido)
        return jsonify({"mensaje": "Pedido registrado", "filas_afectadas": rows_affected}), 201
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
    
@main.route('/update/<id>', methods=['PUT'])
def update_pedido(id):
    try:
        data = request.get_json()
        existing_pedido = PedidosModels.get_pedido_by_id(id)
        if not existing_pedido:
            return jsonify({"error": "Pedido no encontrado"}), 404
        required_fields = ['id_cliente', 'id_estado', 'id_repartidor', 'direccion']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        pedido = Pedidos(
            id_pedido=id,
            id_cliente=data.get('id_cliente'),
            fecha_pedido=datetime.now(),
            id_estado=data.get('id_estado'),
            id_repartidor=data.get('id_repartidor'),
            direccion=data.get('direccion')
        )
        affected_rows = PedidosModels.update_pedido(pedido)
        if affected_rows == 1:
            return jsonify({"message": "Pedido actualizado correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar el pedido"}), 400
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/delete/<id>', methods=['DELETE'])
def delete_pedido(id):
    try:
        pedido = Pedidos(id_pedido=id, id_cliente=None, fecha_pedido=None, id_estado=None, id_repartidor=None, direccion="")
        affected_rows = PedidosModels.delete_pedido(pedido)
        if affected_rows == 1:
            return jsonify({"message": f"Pedido {id} eliminado"}), 200
        else:
            return jsonify({"error": "Pedido no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
