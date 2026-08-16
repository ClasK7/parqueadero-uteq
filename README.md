# 🎓 UTEQ Smart Parking - Monitoreo Telemático en Tiempo Real

Este proyecto es una aplicación web desarrollada para simular y monitorear un estacionamiento inteligente en el Campus La María de la Universidad Técnica Estatal de Quevedo (UTEQ). Utiliza una arquitectura moderna basada en componentes y una base de datos en tiempo real para gestionar 80 espacios de parqueo organizados geográficamente[cite: 4].

## 🚀 Características Principales

* **Monitoreo en Tiempo Real:** Lectura y escritura instantánea del estado de los sensores (Libre/Ocupado) mediante Firebase Realtime Database[cite: 4].
* **Simulación Integrada:** Motor de generación de tráfico aleatorio que actualiza distancias ultrasónicas detectadas y registros históricos de forma dinámica[cite: 4].
* **Geolocalización:** Representación interactiva del parqueadero mediante `react-leaflet`, calculando el *bounding box* exacto de cada celda a partir de las coordenadas del terreno[cite: 4].
* **Filtros Dinámicos:** Vistas personalizables de la cuadrícula operativa mediante filtros por estado de ocupación y distribución de columnas[cite: 4].
* **Rutas Dinámicas:** Navegación jerárquica con `react-router-dom` para inspeccionar el historial detallado y métricas de cada sensor[cite: 4].

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React 18, Vite
* **Enrutamiento:** React Router DOM
* **Mapas:** Leaflet, React-Leaflet
* **Base de Datos (BaaS):** Firebase Realtime Database
* **Estilos:** CSS3 Nativo (UI Responsiva y adaptada a la paleta institucional)

## ⚙️ Instalación y Ejecución Local

Siga estos pasos exactos para configurar el entorno de desarrollo y ejecutar la aplicación[cite: 4]:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/TU_USUARIO/parqueadero-uteq.git](https://github.com/TU_USUARIO/parqueadero-uteq.git)
   cd parqueadero-uteq