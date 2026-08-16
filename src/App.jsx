import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio";
import "./styles.css";

// Importaciones temporales para evitar errores hasta que programemos estas páginas
import Estacionamiento from "./pages/Estacionamiento";
import DetalleEspacio from "./pages/DetalleEspacio";

export default function App() {
  return (
    <BrowserRouter>
      {/* Barra de navegación global simple */}
      <nav className="navbar">
        <strong>UTEQ Smart Parking</strong>
        <div>
          <a href="/" style={{ color: "white", textDecoration: "none" }}>Inicio</a>
          <a href="/estacionamiento" style={{ color: "#d8f5ea", textDecoration: "none" }}>Parqueadero</a>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/estacionamiento" element={<Estacionamiento />} />
        <Route path="/espacios/:id" element={<DetalleEspacio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}