from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime

from apis.entregas.models.EntregasModels import EntregasModels
from apis.entregas.models.entities.Entregas import Entregas

main = Blueprint('entregas_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_entregas():
    try:
        entregas = EntregasModels.get_all_entregas()
        if entregas:
            return jsonify(entregas), 200
        else:
            return jsonify({"message": "No se encontraron entregas"}), 200
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/<id>', methods=['GET'])
def get_entrega_by_id(id):
    try:
        entrega = EntregasModels.get_entrega_by_id(id)
        if entrega:
            return jsonify(entrega)
        else:
            return jsonify({"error": "Entrega no encontrada"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/add', methods=['POST'])
def add_entrega():
    try:
        data = request.get_json()

        required_fields = ['id_pedido', 'fecha_entrega']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        entrega = Entregas(
            id_entrega=str(uuid.uuid4()),
            id_pedido=data['id_pedido'],
            fecha_entrega=data['fecha_entrega']
        )

        rows_affected = EntregasModels.add_entrega(entrega)
        return jsonify({"mensaje": "Entrega registrada", "filas_afectadas": rows_affected}), 201
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/update/<id>', methods=['PUT'])
def update_entrega(id):
    try:
        data = request.get_json()
        existing_entrega = EntregasModels.get_entrega_by_id(id)
        if not existing_entrega:
            return jsonify({"error": "Entrega no encontrada"}), 404

        entrega = Entregas(
            id_entrega=id,
            id_pedido=data.get('id_pedido'),
            fecha_entrega=data.get('fecha_entrega')
        )
        affected_rows = EntregasModels.update_entrega(entrega)
        if affected_rows == 1:
            return jsonify({"message": "Entrega actualizada correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar la entrega"}), 400
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/delete/<id>', methods=['DELETE'])
def delete_entrega(id):
    try:
        entrega = Entregas(id_entrega=id, id_pedido=None, fecha_entrega=None)
        affected_rows = EntregasModels.delete_entrega(entrega)
        if affected_rows == 1:
            return jsonify({"message": f"Entrega {id} eliminada"}), 200
        else:
            return jsonify({"error": "Entrega no encontrada"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
