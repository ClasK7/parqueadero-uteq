export default function ResumenEstacionamiento({ espacios }) {
  const total = espacios.length;
  const libres = espacios.filter(e => e.estado === 'libre').length;
  const ocupados = espacios.filter(e => e.estado === 'ocupado').length;
  const porcentajeDisponible = total > 0 ? Math.round((libres / total) * 100) : 0;

  return (
    <section style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1rem', 
      marginBottom: '2rem' 
    }}>
      <div className="sensor-card">
        <div>
          <p className="eyebrow">TOTAL</p>
          <strong style={{ fontSize: '2.5rem' }}>{total}</strong>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>espacios monitoreados</p>
        </div>
      </div>
      
      <div className="sensor-card" style={{ borderBottom: '4px solid #087f5b' }}>
        <div>
          <p className="eyebrow" style={{ color: '#087f5b' }}>DISPONIBLES</p>
          <strong style={{ fontSize: '2.5rem', color: '#087f5b' }}>{libres}</strong>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>{porcentajeDisponible}% del parqueadero</p>
        </div>
      </div>

      <div className="sensor-card" style={{ borderBottom: '4px solid #d32f2f' }}>
        <div>
          <p className="eyebrow" style={{ color: '#d32f2f' }}>OCUPADOS</p>
          <strong style={{ fontSize: '2.5rem', color: '#d32f2f' }}>{ocupados}</strong>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>{100 - porcentajeDisponible}% del parqueadero</p>
        </div>
      </div>
    </section>
  );
}