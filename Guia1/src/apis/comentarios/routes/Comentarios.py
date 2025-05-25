from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime

from apis.comentarios.models.ComentariosModels import ComentariosModels
from apis.comentarios.models.entities.Comentarios import Comentarios

main = Blueprint('comentarios_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_comentarios():
    try:
        comentarios = ComentariosModels.get_all_comentarios()
        if comentarios:
            return jsonify(comentarios), 200
        else:
            return jsonify({"message": "No se encontraron comentarios"}), 200
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/<id>', methods=['GET'])
def get_comentario_by_id(id):
    try:
        comentario = ComentariosModels.get_comentario_by_id(id)
        if comentario:
            return jsonify(comentario)
        else:
            return jsonify({"error": "Comentario no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/add', methods=['POST'])
def add_comentario():
    try:
        data = request.get_json()

        required_fields = ['id_pedido', 'id_cliente', 'texto', 'calificacion']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        comentario = Comentarios(
            id_comentario=str(uuid.uuid4()),
            id_pedido=data['id_pedido'],
            id_cliente=data['id_cliente'],
            texto=data['texto'],
            fecha=datetime.now(),
            calificacion=data['calificacion']
        )

        rows_affected = ComentariosModels.add_comentario(comentario)
        return jsonify({'mensaje': 'Comentario agregado', 'filas_afectadas': rows_affected}), 201
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
    
@main.route('/update/<id>', methods=['PUT'])
def update_comentario(id):
    try:
        data = request.get_json()
        existing_comentario = ComentariosModels.get_comentario_by_id(id)
        if not existing_comentario:
            return jsonify({"error": "Comentario no encontrado"}), 404

        comentario = Comentarios(
            id_comentario=id,
            id_pedido=data.get('id_pedido'),
            id_cliente=data.get('id_cliente'),
            texto=data.get('texto'),
            fecha=datetime.now(),
            calificacion=data.get('calificacion')
        )
        affected_rows = ComentariosModels.update_comentario(comentario)
        if affected_rows == 1:
            return jsonify({"message": "Comentario actualizado correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar el comentario"}), 400
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/delete/<id>', methods=['DELETE'])
def delete_comentario(id):
    try:
        comentario = Comentarios(id_comentario=id, id_pedido=None, id_cliente=None, texto="", fecha=None, calificacion=0)
        affected_rows = ComentariosModels.delete_comentario(comentario)
        if affected_rows == 1:
            return jsonify({"message": f"Comentario {id} eliminado"}), 200
        else:
            return jsonify({"error": "Comentario no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
