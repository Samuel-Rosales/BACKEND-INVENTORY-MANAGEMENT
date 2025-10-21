# Gestión e Inventario Backend

Backend API para gestionar y manejar el inventario de una empresa o negocio comerciante, construido con Node.js y Express.

## Características

- Registro y gestión de productos
- Seguimiento de entradas y salidas
- Endpoints RESTful

### Validación por capas

- **Validador**: estructura, tipo y existencia básica
- **Controlador**: transformación y flujo
- **Servicio**: lógica de negocio y persistencia


## Stack Tecnológico

- Node.js
- Express
- MySQL (usando el paquete ORM Sequelize)
- Autenticación JWT (En proceso)

## Primeros Pasos

### Requisitos Previos

- Node.js (v18+)
- MySQL

### Instalación

```bash
git https://github.com/Samuel-Rosales/BACKEND-INVENTORY-MANAGEMENT.git
cd BACKEND-INVENTORY-MANAGEMENT
npm install
```

### Variables de Entorno

Crea un archivo `.env` con el siguiente contenido:

```env
DATABASE_PORT=3000
API_URL=
DATABASE_DIALECT=postgres
DATABASE_HOST=localhost
DATABASE_USER=postgres
DATABASE_PASSWORD=[inserta tu contraseña aquí]
DATABASE_NAME=db_inventario
DEV=true
```

### Ejecutar el Servidor

Puedes ejecutar el servidor en diferentes modos según los scripts definidos en `package.json`:

### Comandos Disponibles

- **`npm run build`**  
  Compila el código TypeScript a JavaScript en la carpeta `dist`.

- **`npm run start`**  
  Inicia el servidor en modo producción usando el código compilado en `dist`.

- **`npm run dev`**  
  Compila el código e inicia el servidor en modo desarrollo.

- **`npm run seeds`**  
  Ejecuta los scripts en la carpeta `dist` para poblar la base de datos con datos de ejemplo (semillas).

- **`npm run reset-insert`**  
  Ejecuta un script para resetear la base de datos y volver a poblarla.

- **`npm run reset`**  
  resetea la base de datos completamente dejandola vacía.

Puedes usar estos comandos según el entorno y la necesidad de tu desarrollo.

## Documentación de la API

Consulta [API.md](API.md) para la documentación detallada de los endpoints.

## Licencia

[MIT](LICENSE)