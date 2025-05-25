from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime

from apis.telefonos.models.TelefonosModels import TelefonosModels
from apis.telefonos.models.entities.Telefonos import Telefonos

main = Blueprint('telefonos_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_telefonos():
    try:
        telefonos = TelefonosModels.get_all_telefonos()
        if telefonos:
            return jsonify(telefonos), 200
        else:
            return jsonify({"message": "No se encontraron teléfonos"}), 200
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/<id>', methods=['GET'])
def get_telefono_by_id(id):
    try:
        telefono = TelefonosModels.get_telefono_by_id(id)
        if telefono:
            return jsonify(telefono)
        else:
            return jsonify({"error": "Teléfono no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/add', methods=['POST'])
def add_telefono():
    try:
        data = request.get_json()
        required_fields = ['id_cliente', 'numero_telefono']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        telefono = Telefonos(
            id_telefono=str(uuid.uuid4()),
            id_cliente=data['id_cliente'],
            numero_telefono=data['numero_telefono'],
            fecha_creacion=datetime.now()
        )

        rows_affected = TelefonosModels.add_telefono(telefono)
        return jsonify({"mensaje": "Teléfono agregado", "filas_afectadas": rows_affected}), 201
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/update/<id>', methods=['PUT'])
def update_telefono(id):
    try:
        data = request.get_json()
        existing_telefono = TelefonosModels.get_telefono_by_id(id)
        if not existing_telefono:
            return jsonify({"error": "Telefono no encontrado"}), 404

        telefono = Telefonos(
            id_telefono=id,
            id_cliente=data.get('id_cliente'),
            numero_telefono=data.get('numero_telefono'),
            fecha_creacion=datetime.now()
        )
        affected_rows = TelefonosModels.update_telefono(telefono)
        if affected_rows == 1:
            return jsonify({"message": "Telefono actualizado correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar el telefono"}), 400
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/delete/<id>', methods=['DELETE'])
def delete_telefono(id):
    try:
        telefono = Telefonos(id_telefono=id, id_cliente="", numero_telefono="", fecha_creacion=None)
        affected_rows = TelefonosModels.delete_telefono(telefono)
        if affected_rows == 1:
            return jsonify({"message": f"Telefono {id} eliminado"}), 200
        else:
            return jsonify({"error": "Telefono no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
