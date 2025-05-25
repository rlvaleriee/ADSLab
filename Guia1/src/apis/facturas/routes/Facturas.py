from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime

from apis.facturas.models.FacturasModels import FacturasModels
from apis.facturas.models.entities.Facturas import Facturas

main = Blueprint('facturas_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_facturas():
    try:
        facturas = FacturasModels.get_all_facturas()
        if facturas:
            return jsonify(facturas), 200
        else:
            return jsonify({"message": "No se encontraron facturas"}), 200
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/<id>', methods=['GET'])
def get_factura_by_id(id):
    try:
        factura = FacturasModels.get_factura_by_id(id)
        if factura:
            return jsonify(factura)
        else:
            return jsonify({"error": "Factura no encontrada"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/add', methods=['POST'])
def add_factura():
    try:
        data = request.get_json()
        required_fields = ['id_pedido', 'subtotal', 'impuestos', 'total', 'metodo_pago']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        factura = Facturas(
            id_factura=str(uuid.uuid4()),
            id_pedido=data['id_pedido'],
            fecha_emision=datetime.now(),
            subtotal=data['subtotal'],
            impuestos=data['impuestos'],
            total=data['total'],
            metodo_pago=data['metodo_pago']
        )

        rows_affected = FacturasModels.add_factura(factura)
        return jsonify({"mensaje": "Factura agregada", "filas_afectadas": rows_affected}), 201
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/update/<id>', methods=['PUT'])
def update_factura(id):
    try:
        data = request.get_json()
        existing_factura = FacturasModels.get_factura_by_id(id)
        if not existing_factura:
            return jsonify({"error": "Factura no encontrada"}), 404

        factura = Facturas(
            id_factura=id,
            id_pedido=data.get('id_pedido'),
            fecha_emision=datetime.now(),
            subtotal=data.get('subtotal'),
            impuestos=data.get('impuestos'),
            total=data.get('total'),
            metodo_pago=data.get('metodo_pago')
        )
        affected_rows = FacturasModels.update_factura(factura)
        if affected_rows == 1:
            return jsonify({"message": "Factura actualizada correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar la factura"}), 400
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500


@main.route('/delete/<id>', methods=['DELETE'])
def delete_factura(id):
    try:
        factura = Facturas(id_factura=id, id_pedido=None, fecha_emision=None, subtotal=0, impuestos=0, total=0, metodo_pago="")
        affected_rows = FacturasModels.delete_factura(factura)
        if affected_rows == 1:
            return jsonify({"message": f"Factura {id} eliminada"}), 200
        else:
            return jsonify({"error": "Factura no encontrada"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
