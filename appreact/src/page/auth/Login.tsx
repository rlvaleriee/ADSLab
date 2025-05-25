import { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      {/* Panel de login centrado */}
      <div className="login-panel p-4 bg-white rounded-lg shadow-lg w-200 max-w-md">
        <div className="text-center">
          <FaUserCircle className="text-6xl text-muted mb-4" />
          <h1 className="h4 fw-bold text-dark mb-4">Inicia Sesión</h1>
          <p className="text-secondary mb-5">
            Accede a tu panel de control con tu cuenta de Google
          </p>

          {/* Botón de login con Google */}
          <GoogleLogin
  onSuccess={(res) => {
    if (res.credential) {
      login(res.credential);
      navigate("/");
    }
  }}
  onError={() => alert("Fallo al iniciar sesión")}
  useOneTap
/>
        </div>
      </div>
    </div>
  );
}
