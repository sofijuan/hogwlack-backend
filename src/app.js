// Configuración de Express

import express from "express"; // Framework para manejar solicitudes HTTP
import cors from "cors"; // Middleware para manejar CORS (permitir solicitudes desde otros dominios)
import authRoutes from "./routes/auth.route.js"; // Rutas relacionadas con autenticación
import workspaceRoutes from "./routes/workspace.route.js"; // Rutas relacionadas con Workspaces
import channelRoutes from "./routes/channel.route.js"; // Rutas relacionadas con Channels

// Crear una instancia de Express
const app = express();

// Middlewares
app.use(cors()); // Habilitar CORS
app.use(express.json({ limit: "50mb" })); // Permitir recibir y procesar JSON en el cuerpo de las solicitudes

// Rutas
app.use("/api/auth", authRoutes); // Rutas para autenticación
app.use("/api/workspaces", workspaceRoutes); // Rutas para Workspaces
app.use("/api/channels", channelRoutes);

export default app;
