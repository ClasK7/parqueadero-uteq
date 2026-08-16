import { useState } from 'react';
import useEspacios from '../hooks/useEspacios';
import ResumenEstacionamiento from '../components/ResumenEstacionamiento';
import CuadriculaEstacionamiento from '../components/CuadriculaEstacionamiento';
import FiltrosEspacios from '../components/FiltrosEspacios';
import MapaEstacionamiento from '../components/MapaEstacionamiento';
import { simularTrafico } from '../services/simulador';

export default function Estacionamiento() {
  const { espacios, cargando } = useEspacios();
  
  // Estados para controlar los filtros
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroColumna, setFiltroColumna] = useState('todas');

  if (cargando) return <main className="container centered"><p>Cargando sensores del parqueadero...</p></main>;

  // Lógica de filtrado en tiempo real
  const espaciosFiltrados = espacios.filter(esp => {
    const cumpleEstado = filtroEstado === 'todos' || esp.estado === filtroEstado;
    const cumpleColumna = filtroColumna === 'todas' || esp.columna.toString() === filtroColumna;
    return cumpleEstado && cumpleColumna;
  });

  // Coordenadas centrales del Bounding Box global para el mapa principal
  const latCentro = -1.012416;
  const lngCentro = -79.467881;

  return (
    <main className="container" style={{ marginTop: '2rem' }}>
      <header className="page-header" style={{ alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow">Monitor en Tiempo Real</p>
          <h1>Disponibilidad del Parqueadero</h1>
        </div>
        
        <button onClick={simularTrafico} className="button-link" style={{ cursor: 'pointer', border: 'none' }}>
          Simular Movimiento de Autos 🚗
        </button>
      </header>

      {/* Tarjetas de estadísticas globales */}
      <ResumenEstacionamiento espacios={espacios} />
      
      {/* Nuevo componente de Filtros */}
      <FiltrosEspacios 
        filtroEstado={filtroEstado} 
        setFiltroEstado={setFiltroEstado}
        filtroColumna={filtroColumna} 
        setFiltroColumna={setFiltroColumna}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Vista Operativa (Cuadrícula)</h2>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
          <span style={{ color: '#087f5b' }}>● Libre</span>
          <span style={{ color: '#c92a2a' }}>● Ocupado</span>
        </div>
      </div>

      {/* Le pasamos a la cuadrícula solo los espacios que pasaron el filtro */}
      <CuadriculaEstacionamiento espacios={espaciosFiltrados} />

      {/* Nuevo Mapa General de Ubicación */}
      <section style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <h2>Ubicación Geográfica del Parqueadero</h2>
        <MapaEstacionamiento 
           latitud={latCentro} 
           longitud={lngCentro} 
           nombre="Estacionamiento Inteligente UTEQ (Área Completa)" 
        />
      </section>
    </main>
  );
}