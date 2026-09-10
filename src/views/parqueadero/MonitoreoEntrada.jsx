import React, { useState, useRef, useEffect } from 'react';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CSpinner, CAlert,
  CBadge, CTable, CTableBody, CTableRow, CTableDataCell, CTableHeaderCell
} from '@coreui/react';

const MonitoreoEntrada = () => {
  const [imageBlob, setImageBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Apagar la cámara si el usuario cambia de página
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setError('');
    setResult(null);
    setImageBlob(null);
    setPreviewUrl(null);
    try {
      // Solicita acceso a la cámara, priorizando la trasera en móviles
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convierte el canvas a Blob binario para enviarlo a la API
      canvas.toBlob((blob) => {
        setImageBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const handleFileUpload = (e) => {
    setError('');
    setResult(null);
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Formato no admitido. Selecciona una imagen JPG o PNG.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('La imagen es demasiado pesada (Máx 4MB).');
      return;
    }

    setImageBlob(file);
    setPreviewUrl(URL.createObjectURL(file));
    stopCamera();
  };

  const processImage = async () => {
    if (!imageBlob) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(import.meta.env.VITE_OCR_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': imageBlob.type || 'application/octet-stream',
        },
        body: imageBlob, // Se envía binario puro, no Base64
      });

      if (!response.ok) {
        switch (response.status) {
          case 400: throw new Error('Imagen vacía, inválida o dimensiones no permitidas.');
          case 413: throw new Error('Imagen superior a 4 MiB.');
          case 415: throw new Error('Formato no admitido por el servidor.');
          case 502: throw new Error('Fallo del servicio OCR o de la base de datos Supabase.');
          case 504: throw new Error('Tiempo de espera agotado.');
          default: throw new Error(`Error HTTP: ${response.status}`);
        }
      }

      const data = await response.json();
      setResult(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetProcess = () => {
    setResult(null);
    setImageBlob(null);
    setPreviewUrl(null);
    setError('');
  };

  return (
    <div data-coreui-theme="light" style={{ padding: '20px', backgroundColor: '#f3f4f7', minHeight: '100vh' }}>
      <CRow className="mb-4">
        <CCol>
          <h4 className="fw-bold mb-0">Monitoreo de entrada</h4>
          <small className="text-muted">Reconocimiento automático de placas en tiempo real.</small>
        </CCol>
      </CRow>

      <CRow>
        {/* COLUMNA IZQUIERDA: Captura */}
        <CCol md={6}>
          <CCard className="mb-4 shadow-sm border-0">
            <CCardHeader className="bg-white py-3 fw-bold">
              📷 Imagen procesada
            </CCardHeader>
            <CCardBody className="text-center">
              
              {!isCameraActive && !previewUrl && (
                <div className="py-5 bg-light rounded mb-3 border">
                  <p className="text-muted">No hay imagen seleccionada</p>
                </div>
              )}

              {/* Contenedor del video */}
              <div style={{ display: isCameraActive ? 'block' : 'none' }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px', backgroundColor: '#000' }} />
                <div className="mt-3 d-flex justify-content-center gap-2">
                  <CButton color="success" onClick={captureImage} className="text-white">📸 Capturar Fotografía</CButton>
                  <CButton color="secondary" onClick={stopCamera}>Detener</CButton>
                </div>
              </div>

              {/* Contenedor de la imagen previsualizada */}
              {previewUrl && (
                <div>
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }} />
                  {!loading && !result && (
                    <div className="mt-3">
                      <CButton color="primary" size="lg" onClick={processImage} className="w-100 fw-bold">
                        🔍 Detectar placa
                      </CButton>
                    </div>
                  )}
                </div>
              )}

              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Controles iniciales */}
              {!isCameraActive && !result && !loading && (
                <div className="mt-4 d-flex justify-content-center gap-3">
                  <CButton color="success" variant="outline" onClick={startCamera}>
                    Activar Cámara
                  </CButton>
                  <div>
                    <input type="file" id="file-upload" accept="image/jpeg, image/png" style={{ display: 'none' }} onChange={handleFileUpload} ref={fileInputRef} />
                    <CButton color="dark" variant="outline" onClick={() => fileInputRef.current.click()}>
                      ↑ Subir imagen
                    </CButton>
                  </div>
                </div>
              )}

              {loading && (
                <div className="mt-4 py-3">
                  <CSpinner color="primary" />
                  <p className="mt-2 fw-bold text-primary">Procesando imagen con OCR...</p>
                </div>
              )}

              {error && <CAlert color="danger" className="mt-3">{error}</CAlert>}

            </CCardBody>
          </CCard>
        </CCol>

        {/* COLUMNA DERECHA: Resultados */}
        <CCol md={6}>
          <CCard className="mb-4 shadow-sm border-0 h-100">
            <CCardHeader className="bg-white py-3 fw-bold">
              📑 Resultado del reconocimiento
            </CCardHeader>
            <CCardBody>
              {!result && !loading && (
                <div className="text-center text-muted py-5 mt-5">
                  Esperando imagen para procesar...
                </div>
              )}

              {result && (
                <>
                  {/* Alertas según el estado devuelto por el JSON */}
                  {result.estado === 'no_registrado' && (
                    <CAlert color="danger" className="text-center fw-bold fs-5">
                      ⚠️ VEHÍCULO NO REGISTRADO
                    </CAlert>
                  )}
                  {result.estado === 'sin_placa' && (
                    <CAlert color="warning" className="text-center fw-bold">No se detectó ninguna placa en la imagen.</CAlert>
                  )}
                  {result.estado === 'baja_confianza' && (
                    <CAlert color="warning" className="text-center fw-bold">Baja confianza en OCR. Capture la imagen nuevamente.</CAlert>
                  )}
                  {result.estado === 'multiples_placas' && (
                    <CAlert color="warning" className="text-center fw-bold">Se detectaron múltiples placas. Aisla el vehículo.</CAlert>
                  )}

                  {/* Renderizado de la imagen procesada por el profesor (Base64) */}
                  {result.imagen_marcada && (
                    <div className="text-center mb-4">
                      <img 
                        src={`data:${result.imagen_marcada.mime_type};base64,${result.imagen_marcada.base64}`} 
                        alt="Vehículo con placa detectada" 
                        style={{ width: '100%', borderRadius: '8px', border: '3px solid #2eb85c' }}
                      />
                    </div>
                  )}

                  {/* Tabla de resultados básicos del OCR */}
                  <CTable bordered hover responsive className="mb-4">
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell className="bg-light w-50">Placa detectada</CTableHeaderCell>
                        <CTableDataCell className="fw-bold fs-5">{result.placa || 'N/A'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell className="bg-light">Confianza OCR</CTableHeaderCell>
                        <CTableDataCell>{result.confianza ? `${(result.confianza * 100).toFixed(1)} %` : 'N/A'}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell className="bg-light">Estado OCR</CTableHeaderCell>
                        <CTableDataCell>
                          <CBadge color={result.estado === 'encontrado' ? 'success' : 'secondary'}>{result.estado}</CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>

                  {/* Datos de Supabase (Solo si está registrado) */}
                  {result.estado === 'encontrado' && result.vehiculo && (
                    <>
                      <h6 className="fw-bold text-success border-bottom pb-2 mb-3">Datos del Sistema (Supabase)</h6>
                      <CRow className="mb-3 align-items-center">
                        <CCol xs={4} className="text-center">
                          <img src={result.vehiculo.foto_propietario_url} alt="Propietario" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} />
                        </CCol>
                        <CCol xs={8}>
                          <p className="mb-1 fw-bold">{result.vehiculo.propietario_nombre}</p>
                          <p className="mb-1 text-muted">{result.vehiculo.cedula_enmascarada}</p>
                          <CBadge color={result.vehiculo.autorizado ? 'success' : 'danger'}>
                            {result.vehiculo.autorizado ? 'Autorizado' : 'No autorizado'}
                          </CBadge>
                        </CCol>
                      </CRow>
                      
                      <CTable size="sm" bordered>
                        <CTableBody>
                          <CTableRow><CTableHeaderCell className="bg-light">Vehículo</CTableHeaderCell><CTableDataCell>{result.vehiculo.marca} {result.vehiculo.modelo}</CTableDataCell></CTableRow>
                          <CTableRow><CTableHeaderCell className="bg-light">Año / Color</CTableHeaderCell><CTableDataCell>{result.vehiculo.anio} / {result.vehiculo.color}</CTableDataCell></CTableRow>
                          <CTableRow><CTableHeaderCell className="bg-light">Tipo</CTableHeaderCell><CTableDataCell>{result.vehiculo.tipo}</CTableDataCell></CTableRow>
                        </CTableBody>
                      </CTable>
                    </>
                  )}

                  {/* Mensaje de denegación */}
                  {result.estado === 'no_registrado' && (
                    <CAlert color="danger" variant="solid" className="mt-3">
                      <strong>Ingreso no autorizado:</strong> La placa detectada no existe en la base de datos de Supabase.
                    </CAlert>
                  )}

                  <div className="mt-4 text-center">
                    <CButton color="dark" onClick={resetProcess} className="px-4">Procesar otra imagen</CButton>
                  </div>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default MonitoreoEntrada;