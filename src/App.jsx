import { BrowserRouter, Navigate, Route, Routes, NavLink } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Estacionamiento from "./pages/Estacionamiento";
import DetalleEspacio from "./pages/DetalleEspacio";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* Barra de navegación con colores UTEQ */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span style={{ fontSize: '1.5rem' }}>🎓</span> UTEQ Smart Parking
        </div>
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Inicio
          </NavLink>
          <NavLink to="/estacionamiento" className={({ isActive }) => (isActive ? "active" : "")}>
            Monitor de Parqueo
          </NavLink>
        </div>
      </nav>

      {/* Rutas de la aplicación */}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/estacionamiento" element={<Estacionamiento />} />
        <Route path="/espacios/:id" element={<DetalleEspacio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}