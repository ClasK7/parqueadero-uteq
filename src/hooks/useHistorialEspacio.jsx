import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase';

export default function useHistorialEspacio(id) {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    if (!id) return;
    const historialRef = ref(db, `historial/${id}`);
    const unsubscribe = onValue(historialRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Ordenamos el historial de más reciente a más antiguo
        const lista = Object.values(data).sort((a, b) => b.fechaHora - a.fechaHora);
        setHistorial(lista);
      } else {
        setHistorial([]);
      }
    });

    return () => unsubscribe();
  }, [id]);

  return { historial };
}