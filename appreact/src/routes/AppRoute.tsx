import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext, JSX } from 'react';
import { AuthContext } from '../context/AuthContext';
import Login from '../page/auth/Login';      // Asegúrate de la mayúscula si el archivo lo tiene
import Dashboard from '../page/main/Dashboard';

function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to="/login" replace />;
}

export default function AppRoute() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
