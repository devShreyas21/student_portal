import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Project Management Portal API",
      version: "1.0.0",
      description:
        "API documentation for the Student Project Management Portal (MERN stack)",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
      {
        url: "https://student-portal-ten-chi.vercel.app/",
        description: "Production server (Vercel)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // <- scans all your route files
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
