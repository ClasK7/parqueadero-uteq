// src/hooks/useVehiculos.jsx
import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase'; // Asegúrate de que la ruta coincida

export const useVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Leer (Read): Extrae los datos ordenados por los más recientes
  // Leer (Read): Extrae los datos ordenados alfabéticamente
  const fetchVehiculos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('vehiculos')
        .select('*')
        .order('propietario_nombre', { ascending: true }); // <-- Esta línea mantiene el orden

      if (error) throw error;
      setVehiculos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear (Create): Inserta un registro y actualiza el estado local
  const addVehiculo = async (nuevoVehiculo) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('vehiculos')
        .insert([nuevoVehiculo])
        .select();

      if (error) throw error;
      
      // Añade el nuevo vehículo al inicio del listado en pantalla
      setVehiculos((prev) => [data[0], ...prev]);
      return { success: true, data: data[0] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar (Update): Modifica un registro existente
  const updateVehiculo = async (id, datosActualizados) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('vehiculos')
        .update(datosActualizados)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      // Actualiza solo el vehículo modificado en el estado local
      setVehiculos((prev) => prev.map((v) => (v.id === id ? data[0] : v)));
      return { success: true, data: data[0] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar (Delete): Borra un registro de la base de datos
  const deleteVehiculo = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('vehiculos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remueve el vehículo eliminado del listado en pantalla
      setVehiculos((prev) => prev.filter((v) => v.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    vehiculos,
    loading,
    error,
    fetchVehiculos,
    addVehiculo,
    updateVehiculo,
    deleteVehiculo,
  };
};