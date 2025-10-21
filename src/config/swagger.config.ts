import { type Options } from "swagger-jsdoc";

// 1. Usa el puerto del SERVIDOR, no de la base de datos
const port = process.env.PORT || "3000";
const apiUrl = process.env.API_URL || `http://localhost:${port}`;
const pre = "/api";

export const swaggerOptions: Options = {
  // 2. 'definition' es la propiedad moderna
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Inventario",
      version: "1.0.0",
      description: "Documentación de la API del Inventario",
    },
    servers: [
      {
        // 3. La URL base completa va aquí
        url: `${apiUrl}${pre}`,
      },
    ],
  },
  // La ruta a los archivos que contienen la documentación
  apis: ["./src/docs/*.yml", "./src/routes/*.ts"],
};