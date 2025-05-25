from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime

from apis.clientes.models.ClientesModels import ClientesModels
from apis.clientes.models.entities.Clientes import Clientes

main = Blueprint('clientes_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_clientes ():
    try:

        clientes = ClientesModels.get_all_clientes ()
        if clientes:
            return jsonify(clientes), 200
        else :
            return jsonify({"message": "No se encontraron clientes"}), 200
    except Exception as ex:
         return jsonify({"error": str(ex)}), 500

@main.route('/<id_cliente>', methods=['GET'])
def get_cliente_by_id(id_cliente):
    try:
        cliente = ClientesModels.get_cliente_by_id(id_cliente)
        if cliente:
            return jsonify(cliente)
        return jsonify({"error": "Cliente no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/add', methods=['POST'])
def add_cliente():
    try:
        data = request.get_json()
        required_fields = ['nombre_cliente', 'telefono']
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing)}"}), 400

        cliente_id = str(uuid.uuid4())
        cliente = Clientes(
            id_cliente=cliente_id,
            nombre_cliente=data['nombre_cliente'],
            telefono=data['telefono'],
            fecha_registro=datetime.now()
        )
        ClientesModels.add_cliente(cliente)
        return jsonify({"message": "Cliente agregado", "id": cliente_id}), 201
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/update/<id_cliente>', methods=['PUT'])
def update_cliente(id_cliente):
    try:
        data = request.get_json()
        cliente_existente = ClientesModels.get_cliente_by_id(id_cliente)
        if not cliente_existente:
            return jsonify({"error": "Cliente no encontrado"}), 404

        required_fields = ['nombre_cliente', 'telefono']
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing)}"}), 400

        cliente = Clientes(
            id_cliente=id_cliente,
            nombre_cliente=data['nombre_cliente'],
            telefono=data['telefono'],
            fecha_registro=datetime.now()
        )
        if ClientesModels.update_cliente(cliente) == 1:
            return jsonify({"message": "Cliente actualizado correctamente"}), 200
        return jsonify({"error": "No se pudo actualizar el cliente"}), 400
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/delete/<id_cliente>', methods=['DELETE'])
def delete_cliente(id_cliente):
    try:
        cliente = Clientes(id_cliente=id_cliente, nombre_cliente="", telefono="", fecha_registro=None)
        if ClientesModels.delete_cliente(cliente) == 1:
            return jsonify({"message": f"Cliente {id_cliente} eliminado"}), 200
        return jsonify({"error": "Cliente no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
