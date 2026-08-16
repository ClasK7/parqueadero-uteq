import { Link } from 'react-router-dom';

export default function EspacioCard({ espacio }) {
  const isLibre = espacio.estado === 'libre';
  
  const bgColor = isLibre ? '#e6fcf5' : '#ffe3e3';
  const borderColor = isLibre ? '#20c997' : '#fa5252';
  const textColor = isLibre ? '#087f5b' : '#c92a2a';
  
  // Formateamos la hora para que no ocupe tanto espacio visual
  const fechaFormateada = new Date(espacio.fechaHora).toLocaleTimeString('es-EC');

  return (
    <Link to={`/espacios/${espacio.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: bgColor,
        border: `2px solid ${borderColor}`,
        padding: '0.75rem',
        borderRadius: '8px',
        fontSize: '0.8rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        height: '100%',
        boxSizing: 'border-box',
        transition: 'transform 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <strong style={{ fontSize: '1.1rem', color: textColor, borderBottom: `1px solid ${borderColor}`, paddingBottom: '4px' }}>
          {espacio.id}
        </strong>
        <span><strong>Col/Nº:</strong> {espacio.columna} / {espacio.numero}</span>
        <span style={{ textTransform: 'uppercase', color: textColor, fontWeight: 'bold' }}>
          ● {espacio.estado}
        </span>
        <span><strong>Distancia:</strong> {espacio.distanciaDetectada} cm</span>
        <span style={{ fontSize: '0.75rem', color: '#666', marginTop: 'auto' }}>
          🕒 Actualizado: {fechaFormateada}
        </span>
      </div>
    </Link>
  );
}