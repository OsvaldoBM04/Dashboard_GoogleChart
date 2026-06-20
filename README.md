# Dashboard interactivo de productos tecnológicos
## Google Charts + D3.js + Node.js

## Descripción

Este proyecto implementa un dashboard interactivo para analizar el desempeño comercial de productos tecnológicos:

- Smartphone A
- Smartphone B
- Tablet X

La aplicación permite analizar:

- Ventas
- Ingresos
- Precio
- Evolución temporal

utilizando visualizaciones desarrolladas con:

- Google Chart Library
- D3.js


---

# Arquitectura del proyecto

El sistema utiliza una arquitectura cliente-servidor:

Los datos se almacenan en un archivo JSON externo y son consultados mediante una petición HTTP.


---

# Requisitos

Instalar:

- Node.js versión 18 o superior


Verificar instalación:
node -v
npm -v



---

# Instalación

Descargar o clonar el repositorio:
git clone https://github.com/OsvaldoBM04/Dashboard_GoogleChart.git



Ingresar a la carpeta desde gitbash o power shell o cualquier otro interprete:

cd Dashboard_GoogleChart

Continuamos con la instalación de dependencias: npm install



---

# Ejecución

Levantar el servidor: npm start o node server.js

Cuándo aparezca: Servidor iniciado en puerto 3000 la aplicación estará disponible en:http://localhost:3000


---

# Funcionamiento

Al cargar la aplicación:

- Se consulta el archivo JSON mediante:/api/ventas



- Se procesan los datos.
- Se generan las visualizaciones.


---

# Visualizaciones implementadas


## Google Charts

Se incluye:

### Gráfico de columnas

Permite comparar las ventas mensuales por producto.

Dimensiones:

- Eje X → Mes
- Eje Y → Ventas
- Columnas → Producto


### Gráfico circular

Muestra la participación porcentual de ventas por producto.


---

# D3.js

Se implementó un gráfico de burbujas interactivo.

Representación:

- Color → Producto
- Eje X → Ventas
- Eje Y → Ingresos
- Tamaño → Precio


Incluye:

- Animaciones
- Transiciones
- Eventos mouseover
- Tooltip
- Click


---

# Actualización dinámica

El dashboard inicia mostrando los datos base:

- Enero
- Febrero


Al presionar: "Actualizar datos".

la aplicación vuelve a consultar el JSON mediante HTTP y actualiza:

- KPIs
- Tabla resumen
- Google Charts
- D3 Bubble Chart


Esto simula una actualización dinámica de información.




---

# Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- JSON
- Google Charts
- D3.js


---

# Autor

Proyecto desarrollado como actividad académica de visualización interactiva de datos. Osvaldo Bobadilla Mino