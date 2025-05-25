from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from config.config import app_config
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from flask_login import LoginManager

# Importaciones de rutas
from apis.categorias.routes import Categorias
from apis.repartidores.routes import Repartidores
from apis.entregas.routes import Entregas
from apis.clientes.routes import Clientes
from apis.productos.routes import Productos
from apis.estados.routes import Estados
from apis.facturas.routes import Facturas
from apis.comentarios.routes import Comentarios
from apis.telefonos.routes import Telefonos
from apis.notificaciones.routes import Notificaciones
from apis.pedidos.routes import Pedidos

login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(app_config['development'])
    
    # Configuración de CORS
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

    # Inicialización de login_manager
    login_manager.init_app(app)

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"error": "Unauthorized"}), 401

    # Client ID de Google (debes poner tu propio CLIENT_ID)
    CLIENT_ID = "29983538807-rbuh6fme4ht9rtjhc1gb45u22gaq0hb8.apps.googleusercontent.com"

    # Ruta para autenticar con Google
    @app.route('/api/auth/google', methods=['POST'])
    def google_auth():
        token = request.json.get('token')  # Obtener el token enviado por el frontend
        if not token:
            return jsonify({"error": "No token provided"}), 400

        try:
            # Verificar el token con el Client ID
            idinfo = id_token.verify_oauth2_token(token, Request(), CLIENT_ID)

            # Extraemos la información del usuario
            user_info = {
                "name": idinfo.get("name"),
                "email": idinfo.get("email"),
                "picture": idinfo.get("picture")
            }

            # Aquí podrías guardar al usuario en la base de datos si lo deseas

            return jsonify({"success": True, "user": user_info})

        except ValueError as e:
            # Si la verificación falla
            return jsonify({"error": "Token inválido o expirado"}), 400

    # Responder a las solicitudes OPTIONS sin hacer nada, solo con un 200 OK
    @app.before_request
    def handle_preflight():
        if request.method == 'OPTIONS':
            return '', 200

    # Ruta de ejemplo
    @app.route('/api/some_endpoint', methods=['GET', 'POST'])
    def some_endpoint():
        return 'Success'

    # Añadir encabezados de seguridad
    @app.after_request
    def add_security_headers(response):
        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
        response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
        return response

    # Registrar Blueprints
    app.register_blueprint(Repartidores.main, url_prefix='/api/repartidores')
    app.register_blueprint(Clientes.main, url_prefix='/api/clientes')
    app.register_blueprint(Productos.main, url_prefix='/api/productos')
    app.register_blueprint(Estados.main, url_prefix='/api/estados')
    app.register_blueprint(Facturas.main, url_prefix='/api/facturas')
    app.register_blueprint(Categorias.main, url_prefix='/api/categorias')
    app.register_blueprint(Entregas.main, url_prefix='/api/entregas')
    app.register_blueprint(Comentarios.main, url_prefix='/api/comentarios')
    app.register_blueprint(Telefonos.main, url_prefix='/api/telefonos')
    app.register_blueprint(Notificaciones.main, url_prefix='/api/notificaciones')
    app.register_blueprint(Pedidos.main, url_prefix='/api/pedidos')

    # Ruta principal
    @app.route('/')
    def principal():
        return "<h1>Bienvenido a mi aplicación con Flask</h1>"

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="localhost", port=5000)
