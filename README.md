# 🎓 UTEQ Smart Parking - Monitoreo Telemático en Tiempo Real

Este proyecto es una aplicación web desarrollada para simular y monitorear un estacionamiento inteligente en el Campus La María de la Universidad Técnica Estatal de Quevedo (UTEQ). Utiliza una arquitectura moderna basada en componentes y una base de datos en tiempo real para gestionar 80 espacios de parqueo organizados geográficamente.

## 🚀 Características Principales

* **Monitoreo en Tiempo Real:** Lectura y escritura instantánea del estado de los sensores (Libre/Ocupado) mediante Firebase Realtime Database.
* **Simulación Integrada:** Motor de generación de tráfico aleatorio que actualiza distancias ultrasónicas detectadas y registros históricos de forma dinámica.
* **Geolocalización:** Representación interactiva del parqueadero mediante `react-leaflet`, calculando el *bounding box* exacto de cada celda a partir de las coordenadas del terreno.
* **Filtros Dinámicos:** Vistas personalizables de la cuadrícula operativa mediante filtros por estado de ocupación y distribución de columnas.
* **Rutas Dinámicas:** Navegación jerárquica con `react-router-dom` para inspeccionar el historial detallado y métricas de cada sensor.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React 18, Vite
* **Enrutamiento:** React Router DOM
* **Mapas:** Leaflet, React-Leaflet
* **Base de Datos (BaaS):** Firebase Realtime Database
* **Estilos:** CSS3 Nativo (UI Responsiva y adaptada a la paleta institucional)

## ⚙️ Instalación y Ejecución Local

Siga estos pasos exactos para configurar el entorno de desarrollo y ejecutar la aplicación:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/TU_USUARIO/parqueadero-uteq.git](https://github.com/TU_USUARIO/parqueadero-uteq.git)
   cd parqueadero-uteq

2. **Instalar las dependencias:**
    ```bash npm install

3. **Configurar las variables de entorno:**
    ```bash Cree un archivo llamado .env en la raíz absoluta del proyecto y asigne sus credenciales de Firebase:
    Fragmento de código
    VITE_FIREBASE_API_KEY=tu_api_key
    VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
    VITE_FIREBASE_DATABASE_URL=https://tu_proyecto-default-rtdb.firebaseio.com
    ITE_FIREBASE_PROJECT_ID=tu_proyecto
    VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
    VITE_FIREBASE_APP_ID=tu_app_id

4. **Inicializar la Base de Datos (Solo el primer uso):**
Si su Realtime Database está completamente vacía, inicie la aplicación, diríjase a la página de "Inicio" y haga clic en el botón de Setup ("Generar 80 Sensores"). Esto ejecutará el script matemático que calcula las coordenadas y crea la estructura inicial de los nodos.

5. **Ejecutar el servidor local:**
    ```bash
    npm run dev
    La aplicación estará disponible y lista para pruebas en http://localhost:5173.

## 👨‍💻 Autor
* Kevin Rolando Vaca Clas
* Estudiante de 8vo Semestre, Ingeniería en Redes Telemáticas.
* Universidad Técnica Estatal de Quevedo (UTEQ).