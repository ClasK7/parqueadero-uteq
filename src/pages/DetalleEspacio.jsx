import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase';
import useHistorialEspacio from '../hooks/useHistorialEspacio';
import HistorialEspacio from '../components/HistorialEspacio';
import MapaEstacionamiento from '../components/MapaEstacionamiento';

export default function DetalleEspacio() {
  const { id } = useParams(); // Obtenemos el ID desde la URL
  const [espacio, setEspacio] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  // Usamos el hook que creamos previamente para el historial
  const { historial } = useHistorialEspacio(id);

  // Escuchamos los cambios en tiempo real solo de este espacio
  useEffect(() => {
    const espacioRef = ref(db, `espacios/${id}`);
    const unsubscribe = onValue(espacioRef, (snapshot) => {
      if (snapshot.exists()) {
        setEspacio(snapshot.val());
      } else {
        setEspacio(null);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (cargando) return <main className="container centered"><p>Cargando información del espacio...</p></main>;
  if (!espacio) return (
    <main className="container centered">
      <h2>Espacio no encontrado</h2>
      <Link to="/estacionamiento" className="button-link">← Volver al Parqueadero</Link>
    </main>
  );

  const isLibre = espacio.estado === 'libre';

  return (
    <main className="container" style={{ marginTop: '2rem' }}>
      <header className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow">Sensor Seleccionado</p>
          <h1>{espacio.id}</h1>
        </div>
        <Link to="/estacionamiento" className="button-link" style={{ background: '#333' }}>
          ← Regresar
        </Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Columna Izquierda: Datos del Sensor */}
        <section className="sensor-card" style={{ display: 'block' }}>
          <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Información Actual</h2>
          
          <div style={{ margin: '1rem 0' }}>
            <span style={{ 
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              background: isLibre ? '#e6fcf5' : '#ffe3e3',
              color: isLibre ? '#087f5b' : '#c92a2a',
            }}>
              ● Estado: {espacio.estado}
            </span>
          </div>

          <p><strong>Ubicación:</strong> {espacio.ubicacion.nombre}</p>
          <p><strong>Columna:</strong> {espacio.columna} | <strong>Número:</strong> {espacio.numero}</p>
          <p><strong>Distancia Detectada:</strong> {espacio.distanciaDetectada} cm</p>
          <p><strong>Última Actualización:</strong> {new Date(espacio.fechaHora).toLocaleString('es-EC')}</p>
          
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem' }}>
            <strong>Bounding Box (Límites geográficos):</strong>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0 0 0' }}>
              <li>Norte: {espacio.ubicacion.boundingBox.norte}</li>
              <li>Sur: {espacio.ubicacion.boundingBox.sur}</li>
              <li>Este: {espacio.ubicacion.boundingBox.este}</li>
              <li>Oeste: {espacio.ubicacion.boundingBox.oeste}</li>
            </ul>
          </div>
        </section>

        {/* Columna Derecha: Mapa y Detalles Geográficos */}
        <section className="sensor-card" style={{ display: 'block', padding: 0, overflow: 'hidden' }}>
           <MapaEstacionamiento 
              latitud={espacio.ubicacion.latitud} 
              longitud={espacio.ubicacion.longitud} 
              nombre={espacio.ubicacion.nombre}
           />
        </section>
      </div>

      {/* Fila Inferior: Historial */}
      <section className="table-panel" style={{ marginTop: '2rem' }}>
        <h2>Historial de Cambios</h2>
        <HistorialEspacio historial={historial} />
      </section>

    </main>
  );
}