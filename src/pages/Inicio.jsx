import { Link } from 'react-router-dom';

export default function Inicio() {
  return (
    <main className="container centered">
      <div style={{ animation: 'fadeIn 0.8s ease-in-out' }}>
        
        <p className="hero-subtitle">La Central · UTEQ</p>
        
        <h1 className="hero-title">
          Estacionamiento <span>Inteligente</span>
        </h1>
        
        <p className="hero-description">
          Plataforma telemática avanzada para el monitoreo en tiempo real de 80 sensores 
          ultrasónicos. Visualiza la disponibilidad de espacios, accede al mapeo geoespacial 
          y consulta el historial de ocupación de nuestra sede.
        </p>
        
        {/* Único botón de acción, elegante y responsivo */}
        <Link to="/estacionamiento" className="btn-primary">
          Ingresar al Panel de Control &rarr;
        </Link>

      </div>
    </main>
  );
}