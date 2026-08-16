import { ref, set, update } from "firebase/database";
import { db } from "./firebase";

// Coordenadas base proporcionadas en el PDF
const BBOX = {
  norte: -1.0122617572453996,
  sur: -1.012570971500396,
  oeste: -79.4682998912032,
  este: -79.46746240847104
};

const COLUMNAS = 4;
const FILAS = 20;

// Calcula el tamaño de cada celda en grados
const deltaLat = (BBOX.sur - BBOX.norte) / FILAS;
const deltaLng = (BBOX.este - BBOX.oeste) / COLUMNAS;

const letrasColumnas = ['A', 'B', 'C', 'D'];

// Función 1: Generar la base de datos inicial (80 espacios)
export const inicializarParqueadero = async () => {
  const espacios = {};
  const historial = {};
  const ahora = Date.now();

  for (let col = 0; col < COLUMNAS; col++) {
    for (let fila = 0; fila < FILAS; fila++) {
      const numFila = fila + 1;
      const id = `ESP-${letrasColumnas[col]}${numFila.toString().padStart(2, '0')}`;
      
      // Cálculo del bounding box específico de este cajón
      const cajonNorte = BBOX.norte + (fila * deltaLat);
      const cajonSur = cajonNorte + deltaLat;
      const cajonOeste = BBOX.oeste + (col * deltaLng);
      const cajonEste = cajonOeste + deltaLng;
      
      // Centro del cajón
      const latitudCentral = (cajonNorte + cajonSur) / 2;
      const longitudCentral = (cajonOeste + cajonEste) / 2;

      // Estado inicial aleatorio (para no empezar con todos libres u ocupados)
      const distanciaAleatoria = Math.floor(Math.random() * 250) + 10; // entre 10cm y 260cm
      const estado = distanciaAleatoria <= 50 ? 'ocupado' : 'libre';

      const datosEspacio = {
        id,
        columna: col + 1,
        numero: numFila,
        distanciaDetectada: distanciaAleatoria,
        estado,
        fechaHora: ahora,
        ubicacion: {
          nombre: `Parqueadero UTEQ - Cajón ${id}`,
          latitud: latitudCentral,
          longitud: longitudCentral,
          boundingBox: { norte: cajonNorte, sur: cajonSur, oeste: cajonOeste, este: cajonEste }
        }
      };

      espacios[id] = datosEspacio;
      
      historial[id] = {
        [ahora]: { distanciaDetectada: distanciaAleatoria, estado, fechaHora: ahora }
      };
    }
  }

  // Subir todo a Firebase de un solo golpe
  try {
    await set(ref(db, 'espacios'), espacios);
    await set(ref(db, 'historial'), historial);
    console.log("¡Parqueadero inicializado con éxito!");
  } catch (error) {
    console.error("Error al inicializar:", error);
  }
};

// Función 2: Simular entrada y salida de vehículos aleatoriamente
export const simularTrafico = () => {
  const ahora = Date.now();
  const actualizaciones = {};
  
  // Seleccionamos aleatoriamente entre 1 y 5 espacios para cambiar su estado
  const cantidadCambios = Math.floor(Math.random() * 5) + 1;
  
  for (let i = 0; i < cantidadCambios; i++) {
    const colAleatoria = Math.floor(Math.random() * COLUMNAS);
    const filaAleatoria = Math.floor(Math.random() * FILAS) + 1;
    const id = `ESP-${letrasColumnas[colAleatoria]}${filaAleatoria.toString().padStart(2, '0')}`;
    
    // Generar nueva distancia
    const nuevaDistancia = Math.floor(Math.random() * 250) + 10;
    const nuevoEstado = nuevaDistancia <= 50 ? 'ocupado' : 'libre';

    const nuevoRegistro = {
      distanciaDetectada: nuevaDistancia,
      estado: nuevoEstado,
      fechaHora: ahora
    };

    // Preparamos el objeto de actualización masiva para Firebase
    actualizaciones[`espacios/${id}/distanciaDetectada`] = nuevaDistancia;
    actualizaciones[`espacios/${id}/estado`] = nuevoEstado;
    actualizaciones[`espacios/${id}/fechaHora`] = ahora;
    actualizaciones[`historial/${id}/${ahora}`] = nuevoRegistro;
  }

  // Ejecutamos la actualización
  update(ref(db), actualizaciones)
    .then(() => console.log(`${cantidadCambios} sensores actualizados (Simulación)`))
    .catch(err => console.error(err));
};