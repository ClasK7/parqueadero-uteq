# 🎓 UTEQ Smart Parking - Monitoreo Telemático y Gestión Administrativa

Este proyecto es una plataforma web desarrollada para la gestión y monitoreo del estacionamiento inteligente en la Sede Central de la Universidad Técnica Estatal de Quevedo (UTEQ). El sistema combina una arquitectura en tiempo real para el monitoreo de 80 espacios de parqueo organizados geográficamente, junto con un módulo administrativo relacional para el control estructurado de vehículos y propietarios autorizados.

## 🚀 Características Principales

* **Gestión Administrativa (CRUD Completo):** Panel centralizado para registrar, visualizar, actualizar y eliminar datos de vehículos y propietarios, con generación automática de avatares y enmascaramiento de seguridad para números de cédula.
* **Monitoreo en Tiempo Real:** Lectura y escritura instantánea del estado de los sensores (Libre/Ocupado) mediante Firebase Realtime Database.
* **Simulación Integrada:** Motor de generación de tráfico aleatorio que actualiza distancias ultrasónicas detectadas y registros históricos de forma dinámica.
* **Geolocalización:** Representación interactiva del parqueadero mediante `react-leaflet`, calculando el *bounding box* exacto de cada celda a partir de las coordenadas del terreno.
* **Filtros Dinámicos:** Vistas personalizables de la cuadrícula operativa mediante filtros por estado de ocupación y distribución de columnas.
* **Rutas Dinámicas y Navegación:** Estructura jerárquica con `react-router-dom` para inspeccionar el historial detallado de sensores y acceder al panel de administración.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React 18, Vite
* **Interfaz y Estilos:** CoreUI React, CSS3 Nativo (UI responsiva adaptada a la paleta institucional)
* **Enrutamiento:** React Router DOM
* **Mapas:** Leaflet, React-Leaflet
* **Base de Datos (BaaS):** 
  * Supabase (PostgreSQL para datos relacionales de vehículos y usuarios)
  * Firebase Realtime Database (Para telemetría de sensores)

## ⚙️ Instalación y Ejecución Local

Siga estos pasos exactos para configurar el entorno de desarrollo y ejecutar la aplicación:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/TU_USUARIO/parqueadero-uteq.git](https://github.com/TU_USUARIO/parqueadero-uteq.git)
   cd parqueadero-uteq

2. **Instalar las dependencias:**
    ```bash 
    npm install

3. **Configurar las variables de entorno:**
    ```bash 
    Cree un archivo llamado .env en la raíz absoluta del proyecto y asigne sus credenciales tanto de Firebase como de Supabase:
    # Credenciales de Firebase (Sensores en tiempo real)
    VITE_FIREBASE_API_KEY=tu_api_key
    VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
    VITE_FIREBASE_DATABASE_URL=https://tu_proyecto-default-rtdb.firebaseio.com
    VITE_FIREBASE_PROJECT_ID=tu_proyecto
    VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
    VITE_FIREBASE_APP_ID=tu_app_id

    # Credenciales de Supabase (CRUD Vehículos)
    VITE_SUPABASE_URL=https://tu_proyecto.supabase.co
    VITE_SUPABASE_ANON_KEY=tu_anon_key_publica

4. **Inicializar la Base de Datos (Solo el primer uso):**
Firebase (Sensores): Si su Realtime Database está completamente vacía, inicie la aplicación, diríjase a la página de "Inicio" y haga clic en el botón de Setup para generar la estructura de los 80 sensores.

Supabase (Administración): Diríjase al panel SQL de su proyecto en Supabase, ejecute el script supabase_parqueadero_uteq.sql para crear las tablas y posteriormente configure las políticas de Seguridad de Nivel de Fila (RLS) para permitir las acciones CRUD.

5. **Ejecutar el servidor local:**
    ```bash
    npm run dev
    La aplicación estará disponible y lista para pruebas en http://localhost:5173.

## 👨‍💻 Autor
* Kevin Rolando Vaca Clas
* Estudiante de 8vo Semestre, Ingeniería en Redes Telemáticas.
* Universidad Técnica Estatal de Quevedo (UTEQ).