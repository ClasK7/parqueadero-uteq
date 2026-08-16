import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase';

export default function useEspacios() {
  const [espacios, setEspacios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const espaciosRef = ref(db, 'espacios');
    const unsubscribe = onValue(espaciosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convertimos el objeto en array y lo ordenamos por ID (ESP-A01, ESP-A02...)
        const lista = Object.values(data).sort((a, b) => a.id.localeCompare(b.id));
        setEspacios(lista);
      } else {
        setEspacios([]);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  return { espacios, cargando };
}