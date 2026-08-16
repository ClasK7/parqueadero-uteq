import { useState } from 'react';
import useEspacios from '../hooks/useEspacios';
import ResumenEstacionamiento from '../components/ResumenEstacionamiento';
import CuadriculaEstacionamiento from '../components/CuadriculaEstacionamiento';
import FiltrosEspacios from '../components/FiltrosEspacios';
import MapaEstacionamiento from '../components/MapaEstacionamiento';
import { simularTrafico } from '../services/simulador';

export default function Estacionamiento() {
  const { espacios, cargando } = useEspacios();
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroColumna, setFiltroColumna] = useState('todas');

  if (cargando) return <main className="container centered"><p>Cargando sensores del parqueadero...</p></main>;

  const espaciosFiltrados = espacios.filter(esp => {
    const cumpleEstado = filtroEstado === 'todos' || esp.estado === filtroEstado;
    const cumpleColumna = filtroColumna === 'todas' || esp.columna.toString() === filtroColumna;
    return cumpleEstado && cumpleColumna;
  });

  const latCentro = -1.012416;
  const lngCentro = -79.467881;

  // Lógica funcional para descargar el JSON
  const descargarJSON = () => {
    const exportData = { espacios: {} };
    espacios.forEach(esp => { exportData.espacios[esp.id] = esp; });
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadNode = document.createElement('a');
    downloadNode.setAttribute("href", dataStr);
    downloadNode.setAttribute("download", "parqueadero_rtdb.json");
    document.body.appendChild(downloadNode);
    downloadNode.click();
    downloadNode.remove();
  };

  return (
    <main className="container" style={{ marginTop: '2rem' }}>
      
      {/* Cabecera actualizada tipo Dashboard */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ maxWidth: '650px' }}>
          <p style={{ color: 'var(--uteq-green)', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
            Campus UTEQ · Quevedo
          </p>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: '800', letterSpacing: '-1px' }}>
            Parqueadero inteligente
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Simulación de 80 sensores ultrasónicos organizados en cuatro columnas[cite: 4]. Cada cuadro representa una plaza y se actualiza como si recibiera eventos desde Firebase Realtime Database.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '1rem' }}>
          <button 
            onClick={descargarJSON}
            style={{
              background: 'var(--uteq-dark-green)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              marginBottom: '0.5rem',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Descargar JSON para RTDB
          </button>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Umbral: ocupado si la distancia es menor o igual a 50 cm
          </span>

          {/* Botón de simulación más discreto para pruebas */}
          <button onClick={simularTrafico} style={{ background: 'transparent', color: 'var(--uteq-green)', border: '1px solid var(--uteq-green)', padding: '0.4rem 0.8rem', borderRadius: '4px', marginTop: '1.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
            Simular Movimiento 🚗
          </button>
        </div>
      </header>

      <ResumenEstacionamiento espacios={espacios} />
      
      <FiltrosEspacios 
        filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado}
        filtroColumna={filtroColumna} setFiltroColumna={setFiltroColumna}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Vista Operativa (Cuadrícula)</h2>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
          <span style={{ color: '#087f5b' }}>● Libre</span>
          <span style={{ color: '#c92a2a' }}>● Ocupado</span>
        </div>
      </div>

      <CuadriculaEstacionamiento espacios={espaciosFiltrados} />

      <section style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <h2>Ubicación Geográfica del Parqueadero</h2>
        <MapaEstacionamiento latitud={latCentro} longitud={lngCentro} nombre="Estacionamiento Inteligente UTEQ" />
      </section>
    </main>
  );
}