import React, { useState, useEffect } from 'react';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CButton, CModal, CModalHeader, CModalTitle,
  CModalBody, CModalFooter, CForm, CFormInput, CBadge, CSpinner, CFormSelect
} from '@coreui/react';
import { useVehiculos } from '../../hooks/useVehiculos'; // Ajusta la ruta si es necesario

const Vehiculos = () => {
  const { vehiculos, loading, fetchVehiculos, addVehiculo, updateVehiculo, deleteVehiculo } = useVehiculos();
  
  // Estados de la interfaz
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [vehiculoActual, setVehiculoActual] = useState(null); // null = Agregar, Objeto = Editar
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    placa: '', marca: '', modelo: '', anio: '', color: '', 
    propietario_nombre: '', cedula: '', correo: '', estado: 'Autorizado'
  });

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  // Filtrado de búsqueda (Placa o Propietario)
  const filteredVehiculos = vehiculos.filter(v => 
    v.placa.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.propietario_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejo del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setFormData({ placa: '', marca: '', modelo: '', anio: '', color: '', propietario_nombre: '', cedula: '', correo: '', estado: 'Autorizado' });
    setVehiculoActual(null);
    setModalVisible(true);
  };

  const openEditModal = (vehiculo) => {
    setFormData(vehiculo);
    setVehiculoActual(vehiculo);
    setModalVisible(true);
  };

  const confirmDelete = (vehiculo) => {
    setVehiculoActual(vehiculo);
    setDeleteModalVisible(true);
  };

  const handleSave = async () => {
    // Validación básica requerida por la rúbrica
    if (!formData.placa || !formData.propietario_nombre || !formData.cedula) {
      alert("La placa, el nombre del propietario y la cédula son obligatorios.");
      return;
    }

    let result;
    if (vehiculoActual) {
      result = await updateVehiculo(vehiculoActual.id, formData);
    } else {
      result = await addVehiculo(formData);
    }

    if (result.success) {
      setModalVisible(false);
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
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Vehículos y propietarios</strong>
            <CButton color="success" onClick={openAddModal} disabled={loading}>
              + Agregar Nuevo
            </CButton>
          </CCardHeader>
          <CCardBody>
            {/* Buscador */}
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput 
                  type="text" 
                  placeholder="Buscar placa o propietario..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CCol>
              <CCol md={6} className="text-end text-muted">
                {filteredVehiculos.length} vehículos encontrados
              </CCol>
            </CRow>

            {/* Tabla Principal */}
            {loading && !modalVisible && !deleteModalVisible ? (
              <div className="text-center my-5"><CSpinner color="primary" /></div>
            ) : (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>Placa</CTableHeaderCell>
                    <CTableHeaderCell>Vehículo</CTableHeaderCell>
                    <CTableHeaderCell>Propietario</CTableHeaderCell>
                    <CTableHeaderCell>Cédula</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredVehiculos.map((v) => (
                    <CTableRow key={v.id}>
                      <CTableDataCell><strong>{v.placa}</strong></CTableDataCell>
                      <CTableDataCell>
                        <div>{v.marca} {v.modelo}</div>
                        <div className="small text-muted">{v.anio} | {v.color}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{v.propietario_nombre}</div>
                        <div className="small text-muted">{v.correo}</div>
                      </CTableDataCell>
                      <CTableDataCell>{v.cedula}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={v.estado === 'Autorizado' ? 'success' : 'danger'}>
                          {v.estado}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton color="info" variant="ghost" size="sm" onClick={() => openEditModal(v)}>Editar</CButton>
                        <CButton color="danger" variant="ghost" size="sm" onClick={() => confirmDelete(v)} className="ms-2">Eliminar</CButton>
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
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} backdrop="static">
        <CModalHeader>
          <CModalTitle>{vehiculoActual ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput label="Placa *" name="placa" value={formData.placa} onChange={handleInputChange} disabled={loading} />
              </CCol>
              <CCol md={6}>
                <CFormInput label="Marca" name="marca" value={formData.marca} onChange={handleInputChange} disabled={loading} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput label="Modelo" name="modelo" value={formData.modelo} onChange={handleInputChange} disabled={loading} />
              </CCol>
              <CCol md={3}>
                <CFormInput label="Año" name="anio" type="number" value={formData.anio} onChange={handleInputChange} disabled={loading} />
              </CCol>
              <CCol md={3}>
                <CFormInput label="Color" name="color" value={formData.color} onChange={handleInputChange} disabled={loading} />
              </CCol>
            </CRow>
            <hr />
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput label="Nombre del Propietario *" name="propietario_nombre" value={formData.propietario_nombre} onChange={handleInputChange} disabled={loading} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput label="Cédula *" name="cedula" value={formData.cedula} onChange={handleInputChange} disabled={loading} />
              </CCol>
              <CCol md={6}>
                <CFormInput label="Correo" name="correo" type="email" value={formData.correo} onChange={handleInputChange} disabled={loading} />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={12}>
                <CFormSelect label="Estado" name="estado" value={formData.estado} onChange={handleInputChange} disabled={loading}>
                  <option value="Autorizado">Autorizado</option>
                  <option value="Bloqueado">Bloqueado</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)} disabled={loading}>Cancelar</CButton>
          <CButton color="primary" onClick={handleSave} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Guardar Cambios'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Confirmación Eliminar */}
      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Estás seguro que deseas eliminar el vehículo con placa <strong>{vehiculoActual?.placa}</strong> perteneciente a <strong>{vehiculoActual?.propietario_nombre}</strong>? Esta acción no se puede deshacer.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)} disabled={loading}>Cancelar</CButton>
          <CButton color="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Sí, Eliminar'}
          </CButton>
        </CModalFooter>
      </CModal>

    </CRow>
  );
};

export default Vehiculos;