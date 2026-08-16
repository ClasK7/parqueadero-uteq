export default function HistorialEspacio({ historial }) {
  if (!historial || historial.length === 0) return <p>No hay registros históricos recientes.</p>;

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Fecha y Hora</th>
            <th>Estado</th>
            <th>Distancia Detectada</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((registro, index) => (
            <tr key={index}>
              <td>{new Date(registro.fechaHora).toLocaleString('es-EC')}</td>
              <td style={{ 
                color: registro.estado === 'libre' ? '#087f5b' : '#c92a2a', 
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {registro.estado}
              </td>
              <td>{registro.distanciaDetectada} cm</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}