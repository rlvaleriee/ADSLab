import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Proveedor de OAuth de Google para manejar login en toda la app
import { GoogleOAuthProvider } from "@react-oauth/google";
// Enrutamiento con React Router
import { BrowserRouter } from "react-router-dom";
// Definición de rutas privadas y públicas
import AppRoute from "./routes/AppRoute";
import { AuthProvider } from "./context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';


// Montamos la app en el elemento #root
createRoot(document.getElementById("root")!).render(
  <StrictMode>
  {/*Inicializa Google OAuth con tu Client ID desde variables de entorno */}
  <AuthProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AppRoute />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </AuthProvider>
  </StrictMode>
);
