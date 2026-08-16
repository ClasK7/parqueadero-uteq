import { Link } from 'react-router-dom';
import { inicializarParqueadero } from '../services/simulador';

export default function Inicio() {
  const handleInit = async () => {
    await inicializarParqueadero();
    alert("¡Éxito! Base de datos inicializada con los 80 espacios calculados.");
  };

  return (
    <main className="container centered">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <p className="eyebrow">Campus La María · UTEQ</p>
        <h1>Estacionamiento Inteligente</h1>
        <p style={{ color: '#5c706a', lineHeight: '1.6', marginBottom: '2rem' }}>
          Sistema telemático de monitoreo en tiempo real simulando 80 sensores ultrasónicos 
          organizados en cuatro columnas. Visualización en vivo del estado (Libre/Ocupado) 
          y mapeo geoespacial del terreno.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/estacionamiento" className="button-link">
            Ingresar al Parqueadero →
          </Link>
          
          {/* Este botón lo usamos solo la primera vez para llenar Firebase */}
          <button 
            onClick={handleInit} 
            style={{ padding: '.75rem 1rem', borderRadius: '10px', background: '#333', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Generar 80 Sensores (Setup)
          </button>
        </div>
      </div>
    </main>
  );
}