from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime

from apis.notificaciones.models.NotificacionesModels import NotificacionesModels
from apis.notificaciones.models.entities.Notificaciones import Notificaciones
from apis.notificaciones.services.servicesTwilio import send_whatsapp_message
from apis.notificaciones.services.consulta_notificaciones import get_notification_data
from apis.telefonos.models.TelefonosModels import TelefonosModels

main = Blueprint('notificaciones_blueprint', __name__)


@main.route('/', methods=['GET'])
def get_notificaciones():
    try:
        notificaciones = NotificacionesModels.get_all_notificaciones()
        return jsonify(notificaciones), 200
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/<id>', methods=['GET'])
def get_notificacion_by_id(id):
    try:
        notificacion = NotificacionesModels.get_notificacion_by_id(id)
        if notificacion:
            return jsonify(notificacion), 200
        else:
            return jsonify({"error": "Notificación no encontrada"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/add', methods=['POST'])
def add_notificacion():
    try:
        data = request.get_json()
        required_fields = ['id_Cliente', 'fecha_envio', 'estado']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        id_Cliente = data.get('id_Cliente')
        fecha_envio_str = data.get('fecha_envio')
        estado = data.get('estado')
        try:
            fecha_envio = datetime.strptime(fecha_envio_str, "%Y-%m-%d")
        except Exception:
            return jsonify({
                "error": "Formato de fecha_envio invalido, se requiere YYYY-MM-DD"
            }), 400

        notificacion_id = str(uuid.uuid4())
        notificaciones = Notificaciones(
            id=notificacion_id,
            id_Cliente=id_Cliente,
            fecha_envio=fecha_envio,
            estado=estado
        )

        affected_rows = NotificacionesModels.add_notificacion(notificaciones)
        if affected_rows != 1:
            return jsonify({"error": "No se pudo agregar la notificación"}), 500

        client_data = get_notification_data(id_Cliente)
        if client_data:
            client_info = client_data[0]
            message_body = (
                "Notificación para el cliente:\n" +
                "Nombre: " + client_info.get('nombre_cliente', 'N/A') +
                "Fecha de envío: " + fecha_envio_str + "\n" +
                "Estado: " + estado
            )
        else:
            message_body = "No se encontraron datos del cliente para esta notificación."

        telefonos = TelefonosModels.get_all_telefonos()
        if not telefonos:
            return jsonify({"error": "No se encontraron destinatarios registrados"}), 404

        send_results = {}
        for tel in telefonos:
            numero = str(tel.get("numero_telefono", "")).strip() 
            if not numero:
                send_results["Numero no definido"] = {
                    "status": "Error",
                    "error": "Número de teléfono vacío"
                }
                continue

            if not numero.startswith('+'):
                phone_number = "+503" + numero
            else:
                phone_number = numero

            try:
                sid = send_whatsapp_message(phone_number, message_body)
                send_results[phone_number] = {"status": "Enviado", "sid": sid}
            except Exception as e:
                send_results[phone_number] = {"status": "Error", "error": str(e)}

        return jsonify({
            "id_notificacion": notificaciones.id,
            "message": "Notificación agregada y mensajes enviados",
            "send_results": send_results
        }), 200

    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/update/<id>', methods=['PUT'])
def update_notificacion(id):
    try:
        data = request.get_json()
        existing_notificacion = NotificacionesModels.get_notificacion_by_id(id)
        if not existing_notificacion:
            return jsonify({"error": "Notificación no encontrada"}), 404

        notificacion = Notificaciones(
            id=id,
            id_Cliente=data.get('id_Cliente'),
            fecha_envio=datetime.now(),
            estado=data.get('estado')
        )
        affected_rows = NotificacionesModels.update_notificacion(notificacion)
        if affected_rows == 1:
            return jsonify({"message": "Notificación actualizada correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar la notificación"}), 400
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/delete/<id>', methods=['DELETE'])
def delete_notificacion(id):
    try:
        notificacion = Notificaciones(id=id, id_Cliente=None, fecha_envio=None, estado="")
        affected_rows = NotificacionesModels.delete_notificacion(notificacion)
        if affected_rows == 1:
            return jsonify({"message": f"Notificación {id} eliminada"}), 200
        else:
            return jsonify({"error": "Notificación no encontrada"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
