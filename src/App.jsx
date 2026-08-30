import { BrowserRouter, Navigate, Route, Routes, NavLink } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Estacionamiento from "./pages/Estacionamiento";
import DetalleEspacio from "./pages/DetalleEspacio";
import Vehiculos from "./views/parqueadero/Vehiculos"; // <-- Módulo de CoreUI
import Logo from "./components/Logo";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* Barra de navegación con colores UTEQ */}
      <nav className="navbar">
        <div className="navbar-brand">
          {/* Reemplazado el texto por el componente SVG con las medidas de la guía */}
          <Logo width={250} height={58} style={{ color: 'white' }} />
        </div>
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Inicio
          </NavLink>
          <NavLink to="/estacionamiento" className={({ isActive }) => (isActive ? "active" : "")}>
            Monitor de Parqueo
          </NavLink>
          {/* <-- Nuevo enlace al panel de administración --> */}
          <NavLink to="/vehiculos" className={({ isActive }) => (isActive ? "active" : "")}>
            Vehículos y Propietarios
          </NavLink>
        </div>
      </nav>

      {/* Rutas de la aplicación */}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/estacionamiento" element={<Estacionamiento />} />
        <Route path="/espacios/:id" element={<DetalleEspacio />} />
        {/* <-- Nueva ruta del CRUD --> */}
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}