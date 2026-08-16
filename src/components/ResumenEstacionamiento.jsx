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
      <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <p className="eyebrow" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold' }}>TOTAL</p>
        <strong style={{ fontSize: '2.5rem', color: 'var(--text-main)', lineHeight: '1.2' }}>{total}</strong>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>espacios monitoreados</p>
      </div>
      
      <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderBottom: '4px solid #20c997' }}>
        <p className="eyebrow" style={{ color: '#087f5b', fontSize: '0.85rem', fontWeight: 'bold' }}>DISPONIBLES</p>
        <strong style={{ fontSize: '2.5rem', color: '#087f5b', lineHeight: '1.2' }}>{libres}</strong>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{porcentajeDisponible}% del parqueadero</p>
      </div>

      <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderBottom: '4px solid #fa5252' }}>
        <p className="eyebrow" style={{ color: '#c92a2a', fontSize: '0.85rem', fontWeight: 'bold' }}>OCUPADOS</p>
        <strong style={{ fontSize: '2.5rem', color: '#c92a2a', lineHeight: '1.2' }}>{ocupados}</strong>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{100 - porcentajeDisponible}% del parqueadero</p>
      </div>

      {/* Nuevo indicador de Distribución */}
      <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <p className="eyebrow" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold' }}>DISTRIBUCIÓN</p>
        <strong style={{ fontSize: '2.5rem', color: 'var(--text-main)', lineHeight: '1.2' }}>4 &times; 20</strong>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>columnas &times; espacios</p>
      </div>
    </section>
  );
}