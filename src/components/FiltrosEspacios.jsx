export default function FiltrosEspacios({ filtroEstado, setFiltroEstado, filtroColumna, setFiltroColumna }) {
  return (
    <div style={{ 
      display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', 
      alignItems: 'center', background: '#f8f9fa', padding: '1rem', 
      borderRadius: '8px', border: '1px solid #dee2e6' 
    }}>
      <strong style={{ color: '#15342f' }}>Filtros de visualización:</strong>
      
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <label htmlFor="estado" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Estado:</label>
        <select 
          id="estado" 
          value={filtroEstado} 
          onChange={(e) => setFiltroEstado(e.target.value)} 
          style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="todos">Todos los estados</option>
          <option value="libre">Solo Libres</option>
          <option value="ocupado">Solo Ocupados</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <label htmlFor="columna" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Columna:</label>
        <select 
          id="columna" 
          value={filtroColumna} 
          onChange={(e) => setFiltroColumna(e.target.value)} 
          style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="todas">Todas las columnas</option>
          <option value="1">Columna 1 (A)</option>
          <option value="2">Columna 2 (B)</option>
          <option value="3">Columna 3 (C)</option>
          <option value="4">Columna 4 (D)</option>
        </select>
      </div>
    </div>
  );
}