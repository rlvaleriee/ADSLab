from flask import Blueprint, jsonify, request
import uuid
from apis.estados.models.EstadosModels import EstadosModels
from apis.estados.models.entities.Estados import Estados

main = Blueprint('estados_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_estados():
    try:
        estados = EstadosModels.get_all_estados()
        if estados:
            return jsonify(estados), 200
        else:
            return jsonify({"message": "No se encontraron estados"}), 200
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/<id>', methods=['GET'])
def get_estado_by_id(id):
    try:
        estado = EstadosModels.get_estado_by_id(id)
        if estado:
            return jsonify(estado)
        else:
            return jsonify({"error": "Estado no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/add', methods=['POST'])
def add_estado():
    try:
        data = request.get_json()

        required_fields = ['nombre_estado', 'descripcion']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        estado = Estados(
            id_estado=str(uuid.uuid4()),
            nombre_estado=data['nombre_estado'],
            descripcion=data['descripcion']
        )

        rows_affected = EstadosModels.add_estado(estado)
        return jsonify({"mensaje": "Estado agregado", "filas_afectadas": rows_affected}), 201
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/update/<id>', methods=['PUT'])
def update_estado(id):
    try:
        data = request.get_json()
        existing_estado = EstadosModels.get_estado_by_id(id)
        if not existing_estado:
            return jsonify({"error": "Estado no encontrado"}), 404
        required_fields = ['nombre_estado', 'descripcion']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        estado = Estados(
            id_estado=id,
            nombre_estado=data.get('nombre_estado'),
            descripcion=data.get('descripcion')
        )
        affected_rows = EstadosModels.update_estado(estado)
        if affected_rows == 1:
            return jsonify({"message": "Estado actualizado correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar el estado"}), 400
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/delete/<id>', methods=['DELETE'])
def delete_estado(id):
    try:
        estado = Estados(id_estado=id, nombre_estado="", descripcion="")
        affected_rows = EstadosModels.delete_estado(estado)
        if affected_rows == 1:
            return jsonify({"message": f"Estado {id} eliminado"}), 200
        else:
            return jsonify({"error": "Estado no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
