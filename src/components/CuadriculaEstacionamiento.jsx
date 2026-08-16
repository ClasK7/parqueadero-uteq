import EspacioCard from './EspacioCard';

export default function CuadriculaEstacionamiento({ espacios }) {
  return (
    <div style={{
      background: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '16px',
      border: '1px solid #dee2e6',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)', // 4 Columnas exactas
      gap: '10px'
    }}>
      {espacios.map(esp => (
        <EspacioCard key={esp.id} espacio={esp} />
      ))}
    </div>
  );
}