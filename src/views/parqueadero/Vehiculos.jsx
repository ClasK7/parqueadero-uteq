import React, { useState, useEffect } from 'react';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CButton, CModal, CModalHeader, CModalTitle,
  CModalBody, CModalFooter, CForm, CFormInput, CBadge, CSpinner, CFormSelect
} from '@coreui/react';
import { useVehiculos } from '../../hooks/useVehiculos';

const Vehiculos = () => {
  const { vehiculos, loading, fetchVehiculos, addVehiculo, updateVehiculo, deleteVehiculo } = useVehiculos();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [vehiculoActual, setVehiculoActual] = useState(null);
  
  // Estado adaptado a las columnas exactas del SQL del profesor
  const [formData, setFormData] = useState({
    placa: '', marca: '', modelo: '', anio: '', color: '', tipo: 'AUTOMOVIL',
    propietario_nombre: '', cedula_propietario: '', correo_institucional: '', autorizado: true,
    foto_url: '', foto_propietario_url: '', foto_fuente_url: 'https://es.wikipedia.org/'
  });

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  const filteredVehiculos = vehiculos.filter(v => 
    v.placa?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.propietario_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // Convierte el valor del select a booleano para la columna 'autorizado'
    const finalValue = (name === 'autorizado') ? (value === 'true') : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  const openAddModal = () => {
    setFormData({ 
      placa: '', marca: '', modelo: '', anio: '', color: '', tipo: 'AUTOMOVIL',
      propietario_nombre: '', cedula_propietario: '', correo_institucional: '', autorizado: true, 
      foto_url: '', foto_propietario_url: '', foto_fuente_url: 'https://es.wikipedia.org/' 
    });
    setVehiculoActual(null);
    setModalVisible(true);
  };

  const openEditModal = (vehiculo) => {
    setFormData({
      ...vehiculo,
      cedula_propietario: vehiculo.cedula_propietario || ''
    });
    setVehiculoActual(vehiculo);
    setModalVisible(true);
  };

  const confirmDelete = (vehiculo) => {
    setVehiculoActual(vehiculo);
    setDeleteModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.placa || !formData.propietario_nombre || !formData.cedula_propietario) {
      alert("La placa, el nombre del propietario y la cédula son obligatorios.");
      return;
    }

    // Clonamos los datos del formulario para no afectar el estado original
    const datosParaGuardar = { ...formData };
    
    // Eliminamos los campos que son generados automáticamente por la base de datos
    delete datosParaGuardar.id;
    delete datosParaGuardar.cedula_enmascarada;
    // Si tu consulta de lectura trae created_at, también elimínalo por precaución:
    delete datosParaGuardar.created_at; 

    let result;
    if (vehiculoActual) {
      result = await updateVehiculo(vehiculoActual.id, datosParaGuardar);
    } else {
      result = await addVehiculo(datosParaGuardar);
    }

    if (result.success) {
      setModalVisible(false);
      fetchVehiculos(); // Recarga la tabla para traer la nueva cédula enmascarada
    } else {
      alert("Error al guardar: " + result.error);
    }
  };

  const handleDelete = async () => {
    const result = await deleteVehiculo(vehiculoActual.id);
    if (result.success) {
      setDeleteModalVisible(false);
    } else {
      alert("Error al eliminar: " + result.error);
    }
  };

  return (
    <div data-coreui-theme="light" style={{ padding: '20px', backgroundColor: '#f3f4f7', minHeight: '100vh' }}>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 shadow-sm border-0">
            <CCardHeader className="bg-white d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0 fw-bold">Vehículos y propietarios</h5>
                <small className="text-muted">Vehículos autorizados en UTEQ Smart Parking</small>
              </div>
              <CButton color="success" onClick={openAddModal} disabled={loading} className="text-white fw-semibold">
                Actualizar / Agregar
              </CButton>
            </CCardHeader>
            <CCardBody className="bg-white">
              
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput 
                    type="text" 
                    placeholder="Buscar placa, vehículo o propietario..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CCol>
                <CCol md={6} className="text-end text-muted align-self-center">
                  {filteredVehiculos.length} vehículos
                </CCol>
              </CRow>

              {loading && !modalVisible && !deleteModalVisible ? (
                <div className="text-center my-5"><CSpinner color="success" /></div>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead style={{ backgroundColor: '#1f2937', color: 'white' }}>
                    <CTableRow>
                      <CTableHeaderCell className="bg-dark text-white border-0">Foto del vehículo</CTableHeaderCell>
                      <CTableHeaderCell className="bg-dark text-white border-0">Placa</CTableHeaderCell>
                      <CTableHeaderCell className="bg-dark text-white border-0">Vehículo</CTableHeaderCell>
                      <CTableHeaderCell className="bg-dark text-white border-0">Año / color</CTableHeaderCell>
                      <CTableHeaderCell className="bg-dark text-white border-0 text-center">Foto del propietario</CTableHeaderCell>
                      <CTableHeaderCell className="bg-dark text-white border-0">Propietario</CTableHeaderCell>
                      <CTableHeaderCell className="bg-dark text-white border-0">Cédula</CTableHeaderCell>
                      <CTableHeaderCell className="bg-dark text-white border-0">Correo</CTableHeaderCell>
                      <CTableHeaderCell className="bg-dark text-white border-0">Estado</CTableHeaderCell>
                      <CTableHeaderCell className="bg-dark text-white border-0">Acciones</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredVehiculos.map((v) => (
                      <CTableRow key={v.id}>
                        <CTableDataCell>
                          <img 
                            src={v.foto_url || `https://ui-avatars.com/api/?name=${v.marca}+${v.modelo}&background=random`} 
                            alt="Vehículo" 
                            style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                          />
                        </CTableDataCell>
                        
                        <CTableDataCell>
                          <CBadge color="dark" className="fs-6 px-3 py-2 rounded-1">{v.placa}</CBadge>
                        </CTableDataCell>
                        
                        <CTableDataCell>
                          <div className="fw-bold">{v.marca}</div>
                          <div className="small text-muted">{v.modelo}</div>
                        </CTableDataCell>
                        
                        <CTableDataCell>
                          <div>{v.anio}</div>
                          <div className="small text-muted">{v.color}</div>
                        </CTableDataCell>
                        
                        <CTableDataCell className="text-center">
                          <img 
                            src={v.foto_propietario_url || `https://ui-avatars.com/api/?name=${v.propietario_nombre}&background=random&rounded=true`} 
                            alt="Propietario" 
                            style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '50%' }} 
                          />
                        </CTableDataCell>
                        
                        <CTableDataCell>
                          <div className="fw-bold">{v.propietario_nombre}</div>
                        </CTableDataCell>
                        
                        <CTableDataCell>{v.cedula_enmascarada || v.cedula_propietario}</CTableDataCell>
                        
                        <CTableDataCell>
                          <a href={`mailto:${v.correo_institucional}`} className="text-decoration-none">{v.correo_institucional}</a>
                        </CTableDataCell>
                        
                        <CTableDataCell>
                          <CBadge color={v.autorizado ? 'success' : 'danger'} shape="rounded-pill">
                            {v.autorizado ? 'Autorizado' : 'No autorizado'}
                          </CBadge>
                        </CTableDataCell>
                        
                        <CTableDataCell>
                          <CButton color="info" variant="ghost" size="sm" onClick={() => openEditModal(v)}>Editar</CButton>
                          <CButton color="danger" variant="ghost" size="sm" onClick={() => confirmDelete(v)}>Borrar</CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Modal Agregar / Editar */}
        <CModal size="lg" visible={modalVisible} onClose={() => setModalVisible(false)} backdrop="static">
          <CModalHeader>
            <CModalTitle>{vehiculoActual ? 'Editar Registro' : 'Nuevo Registro'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <h6 className="text-primary border-bottom pb-2 mb-3">Datos del Vehículo</h6>
              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormInput label="Placa *" name="placa" value={formData.placa} onChange={handleInputChange} disabled={loading} />
                </CCol>
                <CCol md={4}>
                  <CFormInput label="Marca" name="marca" value={formData.marca} onChange={handleInputChange} disabled={loading} />
                </CCol>
                <CCol md={4}>
                  <CFormInput label="Modelo" name="modelo" value={formData.modelo} onChange={handleInputChange} disabled={loading} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={3}>
                  <CFormInput label="Año" name="anio" type="number" value={formData.anio} onChange={handleInputChange} disabled={loading} />
                </CCol>
                <CCol md={3}>
                  <CFormInput label="Color" name="color" value={formData.color} onChange={handleInputChange} disabled={loading} />
                </CCol>
                <CCol md={6}>
                  <CFormInput label="URL Foto del Vehículo" name="foto_url" placeholder="https://ejemplo.com/auto.jpg" value={formData.foto_url} onChange={handleInputChange} disabled={loading} />
                </CCol>
              </CRow>
              
              <h6 className="text-primary border-bottom pb-2 mt-4 mb-3">Datos del Propietario</h6>
              <CRow className="mb-3">
                <CCol md={8}>
                  <CFormInput label="Nombre Completo *" name="propietario_nombre" value={formData.propietario_nombre} onChange={handleInputChange} disabled={loading} />
                </CCol>
                <CCol md={4}>
                  <CFormInput label="Cédula *" name="cedula_propietario" value={formData.cedula_propietario} onChange={handleInputChange} disabled={loading} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={5}>
                  <CFormInput label="Correo" name="correo_institucional" type="email" value={formData.correo_institucional} onChange={handleInputChange} disabled={loading} />
                </CCol>
                <CCol md={4}>
                  <CFormInput label="URL Foto Propietario" name="foto_propietario_url" placeholder="https://ejemplo.com/foto.jpg" value={formData.foto_propietario_url} onChange={handleInputChange} disabled={loading} />
                </CCol>
                <CCol md={3}>
                  <CFormSelect label="Estado" name="autorizado" value={formData.autorizado} onChange={handleInputChange} disabled={loading}>
                    <option value={true}>Autorizado</option>
                    <option value={false}>No autorizado</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)} disabled={loading}>Cancelar</CButton>
            <CButton color="success" className="text-white" onClick={handleSave} disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Guardar Cambios'}
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Modal Eliminar */}
        <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
          <CModalHeader>
            <CModalTitle>Confirmar Eliminación</CModalTitle>
          </CModalHeader>
          <CModalBody>
            ¿Estás seguro de eliminar el vehículo <strong>{vehiculoActual?.placa}</strong> de <strong>{vehiculoActual?.propietario_nombre}</strong>?
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setDeleteModalVisible(false)} disabled={loading}>Cancelar</CButton>
            <CButton color="danger" className="text-white" onClick={handleDelete} disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Eliminar'}
            </CButton>
          </CModalFooter>
        </CModal>
      </CRow>
    </div>
  );
};

export default Vehiculos;